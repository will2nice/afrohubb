import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");

    if (!firecrawlKey) {
      return new Response(
        JSON.stringify({ error: "FIRECRAWL_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get places without images
    const { city, limit: batchLimit } = await req.json().catch(() => ({ city: null, limit: 10 }));

    let query = supabase
      .from("places")
      .select("id, name, city, category, subcategory, cuisine_type")
      .is("image_url", null)
      .eq("category", "restaurant")
      .order("name")
      .limit(batchLimit || 10);

    if (city) query = query.eq("city", city);

    const { data: places, error: fetchErr } = await query;
    if (fetchErr) throw fetchErr;
    if (!places || places.length === 0) {
      return new Response(
        JSON.stringify({ message: "No places without photos found", updated: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let updated = 0;
    const results: { name: string; status: string; image_url?: string }[] = [];

    for (const place of places) {
      try {
        // Search for the restaurant + menu food photo
        const searchQuery = `${place.name} ${place.city} restaurant menu food photo`;
        console.log(`Searching: ${searchQuery}`);

        const searchRes = await fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${firecrawlKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: searchQuery,
            limit: 3,
            scrapeOptions: { formats: ["markdown", "links"] },
          }),
        });

        const searchData = await searchRes.json();

        if (!searchRes.ok) {
          console.error(`Search failed for ${place.name}:`, searchData);
          results.push({ name: place.name, status: "search_failed" });
          continue;
        }

        // Try to find an image URL from the search results
        let imageUrl: string | null = null;
        let websiteUrl: string | null = null;

        if (searchData.data && searchData.data.length > 0) {
          for (const result of searchData.data) {
            // Save the first result URL as the website
            if (!websiteUrl && result.url) {
              websiteUrl = result.url;
            }

            // Look for image URLs in the markdown content
            if (result.markdown) {
              const imgRegex = /!\[.*?\]\((https?:\/\/[^\s)]+\.(?:jpg|jpeg|png|webp)[^\s)]*)\)/gi;
              const matches = [...result.markdown.matchAll(imgRegex)];
              if (matches.length > 0) {
                // Pick a food-related image if possible
                for (const match of matches) {
                  const url = match[1];
                  if (
                    url.includes("food") ||
                    url.includes("menu") ||
                    url.includes("dish") ||
                    url.includes("plate") ||
                    url.includes("yelp") ||
                    url.includes("tripadvisor")
                  ) {
                    imageUrl = url;
                    break;
                  }
                }
                if (!imageUrl) {
                  imageUrl = matches[0][1];
                }
              }
            }

            // Also check for og:image style URLs
            if (!imageUrl && result.markdown) {
              const ogMatch = result.markdown.match(
                /https?:\/\/[^\s)\"]+\.(?:jpg|jpeg|png|webp)[^\s)\"]*/i
              );
              if (ogMatch) {
                imageUrl = ogMatch[0];
              }
            }

            if (imageUrl) break;
          }
        }

        // If we found a photo, update the place
        if (imageUrl) {
          const updateData: Record<string, string> = { image_url: imageUrl };
          if (websiteUrl && !websiteUrl.includes("google.com")) {
            updateData.website = websiteUrl;
          }

          const { error: updateErr } = await supabase
            .from("places")
            .update(updateData)
            .eq("id", place.id);

          if (updateErr) {
            console.error(`Update failed for ${place.name}:`, updateErr);
            results.push({ name: place.name, status: "update_failed" });
          } else {
            updated++;
            results.push({ name: place.name, status: "updated", image_url: imageUrl });
          }
        } else {
          results.push({ name: place.name, status: "no_image_found" });
        }

        // Small delay to avoid rate limiting
        await new Promise((r) => setTimeout(r, 500));
      } catch (placeErr) {
        console.error(`Error processing ${place.name}:`, placeErr);
        results.push({ name: place.name, status: "error" });
      }
    }

    return new Response(
      JSON.stringify({ updated, total: places.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
