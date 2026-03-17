import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useEventCheckIns = (eventId: string | undefined) =>
  useQuery({
    queryKey: ["check_ins", eventId],
    queryFn: async () => {
      if (!eventId) return [];
      const { data, error } = await supabase
        .from("check_ins")
        .select("*, profiles:user_id(display_name, avatar_url)")
        .eq("event_id", eventId)
        .order("checked_in_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!eventId,
  });

export const useCheckIn = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      event_id: string;
      user_id: string;
      order_id?: string;
      reservation_id?: string;
      method: "qr" | "manual";
    }) => {
      if (!user) throw new Error("Not authenticated");
      // Check if already checked in
      const { data: existing } = await supabase
        .from("check_ins")
        .select("id")
        .eq("event_id", params.event_id)
        .eq("user_id", params.user_id)
        .maybeSingle();
      if (existing) throw new Error("Already checked in");

      const { data, error } = await supabase
        .from("check_ins")
        .insert({
          event_id: params.event_id,
          user_id: params.user_id,
          order_id: params.order_id || null,
          reservation_id: params.reservation_id || null,
          method: params.method,
          checked_in_by: user.id,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Checked in! ✅" });
      qc.invalidateQueries({ queryKey: ["check_ins"] });
    },
    onError: (err: Error) => {
      toast({ title: "Check-in failed", description: err.message, variant: "destructive" });
    },
  });
};

export const useLookupCheckInCode = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      // Try orders first
      const { data: order } = await supabase
        .from("orders")
        .select("*, profiles:user_id(display_name, avatar_url), ticket_types(*), events:event_id(*)")
        .eq("check_in_code", code)
        .maybeSingle();
      if (order) return { type: "order" as const, data: order };

      // Try reservations
      const { data: reservation } = await supabase
        .from("reservations")
        .select("*, profiles:user_id(display_name, avatar_url), table_types(*), events:event_id(*)")
        .eq("check_in_code", code)
        .maybeSingle();
      if (reservation) return { type: "reservation" as const, data: reservation };

      throw new Error("Invalid code — no ticket or reservation found");
    },
  });
};
