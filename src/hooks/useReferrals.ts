import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

export interface Referral {
  id: string;
  referrer_id: string;
  referred_user_id: string | null;
  referred_email: string | null;
  status: string;
  channel: string;
  created_at: string;
  converted_at: string | null;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  referral_count: number;
  is_verified: boolean;
}

export const useReferralCode = () => {
  const { profile } = useProfile();
  const baseUrl = window.location.origin;
  const code = (profile as any)?.referral_code || "";
  const link = code ? `${baseUrl}/waitlist?ref=${code}` : "";
  return { code, link, referralCount: (profile as any)?.referral_count || 0 };
};

export const useMyReferrals = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my_referrals", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Referral[];
    },
    enabled: !!user,
  });
};

export const useTrackInvite = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ channel }: { channel: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("referrals").insert({
        referrer_id: user.id,
        channel,
        status: "invited",
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my_referrals", user?.id] }),
  });
};

export const useReferralLeaderboard = () => {
  return useQuery({
    queryKey: ["referral_leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_referral_leaderboard", { lim: 20 });
      if (error) throw error;
      return (data || []) as LeaderboardEntry[];
    },
  });
};

/** Referral badge tier based on count */
export const getReferralBadge = (count: number) => {
  if (count >= 50) return { tier: "diamond", label: "Diamond Builder 💎", color: "from-cyan-400 to-blue-500" };
  if (count >= 25) return { tier: "gold", label: "Gold Builder 🏆", color: "from-yellow-400 to-amber-500" };
  if (count >= 10) return { tier: "silver", label: "Silver Builder 🥈", color: "from-gray-300 to-gray-400" };
  if (count >= 3) return { tier: "bronze", label: "Bronze Builder 🥉", color: "from-orange-300 to-orange-500" };
  return null;
};
