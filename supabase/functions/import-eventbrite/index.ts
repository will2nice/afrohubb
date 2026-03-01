import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EVENTBRITE_API = "https://www.eventbriteapi.com/v3";

// Diaspora-relevant search keywords
const SEARCH_KEYWORDS = [
  "afrobeats",
  "african",
  "caribbean",
  "diaspora",
  "afro",
  "jollof",
  "amapiano",
  "dancehall",
  "soca",
  "afro house",
  "afrofuturism",
  "black culture",
  "hip hop",
  "r&b",
  "gospel brunch",
  "african art",
  "black networking",
];

// City name to Eventbrite location mapping
const CITY_LOCATIONS: Record<string, string> = {
  nyc: "New York",
  atlanta: "Atlanta",
  houston: "Houston",
  chicago: "Chicago",
  dc: "Washington DC",
  la: "Los Angeles",
  miami: "Miami",
  dallas: "Dallas",
  detroit: "Detroit",
  philly: "Philadelphia",
  charlotte: "Charlotte",
  london: "London",
  paris: "Paris",
  toronto: "Toronto",
  montreal: "Montreal",
};

interface EventbriteEvent {
  id: string;
  name: { text: string };
  description: { text: string } | null;
  start: { utc: string; local: string };
  end: { utc: string; local: string } | null;
  url: string;
  logo: { original: { url: string } } | null;
  venue_id: string | null;
  category_id: string | null;
  is_free: boolean;
  capacity: number | null;
  organizer_id: string | null;
}

interface EventbriteVenue {
  name: string;
  address: {
    city: string;
    region: string;
    country: string;
    localized_address_display: string;
  };
}

async function fetchEventbriteEvents(
  token: string,
  locationQuery: string,
  keyword: string
): Promise<EventbriteEvent[]> {
  const params = new URLSearchParams({
    "q": keyword,
    "location.address": locationQuery,
    "location.within": "30mi",
    "sort_by": "date",
    "expand": "venue",
  });

  const res = await fetch(
    `${EVENTBRITE_API}/events/search/?${params.toString()}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) {
    const body = await res.text();
    console.error(`Eventbrite search failed [${res.status}]: ${body}`);
    return [];
  }

  const data = await res.json();
  return data.events || [];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const EVENTBRITE_TOKEN = Deno.env.get("EVENTBRITE_API_TOKEN");
    if (!EVENTBRITE_TOKEN) {
      throw new Error("EVENTBRITE_API_TOKEN is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body for optional filters
    let targetCities: string[] = Object.keys(CITY_LOCATIONS);
    let maxKeywords = 3; // limit keywords per city to avoid rate limits
    try {
      const body = await req.json();
      if (body.cities) targetCities = body.cities;
      if (body.max_keywords) maxKeywords = body.max_keywords;
    } catch {
      // No body, use defaults
    }

    let totalImported = 0;
    let totalSkipped = 0;
    const errors: string[] = [];

    // Use a system user ID for imported events
    const SYSTEM_USER_ID = "00000000-0000-0000-0000-000000000000";

    for (const cityId of targetCities) {
      const locationQuery = CITY_LOCATIONS[cityId];
      if (!locationQuery) continue;

      // Pick a subset of keywords to avoid rate limits
      const keywords = SEARCH_KEYWORDS.slice(0, maxKeywords);

      for (const keyword of keywords) {
        try {
          const events = await fetchEventbriteEvents(
            EVENTBRITE_TOKEN,
            locationQuery,
            keyword
          );

          for (const ev of events) {
            // Check if already imported
            const { data: existing } = await supabase
              .from("events")
              .select("id")
              .eq("external_id", ev.id)
              .eq("source", "eventbrite")
              .maybeSingle();

            if (existing) {
              totalSkipped++;
              continue;
            }

            // Determine venue/location
            let venueName = "";
            if ((ev as any).venue) {
              venueName =
                (ev as any).venue.name ||
                (ev as any).venue.address?.localized_address_display ||
                "";
            }

            // Determine category from keyword
            const categoryMap: Record<string, string> = {
              afrobeats: "Concert",
              amapiano: "Concert",
              dancehall: "Concert",
              soca: "Concert",
              "afro house": "Concert",
              "hip hop": "Concert",
              "r&b": "Concert",
              african: "Festival",
              caribbean: "Festival",
              diaspora: "Festival",
              afro: "Festival",
              jollof: "Festival",
              afrofuturism: "Art",
              "african art": "Art",
              "black culture": "Art",
              "gospel brunch": "Brunch",
              "black networking": "Networking",
            };

            const { error: insertError } = await supabase.from("events").insert({
              title: ev.name.text,
              description: ev.description?.text?.substring(0, 500) || "",
              date: ev.start.utc,
              end_date: ev.end?.utc || null,
              city: cityId,
              location: venueName,
              image_url: ev.logo?.original?.url || null,
              price: ev.is_free ? "Free" : "Tickets",
              capacity: ev.capacity,
              category: categoryMap[keyword.toLowerCase()] || "Event",
              creator_id: SYSTEM_USER_ID,
              source: "eventbrite",
              external_id: ev.id,
              external_url: ev.url,
              is_approved: true, // auto-approve imported events
            });

            if (insertError) {
              errors.push(`Insert failed for ${ev.id}: ${insertError.message}`);
            } else {
              totalImported++;
            }
          }
        } catch (err) {
          errors.push(`Search failed for ${cityId}/${keyword}: ${err.message}`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        imported: totalImported,
        skipped: totalSkipped,
        errors: errors.slice(0, 10),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Import error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
