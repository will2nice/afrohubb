import { useState } from "react";
import { Search, Users, MessageSquarePlus, Loader2, BadgeCheck, Heart, Check, X, ChevronDown, ChevronRight, Calendar, MapPin, Sparkles, Crown } from "lucide-react";
import { useMessages, type ConversationWithDetails } from "@/hooks/useMessages";
import { useLikeRequests } from "@/hooks/useLikeRequests";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DMChatScreen from "@/components/DMChatScreen";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import founderWilly from "@/assets/founder-willy.jpg";
import founderDaniel from "@/assets/founder-tom.jpg";
import eventAfroNationLogo from "@/assets/event-afro-nation-logo.webp";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  const [activeChatContact, setActiveChatContact] = useState<{ name: string; photo: string; age?: number; vibe?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  const { conversations, loadingConversations, startConversation } = useMessages();
  const { pendingReceived, respondToRequest, isLoading: loadingRequests } = useLikeRequests();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch profiles for pending request senders
  const senderIds = pendingReceived.map(r => r.sender_id);
  const { data: senderProfiles = [] } = useQuery({
    queryKey: ["profiles", senderIds],
    queryFn: async () => {
      if (!senderIds.length) return [];
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, vibe, age, city")
        .in("id", senderIds);
      return data || [];
    },
    enabled: senderIds.length > 0,
  });

  // Fetch events the user RSVPed to for grouping
  const { data: userRsvps = [] } = useQuery({
    queryKey: ["user-rsvps", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("event_rsvps")
        .select("event_id")
        .eq("user_id", user.id);
      return data || [];
    },
    enabled: !!user,
  });

  const rsvpEventIds = userRsvps.map(r => r.event_id);
  const { data: rsvpEvents = [] } = useQuery({
    queryKey: ["rsvp-events", rsvpEventIds],
    queryFn: async () => {
      if (!rsvpEventIds.length) return [];
      const { data } = await supabase
        .from("events")
        .select("id, title, image_url, date")
        .in("id", rsvpEventIds);
      return data || [];
    },
    enabled: rsvpEventIds.length > 0,
  });

  // Group conversations: DMs (non-event) vs event-based
  const filtered = conversations.filter(c => {
    if (!searchQuery) return true;
    const name = c.other_user?.display_name || c.title || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const dmConversations = filtered.filter(c => c.type === "dm" && !c.event_id);
  const eventConversations = filtered.filter(c => c.event_id);
  const eventGroupChats = filtered.filter(c => c.type === "event_group");

  // Fetch member counts for event group chats
  const eventGroupIds = eventGroupChats.map(c => c.id);
  const { data: groupMemberCounts = [] } = useQuery({
    queryKey: ["event-group-member-counts", eventGroupIds],
    queryFn: async () => {
      if (!eventGroupIds.length) return [];
      const results: { conversation_id: string; count: number }[] = [];
      for (const cid of eventGroupIds) {
        const { count } = await supabase
          .from("conversation_members")
          .select("id", { count: "exact", head: true })
          .eq("conversation_id", cid);
        results.push({ conversation_id: cid, count: count ?? 0 });
      }
      return results;
    },
    enabled: eventGroupIds.length > 0,
  });

  // Group event conversations by event (DMs within events + group chats)
  const eventGroups: Record<string, { event: { id: string; title: string; image_url: string | null }; convs: ConversationWithDetails[]; groupChat?: ConversationWithDetails; memberCount?: number }> = {};
  for (const conv of eventConversations) {
    const eid = conv.event_id!;
    if (!eventGroups[eid]) {
      const ev = rsvpEvents.find(e => e.id === eid);
      eventGroups[eid] = { event: ev || { id: eid, title: "Event", image_url: null }, convs: [] };
    }
    if (conv.type === "event_group") {
      eventGroups[eid].groupChat = conv;
      const mc = groupMemberCounts.find(m => m.conversation_id === conv.id);
      eventGroups[eid].memberCount = mc?.count || 0;
    } else {
      eventGroups[eid].convs.push(conv);
    }
  }

  // Find active conversation details
  const activeConv = conversations.find(c => c.id === activeConversationId);

  if (activeConversationId && (activeConv || activeChatContact)) {
    return (
      <DMChatScreen
        conversationId={activeConversationId}
        contactName={activeChatContact?.name || activeConv?.other_user?.display_name || activeConv?.title || "Chat"}
        contactPhoto={activeChatContact?.photo || activeConv?.other_user?.avatar_url || ""}
        contactAge={activeChatContact?.age || activeConv?.other_user?.age || undefined}
        contactVibe={activeChatContact?.vibe || activeConv?.other_user?.vibe || ""}
        isOnline={false}
        onBack={() => { setActiveConversationId(null); setActiveChatContact(null); }}
      />
    );
  }

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

  const toggleEventExpand = (eventId: string) => {
    setExpandedEvents(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

  const handleAcceptRequest = async (requestId: string, senderId: string) => {
    respondToRequest.mutate({ requestId, status: "accepted" }, {
      onSuccess: async () => {
        try {
          const convId = await startConversation(senderId);
          const profile = senderProfiles.find(p => p.id === senderId);
          setActiveChatContact(profile ? { name: profile.display_name, photo: profile.avatar_url || "", age: profile.age || undefined, vibe: profile.vibe || "" } : null);
          setActiveConversationId(convId);
        } catch {
          toast({ title: "Matched! 🎉", description: "Chat will appear in your messages." });
        }
      },
    });
  };

  const handleRejectRequest = (requestId: string) => {
    respondToRequest.mutate({ requestId, status: "rejected" });
  };

  const renderConversationItem = (conv: ConversationWithDetails) => {
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
              {isGroup ? <Users size={20} className="text-muted-foreground" /> : <span className="text-lg font-bold text-muted-foreground">{name.charAt(0)}</span>}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-semibold text-foreground truncate ${conv.unread_count > 0 ? "font-bold" : ""}`}>{name}</p>
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
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-display text-xl font-bold text-gradient-gold">Messages</h1>
            <div className="flex items-center gap-2">
              {pendingReceived.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {pendingReceived.length} request{pendingReceived.length > 1 ? "s" : ""}
                </span>
              )}
              {totalUnread > 0 && (
                <span className="px-2 py-0.5 rounded-full gradient-gold text-[10px] font-bold text-primary-foreground">
                  {totalUnread} unread
                </span>
              )}
            </div>
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
        <Tabs defaultValue="chats" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mx-0 rounded-none border-b border-border bg-transparent h-11">
            <TabsTrigger value="chats" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs font-semibold">
              Chats
            </TabsTrigger>
            <TabsTrigger value="events" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs font-semibold">
              Events
            </TabsTrigger>
            <TabsTrigger value="requests" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs font-semibold relative">
              Requests
              {pendingReceived.length > 0 && (
                <span className="absolute -top-0.5 -right-1 w-4 h-4 rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground flex items-center justify-center">
                  {pendingReceived.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* === CHATS TAB === */}
          <TabsContent value="chats" className="mt-0">
            {/* Pinned Founder Messages */}
            {founderProfiles.map((founder) => (
              <div
                key={founder.id}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors border-b border-border/30 cursor-pointer"
              >
                <div className="relative">
                  <img src={founder.avatar} alt={founder.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/40" />
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
            ) : dmConversations.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
                  <MessageSquarePlus size={28} className="text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-1">No messages yet</h3>
                <p className="text-sm text-muted-foreground">Match with someone to start chatting!</p>
              </div>
            ) : (
              dmConversations.map(renderConversationItem)
            )}
          </TabsContent>

          {/* === EVENTS TAB === */}
          <TabsContent value="events" className="mt-0">
            {rsvpEvents.length === 0 && Object.keys(eventGroups).length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
                  <Calendar size={28} className="text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-1">No event chats</h3>
                <p className="text-sm text-muted-foreground">RSVP to events and match with attendees to start chatting!</p>
              </div>
            ) : (
              <>
                {/* Featured: Afro Nation Group Chat */}
                <div className="border-b border-border/30">
                  <div className="px-4 py-3 bg-gradient-to-r from-[hsl(300,60%,20%)]/30 to-[hsl(45,80%,40%)]/20">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={eventAfroNationLogo} alt="Afro Nation" className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary/40" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full gradient-gold flex items-center justify-center">
                          <Crown size={10} className="text-primary-foreground" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-foreground">AFRO NATION PORTUGAL 2025</p>
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold gradient-gold text-primary-foreground leading-none">FEATURED</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Jun 25–28 · Portimão, Portugal</p>
                        <p className="text-[11px] text-primary mt-0.5 flex items-center gap-1">
                          <Users size={10} /> 8,500+ attendees on app · Group Chat
                        </p>
                      </div>
                    </div>
                    {/* Check if user has an Afro Nation group chat */}
                    {(() => {
                      const afroNationGroup = eventGroupChats.find(c => {
                        const ev = rsvpEvents.find(e => e.id === c.event_id);
                        return ev?.title?.includes("AFRO NATION");
                      });
                      if (afroNationGroup) {
                        return (
                          <button
                            onClick={() => {
                              setActiveChatContact({ name: "AFRO NATION PORTUGAL 2025", photo: eventAfroNationLogo });
                              setActiveConversationId(afroNationGroup.id);
                            }}
                            className="mt-2 w-full py-2 rounded-xl gradient-gold text-sm font-bold text-primary-foreground shadow-gold hover:opacity-90 transition-opacity"
                          >
                            Open Group Chat
                          </button>
                        );
                      }
                      return (
                        <p className="mt-2 text-[11px] text-muted-foreground text-center py-1.5 rounded-xl bg-secondary/50">
                          RSVP to Afro Nation to join the group chat
                        </p>
                      );
                    })()}
                  </div>
                </div>

                {/* Show events user is attending as expandable groups */}
                {rsvpEvents.map(event => {
                  const group = eventGroups[event.id];
                  const convs = group?.convs || [];
                  const groupChat = group?.groupChat;
                  const memberCount = group?.memberCount || 0;
                  const isExpanded = expandedEvents.has(event.id);
                  // Skip Afro Nation from regular list (shown above)
                  if (event.title?.includes("AFRO NATION")) return null;

                  return (
                    <div key={event.id} className="border-b border-border/30">
                      <button
                        onClick={() => toggleEventExpand(event.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors"
                      >
                        {event.image_url ? (
                          <img src={event.image_url} alt={event.title} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                            <Calendar size={18} className="text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-semibold text-foreground truncate">{event.title}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {groupChat ? `${memberCount} in group chat · ` : ""}{convs.length} DM{convs.length !== 1 ? "s" : ""} · {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                        {isExpanded ? (
                          <ChevronDown size={16} className="text-muted-foreground" />
                        ) : (
                          <ChevronRight size={16} className="text-muted-foreground" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="pl-4 bg-secondary/20">
                          {/* Group chat entry */}
                          {groupChat && (
                            <button
                              onClick={() => {
                                setActiveChatContact({ name: event.title, photo: event.image_url || "" });
                                setActiveConversationId(groupChat.id);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors border-b border-border/30"
                            >
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users size={18} className="text-primary" />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <p className="text-sm font-semibold text-foreground">Group Chat</p>
                                <p className="text-[11px] text-muted-foreground">{memberCount} members · {groupChat.last_message || "Say hello! 👋"}</p>
                              </div>
                            </button>
                          )}
                          {convs.map(renderConversationItem)}
                          {!groupChat && convs.length === 0 && (
                            <div className="pr-4 py-4">
                              <p className="text-xs text-muted-foreground text-center">No chats yet for this event. Match with attendees!</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Show event convs that don't match user's RSVPs */}
                {Object.entries(eventGroups)
                  .filter(([eid]) => !rsvpEvents.some(e => e.id === eid))
                  .map(([eid, group]) => (
                    <div key={eid} className="border-b border-border/30">
                      <button
                        onClick={() => toggleEventExpand(eid)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                          <Calendar size={18} className="text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-semibold text-foreground truncate">{group.event.title}</p>
                          <p className="text-[11px] text-muted-foreground">{group.convs.length} chat{group.convs.length !== 1 ? "s" : ""}</p>
                        </div>
                        {expandedEvents.has(eid) ? <ChevronDown size={16} className="text-muted-foreground" /> : <ChevronRight size={16} className="text-muted-foreground" />}
                      </button>
                      {expandedEvents.has(eid) && (
                        <div className="pl-4 bg-secondary/20">{group.convs.map(renderConversationItem)}</div>
                      )}
                    </div>
                  ))}
              </>
            )}
          </TabsContent>

          {/* === REQUESTS TAB === */}
          <TabsContent value="requests" className="mt-0">
            {loadingRequests ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="text-primary animate-spin" />
              </div>
            ) : pendingReceived.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
                  <Heart size={28} className="text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-1">No pending requests</h3>
                <p className="text-sm text-muted-foreground">When someone likes you, their request will appear here.</p>
              </div>
            ) : (
              pendingReceived.map((req) => {
                const profile = senderProfiles.find(p => p.id === req.sender_id);
                if (!profile) return null;

                return (
                  <div key={req.id} className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
                    <button onClick={() => setPreviewProfile(profile.id)} className="relative flex-shrink-0">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.display_name} className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/40" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center ring-2 ring-primary/40">
                          <span className="text-xl font-bold text-muted-foreground">{profile.display_name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-destructive flex items-center justify-center">
                        <Heart size={10} className="text-destructive-foreground fill-current" />
                      </div>
                    </button>
                    <button onClick={() => setPreviewProfile(profile.id)} className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-bold text-foreground">
                        {profile.display_name}{profile.age ? `, ${profile.age}` : ""}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {profile.vibe || profile.city || "Wants to connect"} · {formatTime(req.created_at)}
                      </p>
                      <p className="text-[10px] text-primary mt-0.5">Tap to view profile</p>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRejectRequest(req.id)}
                        className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-destructive/10 transition-colors"
                      >
                        <X size={16} className="text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleAcceptRequest(req.id, req.sender_id)}
                        disabled={respondToRequest.isPending}
                        className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center shadow-gold hover:opacity-90 transition-opacity"
                      >
                        <Check size={16} className="text-primary-foreground" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Profile Preview Modal */}
            {previewProfile && (() => {
              const profile = senderProfiles.find(p => p.id === previewProfile);
              const req = pendingReceived.find(r => r.sender_id === previewProfile);
              if (!profile || !req) return null;
              return (
                <div className="fixed inset-0 z-[70] flex items-center justify-center">
                  <div className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={() => setPreviewProfile(null)} />
                  <div className="relative w-full max-w-sm mx-4 bg-card rounded-3xl border border-border shadow-2xl overflow-hidden animate-slide-up">
                    <div className="relative">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.display_name} className="w-full aspect-[3/4] object-cover" />
                      ) : (
                        <div className="w-full aspect-[3/4] bg-secondary flex items-center justify-center">
                          <span className="text-6xl font-bold text-muted-foreground">{profile.display_name.charAt(0)}</span>
                        </div>
                      )}
                      <button onClick={() => setPreviewProfile(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center">
                        <X size={18} className="text-foreground" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent p-4 pt-16">
                        <h2 className="text-2xl font-display font-bold text-foreground">
                          {profile.display_name}{profile.age ? `, ${profile.age}` : ""}
                        </h2>
                        {profile.city && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin size={14} /> {profile.city}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {profile.vibe && (
                        <div className="flex items-center gap-2">
                          <Sparkles size={14} className="text-primary" />
                          <span className="text-sm text-muted-foreground">{profile.vibe}</span>
                        </div>
                      )}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => { handleRejectRequest(req.id); setPreviewProfile(null); }}
                          className="flex-1 py-3 rounded-xl bg-secondary border border-border text-sm font-semibold text-foreground hover:bg-destructive/10 transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => { handleAcceptRequest(req.id, req.sender_id); setPreviewProfile(null); }}
                          disabled={respondToRequest.isPending}
                          className="flex-1 py-3 rounded-xl gradient-gold text-sm font-bold text-primary-foreground shadow-gold hover:opacity-90 transition-opacity"
                        >
                          Accept & Chat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MessagesScreen;
