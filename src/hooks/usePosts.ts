import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export interface Post {
  id: string;
  user_id: string;
  content: string | null;
  image_url: string | null;
  city: string | null;
  post_type: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profile?: {
    display_name: string;
    avatar_url: string | null;
    city: string | null;
  };
  user_liked?: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: {
    display_name: string;
    avatar_url: string | null;
  };
}

export const usePosts = (cityId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase
      .from("posts" as any)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (cityId) {
      query = query.eq("city", cityId);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
      return;
    }

    const postData = (data as any[]) || [];
    
    // Fetch profiles for all post authors
    const userIds = [...new Set(postData.map((p: any) => p.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, city")
      .in("id", userIds);

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

    // Fetch user's likes
    let userLikes = new Set<string>();
    if (user) {
      const { data: likes } = await supabase
        .from("post_likes" as any)
        .select("post_id")
        .eq("user_id", user.id);
      userLikes = new Set((likes || []).map((l: any) => l.post_id));
    }

    const enriched: Post[] = postData.map((p: any) => ({
      ...p,
      profile: profileMap.get(p.user_id) || { display_name: "User", avatar_url: null, city: null },
      user_liked: userLikes.has(p.id),
    }));

    setPosts(enriched);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [cityId, user]);

  const createPost = async (content: string, imageFile?: File, city?: string) => {
    if (!user) return;
    
    let imageUrl: string | null = null;
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("post-images").upload(path, imageFile);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("post-images").getPublicUrl(path);
      imageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("posts" as any).insert({
      user_id: user.id,
      content: content.trim() || null,
      image_url: imageUrl,
      city: city || null,
    } as any);

    if (error) throw error;
    await fetchPosts();
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;
    
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    if (post.user_liked) {
      await supabase.from("post_likes" as any).delete().eq("post_id", postId).eq("user_id", user.id);
    } else {
      await supabase.from("post_likes" as any).insert({ post_id: postId, user_id: user.id } as any);
    }

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, user_liked: !p.user_liked, likes_count: p.likes_count + (p.user_liked ? -1 : 1) }
          : p
      )
    );
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) return;
    const { error } = await supabase.from("post_comments" as any).insert({
      post_id: postId,
      user_id: user.id,
      content: content.trim(),
    } as any);
    if (error) throw error;
    
    setPosts((prev) =>
      prev.map((p) => p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p)
    );
  };

  const fetchComments = async (postId: string): Promise<PostComment[]> => {
    const { data, error } = await supabase
      .from("post_comments" as any)
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error || !data) return [];

    const userIds = [...new Set((data as any[]).map((c: any) => c.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", userIds);

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

    return (data as any[]).map((c: any) => ({
      ...c,
      profile: profileMap.get(c.user_id) || { display_name: "User", avatar_url: null },
    }));
  };

  return { posts, loading, createPost, toggleLike, addComment, fetchComments, refetch: fetchPosts };
};
