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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");

    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) throw new Error("Not authenticated");

    const { message, city, history = [] } = await req.json();
    if (!message || !city) throw new Error("message and city are required");

    // Gather city context
    const [eventsRes, placesRes] = await Promise.all([
      supabase
        .from("events")
        .select("title, date, location, price, category, description")
        .eq("city", city)
        .eq("is_approved", true)
        .gte("date", new Date().toISOString())
        .order("date", { ascending: true })
        .limit(30),
      supabase
        .from("places")
        .select("name, category, subcategory, cuisine_type, price_range, address, description")
        .eq("city", city)
        .limit(50),
    ]);

    const events = eventsRes.data || [];
    const places = placesRes.data || [];

    const cityContext = `
CITY: ${city}
UPCOMING EVENTS (${events.length}):
${events.map((e: any) => `- "${e.title}" on ${e.date} at ${e.location} | ${e.price} | ${e.category} | ${(e.description || "").substring(0, 100)}`).join("\n")}

LOCAL PLACES (${places.length}):
${places.map((p: any) => `- "${p.name}" (${p.category}${p.subcategory ? "/" + p.subcategory : ""}) ${p.cuisine_type || ""} | ${p.price_range || ""} | ${p.address || ""}`).join("\n")}
`;

    const systemPrompt = `You are the AfroHub Personal Concierge AI for ${city}. You're a warm, culturally savvy assistant that helps users plan amazing experiences.

YOUR ROLE:
- Have a natural conversation to understand what the user wants to do
- Recommend specific events, restaurants, bars, speakeasies, and experiences from the real data below
- Help them build an itinerary for their visit
- Ask about their dates, group size, budget, and preferences naturally through conversation
- Be enthusiastic and knowledgeable about the local scene
- When you have enough info, offer to connect them with a real human concierge agent for $25 who can handle bookings, reservations, and insider access

SERVICES YOU CAN HELP WITH:
- Parties & Clubs
- Bars & Lounges  
- Speakeasies & Hidden Gems
- Dinners & Restaurant Recommendations
- Social Events & Meetups
- Concerts & Live Music
- Bowling & Entertainment
- Nightlife Planning
- Full Trip Itineraries

CURRENT CITY DATA:
${cityContext}

RULES:
- Keep responses conversational and concise (2-4 sentences, unless listing recommendations)
- Use emojis naturally 🎶🌍✨🍸🎉
- Only recommend events/places from the data provided — never make up venues
- If data is limited, be honest and say you can connect them with a local agent who knows more
- When the user seems ready, suggest they can get a dedicated human concierge for $25 to handle bookings and insider access
- Reference Afrobeats, diaspora culture, and local hotspots authentically
- Ask follow-up questions to understand their vibe and preferences`;

    const conversationMessages = history.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

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
        max_tokens: 1200,
        temperature: 0.8,
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
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI failed: ${aiRes.status}`);
    }

    return new Response(aiRes.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error: unknown) {
    console.error("Concierge chat error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
