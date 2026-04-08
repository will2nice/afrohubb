import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function sanitizeForAI(text: string): string {
  return text.replace(/```/g, '').replace(/(system|user|assistant):/gi, '').replace(/<script[^>]*>.*?<\/script>/gi, '').replace(/javascript:/gi, '').substring(0, 8000);
}

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const FIRECRAWL_API = "https://api.firecrawl.dev/v1/scrape";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user - support both real JWT and service role key
    const token = authHeader.replace("Bearer ", "");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const isServiceRole = token === serviceKey;

    let userId = "00000000-0000-0000-0000-000000000000";

    if (!isServiceRole) {
      const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
      if (claimsError || !claimsData?.claims?.sub) {
        // If no valid user token, allow with default creator for open access mode
        console.log("No authenticated user, using default creator ID");
      } else {
        userId = claimsData.claims.sub as string;
      }
    }

    const { url, city: rawCity } = await req.json();
    const city = rawCity ? rawCity.toLowerCase().replace(/[\s\-_]+/g, "") : "";
    if (!url) throw new Error("URL is required");

    // Step 1: Scrape the event page using Firecrawl
    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!firecrawlKey) throw new Error("Firecrawl not configured");

    const scrapeRes = await fetch(FIRECRAWL_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${firecrawlKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: true,
      }),
    });

    if (!scrapeRes.ok) {
      throw new Error(`Failed to scrape URL (${scrapeRes.status})`);
    }

    const scrapeData = await scrapeRes.json();
    const markdown = scrapeData?.data?.markdown || scrapeData?.markdown || "";
    if (!markdown) throw new Error("Could not extract content from this URL");

    // Step 2: Use AI to extract structured event data
    const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_KEY) throw new Error("AI not configured");

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
            content: `Extract event details from this page content and return ONLY a JSON object with these fields:
- title (string, required)
- description (string)
- date (ISO 8601 datetime string)
- end_date (ISO 8601 datetime string or null)
- location (string, venue name and address)
- price (string like "Free" or "$25" or "£15")
- category (one of: Concert, Festival, Brunch, Sports, Networking, Art, Party, Other)
- image_url (string URL or null)
- capacity (number or null)

Return ONLY valid JSON, no markdown formatting.`,
          },
          { role: "user", content: `[START]\n${sanitizeForAI(markdown)}\n[END]` },
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!aiRes.ok) throw new Error("AI extraction failed");
    const aiData = await aiRes.json();
    let rawContent = aiData?.choices?.[0]?.message?.content || "";

    // Clean up potential markdown code blocks
    rawContent = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let eventData: any;
    try {
      eventData = JSON.parse(rawContent);
    } catch {
      throw new Error("Could not parse event details from this page");
    }

    if (!eventData.title) throw new Error("Could not find event title on this page");

    // Detect source from URL
    let source = "user";
    if (url.includes("eventbrite")) source = "eventbrite";
    else if (url.includes("posh.vip")) source = "posh";
    else if (url.includes("dice.fm")) source = "dice";
    else if (url.includes("shotgun.live")) source = "shotgun";
    else if (url.includes("billetto")) source = "billetto";

    // Step 3: Insert into database
    const { data: inserted, error: insertError } = await supabase
      .from("events")
      .insert({
        title: eventData.title,
        description: eventData.description || "",
        date: eventData.date || new Date().toISOString(),
        end_date: eventData.end_date || null,
        location: eventData.location || "",
        price: eventData.price || "Free",
        category: eventData.category || "Other",
        image_url: eventData.image_url || null,
        capacity: eventData.capacity || null,
        city: city || "london",
        creator_id: user.id,
        source,
        external_url: url,
        is_approved: true, // Auto-approve user-imported events
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Auto-create a General Admission ticket type if it's a paid event
    if (eventData.price && eventData.price !== "Free") {
      const priceMatch = eventData.price.match(/[\d.]+/);
      const priceCents = priceMatch ? Math.round(parseFloat(priceMatch[0]) * 100) : 0;
      if (priceCents > 0) {
        await supabase.from("ticket_types").insert({
          event_id: inserted.id,
          name: "General Admission",
          price_cents: priceCents,
          quantity_total: eventData.capacity || 100,
          currency: eventData.price.includes("£") ? "gbp" : eventData.price.includes("€") ? "eur" : "usd",
        });
      }
    }

    return new Response(JSON.stringify({ success: true, title: inserted.title, id: inserted.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Import URL error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
