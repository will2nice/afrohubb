import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useTrustSafety = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  const reportUser = async (reportedUserId: string, reason: string, description: string) => {
    if (!user) return;
    const { error } = await supabase.from("user_reports" as any).insert({
      reporter_id: user.id,
      reported_user_id: reportedUserId,
      reason,
      description,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Report submitted", description: "We'll review this within 24 hours." });
    return true;
  };

  const blockUser = async (blockedId: string) => {
    if (!user) return;
    const { error } = await supabase.from("user_blocks" as any).insert({
      blocker_id: user.id,
      blocked_id: blockedId,
    });
    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already blocked" });
        return true;
      }
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return false;
    }
    setBlockedUsers((prev) => [...prev, blockedId]);
    toast({ title: "User blocked", description: "You won't see this person anymore." });
    return true;
  };

  const unblockUser = async (blockedId: string) => {
    if (!user) return;
    const { error } = await supabase.from("user_blocks" as any).delete().eq("blocker_id", user.id).eq("blocked_id", blockedId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return false;
    }
    setBlockedUsers((prev) => prev.filter((id) => id !== blockedId));
    toast({ title: "User unblocked" });
    return true;
  };

  const fetchBlockedUsers = async () => {
    if (!user) return;
    const { data } = await supabase.from("user_blocks" as any).select("blocked_id").eq("blocker_id", user.id);
    if (data) {
      setBlockedUsers((data as any[]).map((d) => d.blocked_id));
    }
  };

  const isBlocked = (userId: string) => blockedUsers.includes(userId);

  return { reportUser, blockUser, unblockUser, fetchBlockedUsers, isBlocked, blockedUsers };
};

export const getProfileCompleteness = (profile: any): { percentage: number; missing: string[] } => {
  if (!profile) return { percentage: 0, missing: ["Everything"] };
  const fields: { key: string; label: string; check?: (v: any) => boolean }[] = [
    { key: "display_name", label: "Display name", check: (v) => !!v && v.length > 0 },
    { key: "avatar_url", label: "Profile photo", check: (v) => !!v && v.length > 0 },
    { key: "bio", label: "Bio", check: (v) => !!v && v.length > 0 },
    { key: "city", label: "City", check: (v) => !!v && v.length > 0 },
    { key: "interests", label: "Interests", check: (v) => Array.isArray(v) && v.length > 0 },
    { key: "nationality", label: "Nationality", check: (v) => !!v && v.length > 0 },
    { key: "diaspora_roots", label: "Diaspora roots", check: (v) => !!v && v.length > 0 },
    { key: "languages", label: "Languages", check: (v) => Array.isArray(v) && v.length > 0 },
    { key: "age", label: "Age", check: (v) => !!v },
    { key: "looking_for", label: "What you're looking for", check: (v) => Array.isArray(v) && v.length > 0 },
  ];
  const missing: string[] = [];
  let completed = 0;
  for (const f of fields) {
    const val = profile[f.key];
    if (f.check ? f.check(val) : !!val) {
      completed++;
    } else {
      missing.push(f.label);
    }
  }
  return { percentage: Math.round((completed / fields.length) * 100), missing };
};
