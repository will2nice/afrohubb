import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const now = new Date();
    const dayOfWeek = now.getUTCDay(); // 0=Sun, 1=Mon...

    // Run on Mondays (weekly digest) — can be called anytime but only generates on schedule
    const isWeeklyDigestDay = dayOfWeek === 1;
    // Run on Fridays (weekend preview)
    const isWeekendPreview = dayOfWeek === 5;

    let totalNotifications = 0;

    if (isWeekendPreview) {
      // "X events happening this weekend" — per city
      const friday = new Date(now);
      friday.setUTCHours(0, 0, 0, 0);
      const sunday = new Date(friday);
      sunday.setDate(friday.getDate() + 2);
      sunday.setUTCHours(23, 59, 59, 999);

      // Get weekend events grouped by city
      const { data: weekendEvents } = await supabase
        .from("events")
        .select("city, id")
        .gte("date", friday.toISOString())
        .lte("date", sunday.toISOString())
        .eq("is_approved", true);

      if (weekendEvents && weekendEvents.length > 0) {
        const cityCounts: Record<string, number> = {};
        weekendEvents.forEach((e: any) => {
          cityCounts[e.city] = (cityCounts[e.city] || 0) + 1;
        });

        // Notify users in each city
        for (const [city, count] of Object.entries(cityCounts)) {
          const { data: users } = await supabase
            .from("profiles")
            .select("id")
            .eq("city", city)
            .limit(500);

          if (users) {
            const notifications = users.map((u: any) => ({
              user_id: u.id,
              type: "nearby_event",
              title: `🎉 ${count} events this weekend in ${city}`,
              body: "Check out what's happening near you!",
              data: { city, count, digest_type: "weekend_preview" },
            }));

            if (notifications.length > 0) {
              await supabase.from("notifications").insert(notifications);
              totalNotifications += notifications.length;
            }
          }
        }
      }
    }

    if (isWeeklyDigestDay) {
      // "X new people joined in your city this week"
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: newUsers } = await supabase
        .from("profiles")
        .select("city")
        .gte("created_at", weekAgo.toISOString())
        .not("city", "is", null);

      if (newUsers && newUsers.length > 0) {
        const cityCounts: Record<string, number> = {};
        newUsers.forEach((u: any) => {
          if (u.city) cityCounts[u.city] = (cityCounts[u.city] || 0) + 1;
        });

        for (const [city, count] of Object.entries(cityCounts)) {
          if (count < 1) continue;

          const { data: existingUsers } = await supabase
            .from("profiles")
            .select("id")
            .eq("city", city)
            .lt("created_at", weekAgo.toISOString())
            .limit(500);

          if (existingUsers) {
            const notifications = existingUsers.map((u: any) => ({
              user_id: u.id,
              type: "general",
              title: `👋 ${count} new ${count === 1 ? "person" : "people"} joined in ${city}`,
              body: "Your community is growing! Check out who's new.",
              data: { city, count, digest_type: "new_members" },
            }));

            if (notifications.length > 0) {
              await supabase.from("notifications").insert(notifications);
              totalNotifications += notifications.length;
            }
          }
        }
      }

      // "Trending discussions" — groups with most posts this week
      const { data: topGroups } = await supabase
        .from("group_posts")
        .select("group_id")
        .gte("created_at", weekAgo.toISOString());

      if (topGroups && topGroups.length > 0) {
        const groupCounts: Record<string, number> = {};
        topGroups.forEach((p: any) => {
          groupCounts[p.group_id] = (groupCounts[p.group_id] || 0) + 1;
        });

        const sortedGroups = Object.entries(groupCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);

        if (sortedGroups.length > 0) {
          // Get group names
          const groupIds = sortedGroups.map(([id]) => id);
          const { data: groups } = await supabase
            .from("groups")
            .select("id, name")
            .in("id", groupIds);

          if (groups) {
            const groupNames = sortedGroups
              .map(([id, count]) => {
                const g = groups.find((g: any) => g.id === id);
                return g ? `${g.name} (${count} posts)` : null;
              })
              .filter(Boolean)
              .join(", ");

            // Notify all group members of trending groups
            const { data: members } = await supabase
              .from("group_members")
              .select("user_id")
              .in("group_id", groupIds);

            if (members) {
              const uniqueUsers = [...new Set(members.map((m: any) => m.user_id))];
              const notifications = uniqueUsers.map((uid) => ({
                user_id: uid,
                type: "group_activity",
                title: "🔥 Trending discussions this week",
                body: groupNames,
                data: { digest_type: "trending_discussions", group_ids: groupIds },
              }));

              if (notifications.length > 0) {
                await supabase.from("notifications").insert(notifications);
                totalNotifications += notifications.length;
              }
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, notifications_sent: totalNotifications, day: dayOfWeek }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
