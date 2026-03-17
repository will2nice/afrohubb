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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { data: isAdmin } = await userClient.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return new Response(JSON.stringify({ error: "Admin access required" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const FIRECRAWL_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    if (!FIRECRAWL_KEY) throw new Error("FIRECRAWL_API_KEY is not configured");
    const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Scrape Afro Nation's public pages for event data
    const urls = [
      "https://www.afronation.com",
      "https://www.afronation.com/book-tickets",
    ];

    let allMarkdown = "";
    for (const url of urls) {
      console.log(`Scraping: ${url}`);
      const scrapeRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FIRECRAWL_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          formats: ["markdown"],
          onlyMainContent: true,
        }),
      });

      if (scrapeRes.ok) {
        const scrapeData = await scrapeRes.json();
        const md = scrapeData?.data?.markdown || scrapeData?.markdown || "";
        allMarkdown += `\n--- From ${url} ---\n${md.substring(0, 4000)}\n`;
      } else {
        console.error(`Failed to scrape ${url}: ${scrapeRes.status}`);
      }
    }

    // Also search for Afro Nation 2026 events across the web
    console.log("Searching for Afro Nation 2026 events...");
    const searchRes = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FIRECRAWL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "Afro Nation 2026 festival lineup dates tickets Portugal Detroit Miami Ghana",
        limit: 10,
        scrapeOptions: { formats: ["markdown"] },
      }),
    });

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const results = searchData?.data || [];
      for (const r of results) {
        allMarkdown += `\n--- Search: ${r.url || ""} ---\n${(r.markdown || "").substring(0, 2000)}\n`;
      }
      console.log(`Found ${results.length} search results`);
    }

    console.log(`Total scraped content: ${allMarkdown.length} chars`);

    // Use AI to extract structured event data
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
            content: "You extract Afro Nation festival event data. Return ONLY valid JSON, no markdown code fences.",
          },
          {
            role: "user",
            content: `Extract all Afro Nation festival events from this content. Include all locations (Portugal, Detroit, Miami, Ghana, Lagos, San Juan, etc.).

Return a JSON object with an "events" array. Each event should have:
- title (e.g. "AFRO NATION PORTUGAL 2026")
- date (ISO 8601 format like 2026-07-03T16:00:00)
- end_date (ISO 8601 if multi-day)
- location (venue/city)
- city (lowercase city id like "portimao", "detroit", "miami", "accra", "lagos")
- price (string like "$415+" or "Free")
- artists (comma-separated headliners if known)
- url (the afronation.com URL)
- ticket_tiers (array of {name, price} if available)

${allMarkdown.substring(0, 12000)}`,
          },
        ],
        temperature: 0,
        max_tokens: 6000,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error(`AI error [${aiRes.status}]:`, errText);
      throw new Error(`AI parsing failed: ${aiRes.status}`);
    }

    const aiData = await aiRes.json();
    const aiContent = aiData?.choices?.[0]?.message?.content || "";
    console.log("AI response length:", aiContent.length);

    let events: any[] = [];
    try {
      const cleaned = aiContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      events = parsed.events || [];
    } catch (e) {
      console.error("Failed to parse AI response:", aiContent.substring(0, 300));
      return new Response(
        JSON.stringify({ success: true, imported: 0, message: "Could not parse events from scraped data" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Extracted ${events.length} Afro Nation events`);

    let totalImported = 0;
    let totalSkipped = 0;
    const errors: string[] = [];
    const SYSTEM_USER_ID = "00000000-0000-0000-0000-000000000000";

    for (const ev of events) {
      if (!ev.title || ev.title.length < 3) continue;

      // Check for duplicates
      const { data: existing } = await supabase
        .from("events")
        .select("id")
        .eq("source", "afronation")
        .ilike("title", ev.title.substring(0, 30) + "%")
        .maybeSingle();

      if (existing) { totalSkipped++; continue; }

      let parsedDate = ev.date;
      try {
        const d = new Date(ev.date);
        if (!isNaN(d.getTime())) parsedDate = d.toISOString();
      } catch { /* keep as-is */ }

      let parsedEndDate = ev.end_date || null;
      if (parsedEndDate) {
        try {
          const d = new Date(parsedEndDate);
          if (!isNaN(d.getTime())) parsedEndDate = d.toISOString();
        } catch { parsedEndDate = null; }
      }

      const description = ev.artists
        ? `Featuring: ${ev.artists}`
        : "The world's biggest Afrobeats festival";

      const { error: insertError } = await supabase.from("events").insert({
        title: ev.title,
        description,
        date: parsedDate,
        end_date: parsedEndDate,
        city: ev.city || "portimao",
        location: ev.location || "Praia da Rocha, Portimão",
        image_url: null,
        price: ev.price || "$415+",
        category: "Festival",
        creator_id: SYSTEM_USER_ID,
        source: "afronation",
        external_id: `afronation-${ev.city || "pt"}-${Date.now()}`,
        external_url: ev.url || "https://www.afronation.com/book-tickets",
        is_approved: true,
      });

      if (insertError) {
        errors.push(`"${ev.title}": ${insertError.message}`);
      } else {
        totalImported++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        imported: totalImported,
        skipped: totalSkipped,
        total_found: events.length,
        events_preview: events.slice(0, 5).map((e: any) => ({ title: e.title, date: e.date, city: e.city })),
        errors: errors.slice(0, 5),
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
