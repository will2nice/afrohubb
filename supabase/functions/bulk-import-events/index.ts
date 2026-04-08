import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function sanitizeForAI(text: string): string {
  return text.replace(/```/g, '').replace(/(system|user|assistant):/gi, '').replace(/<script[^>]*>.*?<\/script>/gi, '').replace(/javascript:/gi, '').substring(0, 12000);
}

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const SYSTEM_USER_ID = "00000000-0000-0000-0000-000000000000";

// Date range: April 9 2025 – July 31 2025
const DATE_FROM = "2025-04-09";
const DATE_TO = "2025-07-31";

interface ImportResult {
  city: string;
  source: string;
  imported: number;
  skipped: number;
  errors: string[];
}

async function scrapeAndImport(
  supabase: any,
  firecrawlKey: string,
  lovableKey: string,
  city: string,
  source: string,
  searchQuery: string,
  searchType: "scrape" | "search",
  scrapeUrl?: string,
): Promise<ImportResult> {
  const result: ImportResult = { city, source, imported: 0, skipped: 0, errors: [] };

  try {
    let markdown = "";

    if (searchType === "scrape" && scrapeUrl) {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapeUrl, formats: ["markdown"], waitFor: 3000 }),
      });
      if (!res.ok) { result.errors.push(`Scrape failed: ${res.status}`); return result; }
      const data = await res.json();
      markdown = data?.data?.markdown || data?.markdown || "";
    } else {
      const res = await fetch("https://api.firecrawl.dev/v1/search", {
        method: "POST",
        headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, limit: 20, scrapeOptions: { formats: ["markdown"] } }),
      });
      if (!res.ok) { result.errors.push(`Search failed: ${res.status}`); return result; }
      const data = await res.json();
      const results = data?.data || [];
      markdown = results.map((r: any, i: number) =>
        `--- Result ${i + 1} ---\nURL: ${r.url || ""}\nTitle: ${r.title || ""}\n${(r.markdown || "").substring(0, 2000)}`
      ).join("\n\n");
    }

    if (markdown.length < 50) { return result; }

    // AI extraction with date range constraints
    const aiRes = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You extract event data from scraped web pages. Return ONLY valid JSON, no markdown code fences." },
          { role: "user", content: `Extract all individual events from this ${source} content for ${city}, Texas. ONLY include events happening between ${DATE_FROM} and ${DATE_TO} (April 9 through July 31, 2025). Discard any events outside this date range. Return a JSON object with an "events" array. Each event should have: title, date (ISO 8601 like 2025-07-15T20:00:00), location (venue name), price (string like "Free" or "$25"), url (the original event URL), image_url (if found), organizer (promoter/host name if found), category (one of: Concert, Party, Festival, Brunch, Day Party, Nightlife, Cultural, Sports, Comedy, Other). Only include actual events with real dates. Skip duplicates.\n\n[START]\n${sanitizeForAI(markdown)}\n[END]` }
        ],
        temperature: 0,
        max_tokens: 6000,
      }),
    });

    if (!aiRes.ok) { result.errors.push(`AI failed: ${aiRes.status}`); return result; }
    const aiData = await aiRes.json();
    const aiContent = aiData?.choices?.[0]?.message?.content || "";

    let events: any[] = [];
    try {
      const cleaned = aiContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      events = JSON.parse(cleaned).events || [];
    } catch { result.errors.push("AI parse failed"); return result; }

    for (const ev of events) {
      if (!ev.title || ev.title.length < 3) continue;

      // Validate date is within range
      try {
        const eventDate = new Date(ev.date);
        const fromDate = new Date(DATE_FROM);
        const toDate = new Date(DATE_TO + "T23:59:59");
        if (isNaN(eventDate.getTime()) || eventDate < fromDate || eventDate > toDate) {
          result.skipped++;
          continue;
        }
      } catch {
        result.skipped++;
        continue;
      }

      const { data: existing } = await supabase
        .from("events").select("id")
        .eq("source", source).eq("city", city)
        .ilike("title", ev.title.substring(0, 40) + "%")
        .maybeSingle();

      if (existing) { result.skipped++; continue; }

      let parsedDate = ev.date;
      try { const d = new Date(ev.date); if (!isNaN(d.getTime())) parsedDate = d.toISOString(); } catch {}

      const { data: inserted, error: insertError } = await supabase.from("events").insert({
        title: ev.title,
        description: ev.organizer ? `Hosted by ${ev.organizer}` : "",
        date: parsedDate,
        city,
        location: ev.location || "",
        image_url: ev.image_url || null,
        price: ev.price || "Free",
        category: ev.category || "Concert",
        creator_id: SYSTEM_USER_ID,
        source,
        external_id: ev.url || `${source}-${city}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        external_url: ev.url || null,
        is_approved: true,
      }).select("id").single();

      if (insertError) { result.errors.push(`"${ev.title}": ${insertError.message}`); }
      else {
        result.imported++;
        if (inserted) {
          const priceStr = (ev.price || "").replace(/[^0-9.]/g, "");
          const priceCents = priceStr ? Math.round(parseFloat(priceStr) * 100) : 0;
          await supabase.from("ticket_types").insert({
            event_id: inserted.id, name: "General Admission",
            price_cents: priceCents, currency: "usd", quantity_total: 100, quantity_sold: 0,
          });
        }
      }
    }
  } catch (e: any) {
    result.errors.push(e.message || "Unknown error");
  }

  return result;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    if (authHeader) {
      const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
      const { data: { user }, error: authError } = await userClient.auth.getUser();
      if (authError || !user) {
        return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const { data: isAdmin } = await userClient.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: "Admin access required" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    } else {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const FIRECRAWL_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    if (!FIRECRAWL_KEY) throw new Error("FIRECRAWL_API_KEY not configured");
    const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(supabaseUrl, serviceKey);

    let body: any = {};
    try { body = await req.json(); } catch {}
    
    const cities = body.cities || ["austin", "dallas", "houston", "sanantonio"];
    const allResults: ImportResult[] = [];

    for (const city of cities) {
      console.log(`\n=== Processing ${city} (${DATE_FROM} to ${DATE_TO}) ===`);

      // Posh - search for upcoming events in date range
      const poshResult = await scrapeAndImport(
        supabase, FIRECRAWL_KEY, LOVABLE_KEY, city, "posh",
        `site:posh.vip events ${city} Texas April May June July 2025`,
        "search"
      );
      allResults.push(poshResult);
      console.log(`Posh ${city}: ${poshResult.imported} imported, ${poshResult.skipped} skipped`);

      // Eventbrite - scrape with date filter
      const ebSlugs: Record<string, string> = {
        austin: "Austin--TX", dallas: "Dallas--TX", houston: "Houston--TX", sanantonio: "San-Antonio--TX"
      };
      if (ebSlugs[city]) {
        const ebResult = await scrapeAndImport(
          supabase, FIRECRAWL_KEY, LOVABLE_KEY, city, "eventbrite",
          "", "scrape",
          `https://www.eventbrite.com/d/${ebSlugs[city]}/events--this-month/`
        );
        allResults.push(ebResult);
        console.log(`Eventbrite ${city}: ${ebResult.imported} imported, ${ebResult.skipped} skipped`);

        // Second pass for next months
        const ebResult2 = await scrapeAndImport(
          supabase, FIRECRAWL_KEY, LOVABLE_KEY, city, "eventbrite",
          `site:eventbrite.com ${city} TX events May June July 2025`,
          "search"
        );
        allResults.push(ebResult2);
        console.log(`Eventbrite search ${city}: ${ebResult2.imported} imported, ${ebResult2.skipped} skipped`);
      }

      // Partyfoul / general party search
      const partyResult = await scrapeAndImport(
        supabase, FIRECRAWL_KEY, LOVABLE_KEY, city, "partyfoul",
        `${city} Texas party events nightlife April May June July 2025`,
        "search"
      );
      allResults.push(partyResult);
      console.log(`Partyfoul ${city}: ${partyResult.imported} imported, ${partyResult.skipped} skipped`);

      // DICE events
      const diceResult = await scrapeAndImport(
        supabase, FIRECRAWL_KEY, LOVABLE_KEY, city, "dice",
        `site:dice.fm ${city} events 2025`,
        "search"
      );
      allResults.push(diceResult);
      console.log(`DICE ${city}: ${diceResult.imported} imported, ${diceResult.skipped} skipped`);
    }

    const totalImported = allResults.reduce((s, r) => s + r.imported, 0);
    const totalSkipped = allResults.reduce((s, r) => s + r.skipped, 0);

    return new Response(
      JSON.stringify({ success: true, total_imported: totalImported, total_skipped: totalSkipped, date_range: `${DATE_FROM} to ${DATE_TO}`, results: allResults }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Bulk import error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
