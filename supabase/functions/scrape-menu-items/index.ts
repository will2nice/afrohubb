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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");

    if (!firecrawlKey) {
      return new Response(
        JSON.stringify({ error: "FIRECRAWL_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { place_id, city, limit: batchLimit } = await req.json().catch(() => ({ place_id: null, city: null, limit: 5 }));

    // Get places to scrape menus for
    let query = supabase
      .from("places")
      .select("id, name, city, cuisine_type, website")
      .eq("category", "restaurant")
      .order("name")
      .limit(batchLimit || 5);

    if (place_id) {
      query = supabase.from("places").select("id, name, city, cuisine_type, website").eq("id", place_id);
    } else if (city) {
      query = query.eq("city", city);
    }

    const { data: places, error: fetchErr } = await query;
    if (fetchErr) throw fetchErr;
    if (!places || places.length === 0) {
      return new Response(
        JSON.stringify({ message: "No places found", updated: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let totalItems = 0;
    const results: { name: string; status: string; items_found?: number }[] = [];

    for (const place of places) {
      try {
        const searchQuery = `${place.name} ${place.city} menu items dishes prices`;
        console.log(`Scraping menu: ${searchQuery}`);

        const searchRes = await fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${firecrawlKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: searchQuery,
            limit: 3,
            scrapeOptions: { formats: ["markdown"] },
          }),
        });

        const searchData = await searchRes.json();
        if (!searchRes.ok) {
          console.error(`Search failed for ${place.name}:`, searchData);
          results.push({ name: place.name, status: "search_failed" });
          continue;
        }

        // Parse menu items from markdown content
        const menuItems: { name: string; description?: string; price?: string; image_url?: string; category?: string }[] = [];

        if (searchData.data && searchData.data.length > 0) {
          for (const result of searchData.data) {
            if (!result.markdown) continue;

            const lines = result.markdown.split("\n");

            for (let i = 0; i < lines.length; i++) {
              const line = lines[i].trim();

              // Pattern: "Item Name ... $XX.XX" or "Item Name - $XX.XX"
              const priceMatch = line.match(/^(.+?)[\s.…–-]+\$(\d+\.?\d*)/);
              if (priceMatch) {
                const itemName = priceMatch[1].replace(/[*#]/g, "").trim();
                if (itemName.length > 2 && itemName.length < 80) {
                  // Look for description on next line
                  let desc: string | undefined;
                  if (i + 1 < lines.length) {
                    const nextLine = lines[i + 1].trim();
                    if (nextLine && !nextLine.match(/\$\d/) && nextLine.length > 5 && nextLine.length < 200) {
                      desc = nextLine.replace(/[*#]/g, "").trim();
                    }
                  }

                  // Look for image URL near this item
                  let imgUrl: string | undefined;
                  for (let j = Math.max(0, i - 3); j < Math.min(lines.length, i + 4); j++) {
                    const imgMatch = lines[j].match(/!\[.*?\]\((https?:\/\/[^\s)]+\.(?:jpg|jpeg|png|webp)[^\s)]*)\)/i);
                    if (imgMatch) {
                      imgUrl = imgMatch[1];
                      break;
                    }
                  }

                  menuItems.push({
                    name: itemName,
                    price: `$${priceMatch[2]}`,
                    description: desc,
                    image_url: imgUrl,
                  });
                }
              }
            }

            // Also try structured patterns like "### Item Name" followed by price
            const headingRegex = /^#{1,4}\s+(.+)/;
            for (let i = 0; i < lines.length; i++) {
              const headingMatch = lines[i].match(headingRegex);
              if (headingMatch) {
                const itemName = headingMatch[1].replace(/[*]/g, "").trim();
                // Check next few lines for price
                for (let j = i + 1; j < Math.min(lines.length, i + 4); j++) {
                  const pMatch = lines[j].match(/\$(\d+\.?\d*)/);
                  if (pMatch) {
                    // Avoid duplicates
                    if (!menuItems.some(m => m.name.toLowerCase() === itemName.toLowerCase())) {
                      menuItems.push({
                        name: itemName,
                        price: `$${pMatch[1]}`,
                      });
                    }
                    break;
                  }
                }
              }
            }

            if (menuItems.length >= 15) break; // Cap per place
          }
        }

        if (menuItems.length > 0) {
          // Delete existing menu items for this place
          await supabase.from("menu_items").delete().eq("place_id", place.id);

          // Insert new items
          const rows = menuItems.slice(0, 20).map(item => ({
            place_id: place.id,
            name: item.name,
            description: item.description || null,
            price: item.price || null,
            image_url: item.image_url || null,
            category: item.category || null,
          }));

          const { error: insertErr } = await supabase.from("menu_items").insert(rows);
          if (insertErr) {
            console.error(`Insert failed for ${place.name}:`, insertErr);
            results.push({ name: place.name, status: "insert_failed" });
          } else {
            totalItems += rows.length;
            results.push({ name: place.name, status: "updated", items_found: rows.length });
          }
        } else {
          results.push({ name: place.name, status: "no_menu_found" });
        }

        await new Promise((r) => setTimeout(r, 500));
      } catch (placeErr) {
        console.error(`Error processing ${place.name}:`, placeErr);
        results.push({ name: place.name, status: "error" });
      }
    }

    return new Response(
      JSON.stringify({ total_items: totalItems, places_processed: places.length, results }),
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
