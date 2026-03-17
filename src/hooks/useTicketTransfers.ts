import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useTicketTransfers = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutateAsync: transferTicket, isPending } = useMutation({
    mutationFn: async ({ orderId, toEmail }: { orderId: string; toEmail: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in");

      // Verify the order belongs to the user
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .select("id, user_id, status")
        .eq("id", orderId)
        .eq("user_id", user.id)
        .eq("status", "paid")
        .single();

      if (orderErr || !order) throw new Error("Ticket not found or not eligible for transfer");

      // Create transfer record using raw insert since the type may not be in the generated types yet
      const { error } = await supabase
        .from("ticket_transfers" as any)
        .insert({
          order_id: orderId,
          from_user_id: user.id,
          to_email: toEmail,
          status: "pending",
        } as any);

      if (error) throw new Error(error.message);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_orders"] });
    },
    onError: (err: Error) => {
      toast({ title: "Transfer failed", description: err.message, variant: "destructive" });
    },
  });

  return { transferTicket, isPending };
};
