import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Place {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  city: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  cuisine_type: string | null;
  description: string | null;
  image_url: string | null;
  website: string | null;
  phone: string | null;
  price_range: string | null;
  is_halal: boolean;
  is_ramadan_friendly: boolean;
  is_lent_friendly: boolean;
}

export const usePlaces = (city?: string) => {
  const { data: places = [], isLoading } = useQuery({
    queryKey: ["places", city],
    queryFn: async () => {
      let query = supabase.from("places" as any).select("*").order("name");
      if (city) query = query.eq("city", city);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as Place[];
    },
  });

  return { places, isLoading };
};
