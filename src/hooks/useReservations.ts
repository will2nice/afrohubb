import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useTableTypes = (eventId: string | undefined) =>
  useQuery({
    queryKey: ["table_types", eventId],
    queryFn: async () => {
      if (!eventId) return [];
      const { data, error } = await supabase.from("table_types").select("*").eq("event_id", eventId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!eventId,
  });

export const useBottlePackages = (eventId: string | undefined) =>
  useQuery({
    queryKey: ["bottle_packages", eventId],
    queryFn: async () => {
      if (!eventId) return [];
      const { data, error } = await supabase.from("bottle_packages").select("*").eq("event_id", eventId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!eventId,
  });

export const useMyReservations = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my_reservations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("reservations")
        .select("*, table_types(*), bottle_packages(*), events:event_id(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useEventReservations = (eventId: string | undefined) =>
  useQuery({
    queryKey: ["event_reservations", eventId],
    queryFn: async () => {
      if (!eventId) return [];
      const { data, error } = await supabase
        .from("reservations")
        .select("*, table_types(*), bottle_packages(*), profiles:user_id(display_name, avatar_url)")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!eventId,
  });

export const useCreateReservation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      event_id: string;
      table_type_id: string | null;
      bottle_package_id: string | null;
      guest_count: number;
      arrival_time: string;
      special_notes: string;
      total_cents: number;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("reservations")
        .insert({ ...params, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Reservation confirmed! 🎉" });
      qc.invalidateQueries({ queryKey: ["my_reservations"] });
      qc.invalidateQueries({ queryKey: ["table_types"] });
    },
    onError: (err: Error) => {
      toast({ title: "Reservation failed", description: err.message, variant: "destructive" });
    },
  });
};
