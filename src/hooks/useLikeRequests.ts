import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface LikeRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

export const useLikeRequests = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all like requests involving the current user
  const { data: likeRequests = [], isLoading } = useQuery({
    queryKey: ["like_requests", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("like_requests" as any)
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
      if (error) throw error;
      return (data as any[]) as LikeRequest[];
    },
    enabled: !!user,
  });

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("like-requests-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "like_requests" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["like_requests", user.id] });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, queryClient]);

  const sendLike = useMutation({
    mutationFn: async (receiverId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("like_requests" as any)
        .insert({ sender_id: user.id, receiver_id: receiverId } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["like_requests"] });
      toast({ title: "Like sent! 💛", description: "They'll be notified of your interest." });
    },
    onError: (err: any) => {
      if (err?.message?.includes("duplicate")) {
        toast({ title: "Already sent", description: "You've already liked this person." });
      } else {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    },
  });

  const respondToRequest = useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: "accepted" | "rejected" }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("like_requests" as any)
        .update({ status, updated_at: new Date().toISOString() } as any)
        .eq("id", requestId);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["like_requests"] });
      if (vars.status === "accepted") {
        toast({ title: "It's a match! 🎉", description: "You can now message each other." });
      }
    },
  });

  // Helper functions
  const getSentRequest = (receiverId: string) =>
    likeRequests.find((r) => r.sender_id === user?.id && r.receiver_id === receiverId);

  const getReceivedRequest = (senderId: string) =>
    likeRequests.find((r) => r.receiver_id === user?.id && r.sender_id === senderId);

  const isMutualMatch = (otherUserId: string) => {
    const sent = getSentRequest(otherUserId);
    const received = getReceivedRequest(otherUserId);
    return (sent?.status === "accepted") || (received?.status === "accepted");
  };

  const hasLiked = (otherUserId: string) => !!getSentRequest(otherUserId);

  const hasReceivedFrom = (otherUserId: string) => {
    const req = getReceivedRequest(otherUserId);
    return req?.status === "pending";
  };

  const pendingReceived = likeRequests.filter(
    (r) => r.receiver_id === user?.id && r.status === "pending"
  );

  return {
    likeRequests,
    isLoading,
    sendLike,
    respondToRequest,
    getSentRequest,
    getReceivedRequest,
    isMutualMatch,
    hasLiked,
    hasReceivedFrom,
    pendingReceived,
  };
};
