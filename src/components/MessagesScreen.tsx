import { useState } from "react";
import { Search, Users, MessageSquarePlus, Loader2, BadgeCheck } from "lucide-react";
import { useMessages, type ConversationWithDetails } from "@/hooks/useMessages";
import { useAuth } from "@/contexts/AuthContext";
import DMChatScreen from "@/components/DMChatScreen";
import founderWilly from "@/assets/founder-willy.jpg";
import founderDaniel from "@/assets/founder-tom.jpg";

const founderProfiles = [
  {
    id: "founder-willy",
    name: "Willie",
    role: "Founder",
    avatar: founderWilly,
    message: "Hey! Welcome to the fam 🙌🏾 We built this for us — explore, connect, and let us know what you think!",
  },
  {
    id: "founder-daniel",
    name: "Daniel",
    role: "Founder",
    avatar: founderDaniel,
    message: "Welcome to AfroHub! I'm one of the founders. We're building something special for the culture. Don't be a stranger 🤝🏾",
  },
];

const MessagesScreen = () => {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { conversations, loadingConversations } = useMessages();
  const { user } = useAuth();

  // Find the active conversation details
  const activeConv = conversations.find(c => c.id === activeConversationId);

  if (activeConversationId && activeConv) {
    return (
      <DMChatScreen
        conversationId={activeConversationId}
        contactName={activeConv.other_user?.display_name || activeConv.title || "Chat"}
        contactPhoto={activeConv.other_user?.avatar_url || ""}
        contactAge={activeConv.other_user?.age || undefined}
        contactVibe={activeConv.other_user?.vibe || ""}
        isOnline={false}
        onBack={() => setActiveConversationId(null)}
      />
    );
  }

  const filtered = conversations.filter(c => {
    if (!searchQuery) return true;
    const name = c.other_user?.display_name || c.title || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Now";
    if (diffMin < 60) return `${diffMin}m`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    return `${diffD}d`;
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-display text-xl font-bold text-gradient-gold">Messages</h1>
            {totalUnread > 0 && (
              <span className="px-2 py-0.5 rounded-full gradient-gold text-[10px] font-bold text-primary-foreground">
                {totalUnread} unread
              </span>
            )}
          </div>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto">
        {/* Pinned Founder Messages */}
        {founderProfiles.map((founder) => (
          <div
            key={founder.id}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors border-b border-border/30 cursor-pointer"
          >
            <div className="relative">
              {founder.avatar ? (
                <img src={founder.avatar} alt={founder.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/40" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/60 to-primary/30 flex items-center justify-center ring-2 ring-primary/40">
                  <span className="text-lg font-bold text-primary-foreground">{founder.name.charAt(0)}</span>
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full gradient-gold flex items-center justify-center">
                <BadgeCheck size={10} className="text-primary-foreground" />
              </div>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-foreground">{founder.name}</p>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold gradient-gold text-primary-foreground leading-none">{founder.role}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{founder.message}</p>
            </div>
          </div>
        ))}

        {loadingConversations ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 && !searchQuery ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
              <MessageSquarePlus size={28} className="text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground mb-1">No messages yet</h3>
            <p className="text-sm text-muted-foreground">
              Start connecting! Match with someone or message an event attendee to start a conversation.
            </p>
          </div>
        ) : filtered.length === 0 && searchQuery ? (
          <div className="text-center py-12 px-4">
            <p className="text-sm text-muted-foreground">No conversations match your search</p>
          </div>
        ) : (
          filtered.map((conv) => {
            const name = conv.other_user?.display_name || conv.title || "Chat";
            const avatar = conv.other_user?.avatar_url;
            const isGroup = conv.type !== "dm";

            return (
              <button
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors border-b border-border/30"
              >
                <div className="relative">
                  {avatar ? (
                    <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover ring-2 ring-border" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                      {isGroup ? (
                        <Users size={20} className="text-muted-foreground" />
                      ) : (
                        <span className="text-lg font-bold text-muted-foreground">{name.charAt(0)}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-semibold text-foreground truncate ${conv.unread_count > 0 ? "font-bold" : ""}`}>
                      {name}
                    </p>
                    <span className="text-xs text-muted-foreground ml-2">{formatTime(conv.last_message_at)}</span>
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${conv.unread_count > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {conv.last_message || "No messages yet"}
                  </p>
                </div>
                {conv.unread_count > 0 && (
                  <div className="w-5 h-5 rounded-full gradient-gold flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-primary-foreground">{conv.unread_count}</span>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MessagesScreen;
