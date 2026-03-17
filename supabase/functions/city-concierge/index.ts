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
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");

    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) throw new Error("Not authenticated");

    const { message, city } = await req.json();
    if (!message || !city) throw new Error("message and city are required");

    // Gather city context in parallel
    const [eventsRes, profilesRes, rsvpRes, ordersRes, postsRes] = await Promise.all([
      supabase
        .from("events")
        .select("title, date, location, price, category, source, capacity")
        .eq("city", city)
        .eq("is_approved", true)
        .gte("date", new Date().toISOString())
        .order("date", { ascending: true })
        .limit(20),
      supabase
        .from("profiles")
        .select("id")
        .eq("city", city)
        .limit(1000),
      supabase
        .from("event_rsvps")
        .select("event_id, events!inner(city)")
        .eq("events.city", city)
        .limit(500),
      supabase
        .from("orders")
        .select("total_cents, status, events!inner(city)")
        .eq("events.city", city)
        .eq("status", "paid")
        .limit(500),
      supabase
        .from("posts")
        .select("content, likes_count, created_at")
        .eq("city", city)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const events = eventsRes.data || [];
    const memberCount = profilesRes.data?.length || 0;
    const rsvpCount = rsvpRes.data?.length || 0;
    const paidOrders = ordersRes.data || [];
    const totalRevenue = paidOrders.reduce((s: number, o: any) => s + (o.total_cents || 0), 0);
    const recentPosts = postsRes.data || [];

    const cityContext = `
CITY: ${city}
MEMBERS: ${memberCount} registered in this city
UPCOMING EVENTS (${events.length}):
${events.map((e: any) => `- "${e.title}" on ${e.date} at ${e.location} | ${e.price} | ${e.category}`).join("\n")}

ENGAGEMENT: ${rsvpCount} total RSVPs across events
TICKET SALES: ${paidOrders.length} paid orders, $${(totalRevenue / 100).toFixed(0)} total revenue

RECENT POSTS:
${recentPosts.map((p: any) => `- "${(p.content || "").substring(0, 80)}" (${p.likes_count} likes)`).join("\n")}
`;

    // Load conversation history
    const { data: history } = await supabase
      .from("city_agent_messages")
      .select("role, content")
      .eq("user_id", user.id)
      .eq("city", city)
      .order("created_at", { ascending: true })
      .limit(20);

    const conversationMessages = (history || []).map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    // Save user message
    await supabase.from("city_agent_messages").insert({
      user_id: user.id,
      city,
      role: "user",
      content: message,
    });

    const systemPrompt = `You are the AfroHub City Agent for ${city}. You're a knowledgeable, warm, and culturally aware AI concierge for the African diaspora community.

YOUR ROLE:
- Help users discover events, connect with people, and navigate the city's community
- Provide real-time insights on what's happening, trending events, and ticket availability
- Give personalized recommendations based on the user's interests
- Share community stats and updates enthusiastically
- If asked about purchasing, guide them to the Events tab to buy tickets
- Be culturally authentic — reference Afrobeats, diaspora culture, local hotspots

CURRENT CITY DATA:
${cityContext}

RULES:
- Keep responses concise (2-4 sentences max unless listing events)
- Use emojis sparingly but effectively 🎶🌍✨
- If you don't have data, say so honestly and suggest checking back
- Never make up events or stats — only use the data provided
- For ticket questions, mention the price and direct them to "Get Tickets" in the Events tab`;

    // Stream the response
    const aiRes = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationMessages,
          { role: "user", content: message },
        ],
        stream: true,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error(`AI error [${aiRes.status}]:`, errText);
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI failed: ${aiRes.status}`);
    }

    // We need to save the full response, so we'll buffer and stream
    // Use a TransformStream to tee the response
    const reader = aiRes.body!.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let fullContent = "";

    const stream = new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) {
          // Save assistant message when stream completes
          if (fullContent.trim()) {
            await supabase.from("city_agent_messages").insert({
              user_id: user.id,
              city,
              role: "assistant",
              content: fullContent.trim(),
            });
          }
          controller.close();
          return;
        }

        // Parse SSE to extract content for saving
        const text = decoder.decode(value, { stream: true });
        for (const line of text.split("\n")) {
          if (line.startsWith("data: ") && line.trim() !== "data: [DONE]") {
            try {
              const parsed = JSON.parse(line.slice(6));
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) fullContent += delta;
            } catch { /* partial JSON, ignore */ }
          }
        }

        controller.enqueue(value);
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error: unknown) {
    console.error("Concierge error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
