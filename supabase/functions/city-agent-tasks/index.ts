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
    const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { task, city } = await req.json();

    const results: Record<string, any> = {};

    // TASK 1: Clean up expired events
    if (!task || task === "cleanup") {
      const yesterday = new Date(Date.now() - 86400000).toISOString();
      const { data: expired } = await supabase
        .from("events")
        .select("id, title")
        .lt("date", yesterday)
        .is("end_date", null)
        .limit(50);

      const expiredMultiDay = await supabase
        .from("events")
        .select("id, title")
        .not("end_date", "is", null)
        .lt("end_date", yesterday)
        .limit(50);

      const allExpired = [...(expired || []), ...(expiredMultiDay.data || [])];
      results.cleanup = { expired_found: allExpired.length, titles: allExpired.map((e: any) => e.title).slice(0, 10) };

      if (allExpired.length > 0) {
        await supabase.from("city_agent_logs").insert({
          city: city || "global",
          action: "events_cleaned",
          details: { count: allExpired.length },
        });
      }
    }

    // TASK 2: Generate city digest
    if (!task || task === "digest") {
      const targetCity = city || "london";
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();

      const [newMembers, newEvents, ticketSales, topPosts] = await Promise.all([
        supabase.from("profiles").select("id").eq("city", targetCity).gte("created_at", weekAgo),
        supabase.from("events").select("title, date, category").eq("city", targetCity).gte("created_at", weekAgo).eq("is_approved", true),
        supabase.from("orders").select("total_cents, events!inner(city)").eq("events.city", targetCity).eq("status", "paid").gte("created_at", weekAgo),
        supabase.from("posts").select("content, likes_count").eq("city", targetCity).gte("created_at", weekAgo).order("likes_count", { ascending: false }).limit(3),
      ]);

      const revenue = (ticketSales.data || []).reduce((s: number, o: any) => s + (o.total_cents || 0), 0);

      const digestData = {
        city: targetCity,
        new_members: newMembers.data?.length || 0,
        new_events: (newEvents.data || []).map((e: any) => e.title),
        ticket_revenue_cents: revenue,
        top_posts: (topPosts.data || []).map((p: any) => ({ content: (p.content || "").substring(0, 60), likes: p.likes_count })),
      };

      // Use AI to create a friendly digest summary
      const aiRes = await fetch(AI_GATEWAY, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            { role: "system", content: "Generate a brief, exciting weekly digest for the AfroHub community. Use emojis. Keep it under 200 words. Be warm and encouraging." },
            { role: "user", content: `City: ${targetCity}\nNew members: ${digestData.new_members}\nNew events: ${digestData.new_events.join(", ") || "None"}\nTicket revenue: $${(revenue / 100).toFixed(0)}\nTop posts: ${digestData.top_posts.map((p: any) => p.content).join("; ") || "None"}` },
          ],
          temperature: 0.8,
          max_tokens: 500,
        }),
      });

      let digestText = "";
      if (aiRes.ok) {
        const data = await aiRes.json();
        digestText = data?.choices?.[0]?.message?.content || "";
      }

      results.digest = { ...digestData, summary: digestText };

      await supabase.from("city_agent_logs").insert({
        city: targetCity,
        action: "digest_generated",
        details: digestData,
      });
    }

    // TASK 3: Auto-approve quality events
    if (!task || task === "auto_approve") {
      const { data: pending } = await supabase
        .from("events")
        .select("id, title, description, source, creator_id, city")
        .eq("is_approved", false)
        .limit(20);

      const approved: string[] = [];
      for (const ev of (pending || [])) {
        // Auto-approve events from trusted sources
        if (ev.source && ["eventbrite", "posh", "dice", "shotgun", "billetto", "afronation"].includes(ev.source)) {
          await supabase.from("events").update({ is_approved: true }).eq("id", ev.id);
          approved.push(ev.title);
        }
      }

      results.auto_approve = { approved_count: approved.length, titles: approved };

      if (approved.length > 0) {
        await supabase.from("city_agent_logs").insert({
          city: city || "global",
          action: "events_auto_approved",
          details: { count: approved.length, titles: approved },
        });
      }
    }

    // TASK 4: Flag potentially duplicate events
    if (!task || task === "dedup") {
      const { data: allEvents } = await supabase
        .from("events")
        .select("id, title, date, city")
        .eq("is_approved", true)
        .gte("date", new Date().toISOString())
        .order("date")
        .limit(200);

      const dupes: Array<{ a: string; b: string; title: string }> = [];
      const evs = allEvents || [];
      for (let i = 0; i < evs.length; i++) {
        for (let j = i + 1; j < evs.length; j++) {
          const a = evs[i], b = evs[j];
          if (a.city === b.city && a.title.toLowerCase().substring(0, 20) === b.title.toLowerCase().substring(0, 20)) {
            dupes.push({ a: a.id, b: b.id, title: a.title });
          }
        }
      }

      results.dedup = { potential_duplicates: dupes.length, samples: dupes.slice(0, 5) };
    }

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Agent task error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
