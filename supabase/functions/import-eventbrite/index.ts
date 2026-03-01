import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CITY_SLUGS: Record<string, string> = {
  dallas: "Dallas--TX",
  austin: "Austin--TX",
  sanantonio: "San-Antonio--TX",
  houston: "Houston--TX",
  nyc: "New-York--NY",
  atlanta: "Atlanta--GA",
  chicago: "Chicago--IL",
  dc: "Washington--DC",
  losangeles: "Los-Angeles--CA",
  la: "Los-Angeles--CA",
  miami: "Miami--FL",
  london: "London--United-Kingdom",
  paris: "Paris--France",
  toronto: "Toronto--Canada",
};

// Normalize city IDs to match app's cityData
const CITY_NORMALIZE: Record<string, string> = {
  la: "losangeles",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FIRECRAWL_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    if (!FIRECRAWL_KEY) throw new Error("FIRECRAWL_API_KEY is not configured");
    const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let city = "dallas";
    let keyword = "afrobeats";
    try {
      const body = await req.json();
      if (body.city) city = body.city;
      if (body.keyword) keyword = body.keyword;
    } catch { /* defaults */ }

    const slug = CITY_SLUGS[city];
    // Normalize city ID for DB storage
    const dbCity = CITY_NORMALIZE[city] || city;
    if (!slug) {
      return new Response(
        JSON.stringify({ success: false, error: `Unknown city: ${city}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const searchUrl = `https://www.eventbrite.com/d/${slug}/${keyword}/`;
    console.log("Step 1: Scraping", searchUrl);

    // Step 1: Scrape as markdown (fast)
    const scrapeRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FIRECRAWL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: searchUrl,
        formats: ["markdown"],
        waitFor: 2000,
      }),
    });

    if (!scrapeRes.ok) {
      const errText = await scrapeRes.text();
      console.error(`Firecrawl error [${scrapeRes.status}]:`, errText);
      throw new Error(`Firecrawl scrape failed: ${scrapeRes.status}`);
    }

    const scrapeData = await scrapeRes.json();
    const markdown = scrapeData?.data?.markdown || scrapeData?.markdown || "";
    console.log(`Step 1 done. Markdown length: ${markdown.length}`);

    if (markdown.length < 100) {
      return new Response(
        JSON.stringify({ success: true, city, imported: 0, skipped: 0, total_found: 0, message: "No content found on page" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Use AI to extract events from markdown
    console.log("Step 2: Parsing events with AI");
    const aiRes = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You extract event data from scraped Eventbrite pages. Return ONLY valid JSON, no markdown code fences."
          },
          {
            role: "user",
            content: `Extract all events from this Eventbrite search results page. Return a JSON object with an "events" array. Each event should have: title, date (ISO 8601 format like 2025-03-15T20:00:00), location (venue name), price (string like "Free" or "$25"), url (eventbrite URL if found), image_url (if found). Only include actual events, not ads or navigation. Here is the page content:\n\n${markdown.substring(0, 8000)}`
          }
        ],
        temperature: 0,
        max_tokens: 4000,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error(`AI Gateway error [${aiRes.status}]:`, errText);
      throw new Error(`AI parsing failed: ${aiRes.status}`);
    }

    const aiData = await aiRes.json();
    const aiContent = aiData?.choices?.[0]?.message?.content || "";
    console.log("Step 2 done. AI response length:", aiContent.length);

    // Parse AI response
    let events: any[] = [];
    try {
      const cleaned = aiContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      events = parsed.events || [];
    } catch (e) {
      console.error("Failed to parse AI response:", aiContent.substring(0, 200));
      return new Response(
        JSON.stringify({ success: true, city, imported: 0, skipped: 0, total_found: 0, message: "Could not parse events from page" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${events.length} events for ${city}`);

    // Step 3: Insert into database
    let totalImported = 0;
    let totalSkipped = 0;
    const errors: string[] = [];
    const SYSTEM_USER_ID = "00000000-0000-0000-0000-000000000000";

    for (const ev of events) {
      if (!ev.title || ev.title.length < 3) continue;

      const { data: existing } = await supabase
        .from("events")
        .select("id")
        .eq("source", "eventbrite")
        .eq("city", city)
        .ilike("title", ev.title.substring(0, 40) + "%")
        .maybeSingle();

      if (existing) { totalSkipped++; continue; }

      let parsedDate = ev.date;
      try {
        const d = new Date(ev.date);
        if (!isNaN(d.getTime())) parsedDate = d.toISOString();
      } catch { /* keep as-is */ }

      const externalId = ev.url || `eb-${city}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const { error: insertError } = await supabase.from("events").insert({
        title: ev.title,
        description: "",
        date: parsedDate,
        city: dbCity,
        location: ev.location || "",
        image_url: ev.image_url || null,
        price: ev.price || "Free",
        category: "Concert",
        creator_id: SYSTEM_USER_ID,
        source: "eventbrite",
        external_id: externalId,
        external_url: ev.url || null,
        is_approved: true,
      });

      if (insertError) {
        errors.push(`"${ev.title}": ${insertError.message}`);
      } else {
        totalImported++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, city, imported: totalImported, skipped: totalSkipped, total_found: events.length, errors: errors.slice(0, 10) }),
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
