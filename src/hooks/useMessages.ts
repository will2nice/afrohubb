import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { trackEvent } from "@/lib/posthog";
import { trackMessageSent } from "@/lib/analytics";

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  type: string;
  title: string | null;
  event_id: string | null;
  created_at: string;
}

export interface ConversationWithDetails extends Conversation {
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
  other_user: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    vibe: string;
    age: number | null;
    city: string;
  } | null;
}

export const useMessages = (conversationId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get conversations with details
  const conversations = useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: async (): Promise<ConversationWithDetails[]> => {
      if (!user) return [];

      // Get conversation IDs user is member of
      const { data: memberships, error: mErr } = await supabase
        .from("conversation_members")
        .select("conversation_id")
        .eq("user_id", user.id);
      if (mErr) throw mErr;
      if (!memberships?.length) return [];

      const convIds = memberships.map((m: any) => m.conversation_id);

      // Get conversations
      const { data: convs, error: cErr } = await supabase
        .from("conversations")
        .select("*")
        .in("id", convIds);
      if (cErr) throw cErr;
      if (!convs?.length) return [];

      // For each conversation, get last message, other member's profile, and unread count
      const results: ConversationWithDetails[] = [];

      for (const conv of convs) {
        // Last message
        const { data: lastMsgs } = await supabase
          .from("messages")
          .select("content, created_at")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1);

        // Other member (for DMs)
        let otherUser: ConversationWithDetails["other_user"] = null;
        if (conv.type === "dm") {
          const { data: members } = await supabase
            .from("conversation_members")
            .select("user_id")
            .eq("conversation_id", conv.id)
            .neq("user_id", user.id)
            .limit(1);

          if (members?.length) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("id, display_name, avatar_url, vibe, age, city")
              .eq("id", members[0].user_id)
              .single();
            if (profile) {
              otherUser = profile as ConversationWithDetails["other_user"];
            }
          }
        }

        // Message count (simple unread approximation — all messages not from me, after last read)
        // For MVP, just count messages not from me
        const { count } = await supabase
          .from("messages")
          .select("id", { count: "exact", head: true })
          .eq("conversation_id", conv.id)
          .neq("sender_id", user.id);

        results.push({
          ...conv,
          last_message: lastMsgs?.[0]?.content || null,
          last_message_at: lastMsgs?.[0]?.created_at || conv.created_at,
          unread_count: count ?? 0,
          other_user: otherUser,
        });
      }

      // Sort by last message time
      results.sort((a, b) => {
        const aTime = a.last_message_at || a.created_at;
        const bTime = b.last_message_at || b.created_at;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });

      return results;
    },
    enabled: !!user,
  });

  // Get messages for a specific conversation
  const messages = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!conversationId,
  });

  // Realtime subscription for new messages
  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [conversationId, queryClient]);

  // Realtime for conversation list (any new message in any conversation)
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("all-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, queryClient]);

  const sendMessage = useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
      });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      trackEvent("message_sent", { conversation_id: vars.conversationId });
      trackMessageSent(vars.conversationId);
      queryClient.invalidateQueries({ queryKey: ["messages", vars.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const startConversation = async (otherUserId: string): Promise<string> => {
    if (!user) throw new Error("Not authenticated");

    // Check if DM already exists with this user
    const { data: myMemberships } = await supabase
      .from("conversation_members")
      .select("conversation_id")
      .eq("user_id", user.id);

    if (myMemberships?.length) {
      const convIds = myMemberships.map((m: any) => m.conversation_id);
      const { data: sharedMemberships } = await supabase
        .from("conversation_members")
        .select("conversation_id")
        .eq("user_id", otherUserId)
        .in("conversation_id", convIds);

      if (sharedMemberships?.length) {
        // Check if any shared conversation is a DM
        const { data: existingDMs } = await supabase
          .from("conversations")
          .select("id")
          .in("id", sharedMemberships.map((m: any) => m.conversation_id))
          .eq("type", "dm")
          .limit(1);
        if (existingDMs?.length) {
          return existingDMs[0].id;
        }
      }
    }

    // Create new conversation
    const { data: conv, error: cErr } = await supabase
      .from("conversations")
      .insert({ type: "dm" })
      .select()
      .single();
    if (cErr) throw cErr;

    // Add both members
    const { error: mErr } = await supabase.from("conversation_members").insert([
      { conversation_id: conv.id, user_id: user.id },
      { conversation_id: conv.id, user_id: otherUserId },
    ]);
    if (mErr) throw mErr;

    queryClient.invalidateQueries({ queryKey: ["conversations"] });
    return conv.id;
  };

  return {
    conversations: conversations.data ?? [],
    messages: messages.data ?? [],
    loadingConversations: conversations.isLoading,
    loadingMessages: messages.isLoading,
    sendMessage,
    startConversation,
  };
};
