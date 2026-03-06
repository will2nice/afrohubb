import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useTicketTypes = (eventId: string | undefined) => {
  return useQuery({
    queryKey: ["ticket_types", eventId],
    queryFn: async () => {
      if (!eventId) return [];
      const { data, error } = await supabase
        .from("ticket_types")
        .select("*")
        .eq("event_id", eventId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!eventId,
  });
};

export const useCreateCheckout = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      ticketTypeId,
      quantity = 1,
    }: {
      ticketTypeId: string;
      quantity?: number;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please sign in to purchase tickets");

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/create-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            ticket_type_id: ticketTypeId,
            quantity,
            success_url: `${window.location.origin}/?checkout=success`,
            cancel_url: `${window.location.origin}/?checkout=cancelled`,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      return data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (err: Error) => {
      toast({
        title: "Checkout Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });
};

export const useStripeConnectOnboard = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please sign in");

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/stripe-connect-onboard`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            return_url: `${window.location.origin}/?stripe_onboard=complete`,
            refresh_url: `${window.location.origin}/?stripe_refresh=true`,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Onboarding failed");
      return data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (err: Error) => {
      toast({
        title: "Stripe Connect Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });
};

export const useMyOrders = () => {
  return useQuery({
    queryKey: ["my_orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, ticket_types(*), events!orders_event_id_fkey(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
};

export const usePromoterStripeAccount = () => {
  return useQuery({
    queryKey: ["promoter_stripe_account"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase
        .from("promoter_stripe_accounts")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};
