import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { trackRsvp } from "@/lib/analytics";

export interface DbEvent {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  location: string;
  date: string;
  end_date: string | null;
  image_url: string | null;
  price: string;
  capacity: number | null;
  is_approved: boolean;
  created_at: string;
}

export const useEvents = (city?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["events", city],
    queryFn: async () => {
      let q = supabase.from("events").select("*").order("date", { ascending: true });
      if (city) q = q.eq("city", city);
      const { data, error } = await q;
      if (error) throw error;
      return data as DbEvent[];
    },
  });

  const createEvent = useMutation({
    mutationFn: async (event: Omit<DbEvent, "id" | "creator_id" | "is_approved" | "created_at"> & { updated_at?: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("events")
        .insert({ ...event, creator_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });

  const toggleRsvp = useMutation({
    mutationFn: async (eventId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { data: existing } = await supabase
        .from("event_rsvps")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (existing) {
        await supabase.from("event_rsvps").delete().eq("id", existing.id);
      } else {
        const { error } = await supabase.from("event_rsvps").insert({ event_id: eventId, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rsvps"] }),
  });

  const rsvps = useQuery({
    queryKey: ["rsvps", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.from("event_rsvps").select("event_id").eq("user_id", user.id);
      if (error) throw error;
      return data.map((r: any) => r.event_id as string);
    },
    enabled: !!user,
  });

  const uploadEventImage = async (file: File, eventId: string) => {
    const ext = file.name.split(".").pop();
    const path = `${eventId}/cover.${ext}`;
    const { error } = await supabase.storage.from("event-images").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("event-images").getPublicUrl(path);
    return data.publicUrl;
  };

  return {
    events: query.data ?? [],
    loading: query.isLoading,
    createEvent,
    toggleRsvp,
    rsvpEventIds: rsvps.data ?? [],
    uploadEventImage,
  };
};
