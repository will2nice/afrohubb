import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Activity {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  location_label: string;
  is_public: boolean;
  max_spots: number | null;
  starts_at: string;
  expires_at: string;
  created_at: string;
  status: string;
  creator?: { display_name: string; avatar_url: string | null };
  participant_count?: number;
}

export const useActivities = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("activities")
        .select("*")
        .eq("status", "active")
        .gte("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });
      if (error) throw error;

      const activities = (data || []) as Activity[];

      // Fetch creator profiles
      const creatorIds = [...new Set(activities.map((a) => a.creator_id))];
      if (creatorIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url")
          .in("id", creatorIds);
        const profileMap = new Map((profiles || []).map((p) => [p.id, p]));
        activities.forEach((a) => {
          const p = profileMap.get(a.creator_id);
          if (p) a.creator = { display_name: p.display_name, avatar_url: p.avatar_url };
        });
      }

      // Fetch participant counts
      const activityIds = activities.map((a) => a.id);
      if (activityIds.length > 0) {
        const { data: participants } = await (supabase as any)
          .from("activity_participants")
          .select("activity_id, status")
          .in("activity_id", activityIds)
          .eq("status", "joined");
        const countMap = new Map<string, number>();
        (participants || []).forEach((p: any) => {
          countMap.set(p.activity_id, (countMap.get(p.activity_id) || 0) + 1);
        });
        activities.forEach((a) => {
          a.participant_count = countMap.get(a.id) || 0;
        });
      }

      return activities;
    },
  });

  const createActivity = useMutation({
    mutationFn: async (activity: {
      title: string;
      description: string;
      category: string;
      latitude: number;
      longitude: number;
      location_label?: string;
      is_public: boolean;
      max_spots?: number | null;
      starts_at?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await (supabase as any)
        .from("activities")
        .insert({ ...activity, creator_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Activity created! ✨" });
      qc.invalidateQueries({ queryKey: ["activities"] });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to create activity", description: err.message, variant: "destructive" });
    },
  });

  const joinActivity = useMutation({
    mutationFn: async ({ activityId, isPublic }: { activityId: string; isPublic: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      const status = isPublic ? "joined" : "pending";
      const { error } = await (supabase as any)
        .from("activity_participants")
        .insert({ activity_id: activityId, user_id: user.id, status });
      if (error) throw error;
      return status;
    },
    onSuccess: (status) => {
      toast({ title: status === "joined" ? "You're in! 🎉" : "Request sent! ⏳" });
      qc.invalidateQueries({ queryKey: ["activities"] });
      qc.invalidateQueries({ queryKey: ["my_activity_participation"] });
    },
    onError: (err: Error) => {
      toast({ title: "Could not join", description: err.message, variant: "destructive" });
    },
  });

  const approveRequest = useMutation({
    mutationFn: async (participantId: string) => {
      const { error } = await (supabase as any)
        .from("activity_participants")
        .update({ status: "joined" })
        .eq("id", participantId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Approved! ✅" });
      qc.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  const myParticipation = useQuery({
    queryKey: ["my_activity_participation", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await (supabase as any)
        .from("activity_participants")
        .select("activity_id, status")
        .eq("user_id", user.id);
      if (error) throw error;
      return (data || []) as { activity_id: string; status: string }[];
    },
    enabled: !!user,
  });

  return {
    activities: query.data ?? [],
    loading: query.isLoading,
    createActivity,
    joinActivity,
    approveRequest,
    myParticipation: myParticipation.data ?? [],
  };
};
