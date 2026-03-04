import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Story {
  id: string;
  user_id: string;
  image_url: string;
  created_at: string;
  expires_at: string;
  profile?: {
    display_name: string;
    avatar_url: string | null;
  };
}

export const useStories = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from("stories" as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      setLoading(false);
      return;
    }

    const userIds = [...new Set((data as any[]).map((s: any) => s.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", userIds);

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

    // Group by user, take latest per user
    const userStoryMap = new Map<string, Story>();
    (data as any[]).forEach((s: any) => {
      if (!userStoryMap.has(s.user_id)) {
        userStoryMap.set(s.user_id, {
          ...s,
          profile: profileMap.get(s.user_id) || { display_name: "User", avatar_url: null },
        });
      }
    });

    setStories(Array.from(userStoryMap.values()));
    setLoading(false);
  };

  useEffect(() => {
    fetchStories();
  }, [user]);

  const createStory = async (imageFile: File) => {
    if (!user) return;

    const ext = imageFile.name.split(".").pop();
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("story-images").upload(path, imageFile);
    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from("story-images").getPublicUrl(path);

    const { error } = await supabase.from("stories" as any).insert({
      user_id: user.id,
      image_url: urlData.publicUrl,
    } as any);

    if (error) throw error;
    await fetchStories();
  };

  const hasUserStory = user ? stories.some((s) => s.user_id === user.id) : false;

  return { stories, loading, createStory, hasUserStory, refetch: fetchStories };
};
