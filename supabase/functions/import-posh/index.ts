import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

    // Use Firecrawl search to find Posh events
    const searchQuery = `site:posh.vip ${keyword} events ${city} 2025 2026`;
    console.log("Step 1: Searching for Posh events:", searchQuery);

    const searchRes = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FIRECRAWL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: 20,
        scrapeOptions: { formats: ["markdown"] },
      }),
    });

    if (!searchRes.ok) {
      const errText = await searchRes.text();
      console.error(`Firecrawl search error [${searchRes.status}]:`, errText);
      throw new Error(`Firecrawl search failed: ${searchRes.status}`);
    }

    const searchData = await searchRes.json();
    const results = searchData?.data || [];
    console.log(`Step 1 done. Found ${results.length} search results`);

    if (results.length === 0) {
      return new Response(
        JSON.stringify({ success: true, city, imported: 0, skipped: 0, total_found: 0, message: "No Posh results found" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Combine all search result content for AI parsing
    const combined = results.map((r: any, i: number) =>
      `--- Result ${i + 1} ---\nURL: ${r.url || ""}\nTitle: ${r.title || ""}\nDescription: ${r.description || ""}\n${(r.markdown || "").substring(0, 1500)}`
    ).join("\n\n");

    // Step 2: AI extraction
    console.log("Step 2: Parsing events with AI. Combined length:", combined.length);
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
            content: "You extract event data from Posh.vip search results. Return ONLY valid JSON, no markdown code fences."
          },
          {
            role: "user",
            content: `Extract all individual events from these Posh.vip search results for ${city}. Return a JSON object with an "events" array. Each event should have: title, date (ISO 8601 format like 2025-03-15T20:00:00), location (venue name if found), price (string like "Free" or "$25"), url (the posh.vip URL), image_url (if found). Only include actual events with real titles (not generic pages). Skip duplicates. Here are the search results:\n\n${combined.substring(0, 8000)}`
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

    let events: any[] = [];
    try {
      const cleaned = aiContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      events = parsed.events || [];
    } catch (e) {
      console.error("Failed to parse AI response:", aiContent.substring(0, 200));
      return new Response(
        JSON.stringify({ success: true, city, imported: 0, skipped: 0, total_found: 0, message: "Could not parse events" }),
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
        .eq("source", "posh")
        .eq("city", city)
        .ilike("title", ev.title.substring(0, 40) + "%")
        .maybeSingle();

      if (existing) { totalSkipped++; continue; }

      let parsedDate = ev.date;
      try {
        const d = new Date(ev.date);
        if (!isNaN(d.getTime())) parsedDate = d.toISOString();
      } catch { /* keep as-is */ }

      const externalId = ev.url || `posh-${city}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const { error: insertError } = await supabase.from("events").insert({
        title: ev.title,
        description: "",
        date: parsedDate,
        city,
        location: ev.location || "",
        image_url: ev.image_url || null,
        price: ev.price || "Free",
        category: "Concert",
        creator_id: SYSTEM_USER_ID,
        source: "posh",
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
