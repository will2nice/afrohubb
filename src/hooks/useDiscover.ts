import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface DiscoverProfile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  age: number | null;
  interests: string[] | null;
  nationality: string | null;
  diaspora_roots: string | null;
  is_verified: boolean;
  looking_for: string[] | null;
  profile_mode: string | null;
  vibe: string | null;
}

interface DiscoverFilters {
  city?: string;
  interests?: string[];
  ageMin?: number;
  ageMax?: number;
  verifiedOnly?: boolean;
}

export const useDiscoverProfiles = (filters: DiscoverFilters = {}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["discover-profiles", filters],
    queryFn: async (): Promise<DiscoverProfile[]> => {
      let query = supabase
        .from("profiles")
        .select("id, display_name, avatar_url, bio, city, age, interests, nationality, diaspora_roots, is_verified, looking_for, profile_mode, vibe")
        .neq("display_name", "")
        .order("updated_at", { ascending: false })
        .limit(50);

      // Exclude self
      if (user) {
        query = query.neq("id", user.id);
      }

      if (filters.city) {
        query = query.eq("city", filters.city);
      }
      if (filters.verifiedOnly) {
        query = query.eq("is_verified", true);
      }
      if (filters.ageMin) {
        query = query.gte("age", filters.ageMin);
      }
      if (filters.ageMax) {
        query = query.lte("age", filters.ageMax);
      }

      const { data, error } = await query;
      if (error) throw error;

      let results = (data || []) as DiscoverProfile[];

      // Client-side interest filtering (overlaps array)
      if (filters.interests && filters.interests.length > 0) {
        results = results.filter((p) =>
          p.interests?.some((i) => filters.interests!.includes(i))
        );
      }

      return results;
    },
    enabled: !!user,
  });
};

export interface DiscoverEventFilters {
  city?: string;
  category?: string;
  freeOnly?: boolean;
  verifiedOnly?: boolean;
  search?: string;
}

export const useDiscoverEvents = (filters: DiscoverEventFilters = {}) => {
  return useQuery({
    queryKey: ["discover-events", filters],
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select("*")
        .eq("is_approved", true)
        .order("date", { ascending: true })
        .limit(50);

      if (filters.city) {
        query = query.eq("city", filters.city);
      }
      if (filters.category) {
        query = query.eq("category", filters.category);
      }
      if (filters.freeOnly) {
        query = query.eq("price", "Free");
      }
      if (filters.search) {
        query = query.ilike("title", `%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });
};
