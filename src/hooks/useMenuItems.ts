import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MenuItem {
  id: string;
  place_id: string;
  name: string;
  description: string | null;
  price: string | null;
  image_url: string | null;
  category: string | null;
}

export const useMenuItems = (placeId: string | null) => {
  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ["menu_items", placeId],
    enabled: !!placeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items" as any)
        .select("*")
        .eq("place_id", placeId!)
        .order("name");
      if (error) throw error;
      return (data || []) as unknown as MenuItem[];
    },
  });

  return { menuItems, isLoading };
};
