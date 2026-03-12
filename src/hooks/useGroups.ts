import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Group {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_emoji: string;
  cover_url: string | null;
  category: string;
  member_count: number;
  creator_id: string;
  is_featured: boolean;
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export interface GroupPost {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export const useGroups = (category?: string) => {
  return useQuery({
    queryKey: ["groups", category],
    queryFn: async () => {
      let q = supabase.from("groups").select("*").order("member_count", { ascending: false });
      if (category && category !== "all") q = q.eq("category", category);
      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as Group[];
    },
  });
};

export const useFeaturedGroups = () => {
  return useQuery({
    queryKey: ["groups", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("is_featured", true)
        .order("member_count", { ascending: false });
      if (error) throw error;
      return (data || []) as Group[];
    },
  });
};

export const useGroupDetail = (groupId: string | undefined) => {
  return useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      if (!groupId) return null;
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("id", groupId)
        .single();
      if (error) throw error;
      return data as Group;
    },
    enabled: !!groupId,
  });
};

export const useGroupMembers = (groupId: string | undefined) => {
  return useQuery({
    queryKey: ["group_members", groupId],
    queryFn: async () => {
      if (!groupId) return [];
      const { data, error } = await supabase
        .from("group_members")
        .select("*, profiles:user_id(id, display_name, avatar_url, is_verified, city)")
        .eq("group_id", groupId)
        .order("joined_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!groupId,
  });
};

export const useMyGroupIds = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my_group_ids", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", user.id);
      if (error) throw error;
      return (data || []).map((r: any) => r.group_id as string);
    },
    enabled: !!user,
  });
};

export const useJoinGroup = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (groupId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("group_members")
        .insert({ group_id: groupId, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_group_ids"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["group_members"] });
    },
  });
};

export const useLeaveGroup = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (groupId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_group_ids"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["group_members"] });
    },
  });
};

export const useGroupPosts = (groupId: string | undefined) => {
  return useQuery({
    queryKey: ["group_posts", groupId],
    queryFn: async () => {
      if (!groupId) return [];
      const { data, error } = await supabase
        .from("group_posts")
        .select("*, profiles:user_id(id, display_name, avatar_url, is_verified)")
        .eq("group_id", groupId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
    enabled: !!groupId,
  });
};

export const useCreateGroupPost = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ groupId, content }: { groupId: string; content: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("group_posts")
        .insert({ group_id: groupId, user_id: user.id, content });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["group_posts", vars.groupId] });
    },
  });
};
