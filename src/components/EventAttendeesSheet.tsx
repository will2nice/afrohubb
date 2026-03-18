import { useState, useEffect } from "react";
import { X, Heart, MessageCircle, Users, Sparkles, Lock, Crown, Megaphone, Send, Clock, Check, Ticket } from "lucide-react";
import { type EventItem, SOUNDCLASH_EVENT_ID } from "@/data/cityData";
import { getEventAttendees, type Attendee, ON_APP_WOMEN, ON_APP_MEN, ON_APP_TOTAL, TOTAL_ATTENDING, FREE_ATTENDEE_LIMIT } from "@/data/eventAttendees";
import { getSoundclashAttendees, SOUNDCLASH_TOTAL, SOUNDCLASH_ON_APP, SOUNDCLASH_WOMEN, SOUNDCLASH_MEN, type SoundclashAttendee } from "@/data/soundclashAttendees";
import DMChatScreen from "@/components/DMChatScreen";
import ProfileViewModal from "@/components/ProfileViewModal";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import SubscriptionModal from "@/components/SubscriptionModal";
import { useEventPromoters } from "@/hooks/useEventPromoters";
import { useLikeRequests } from "@/hooks/useLikeRequests";
import { useMessages } from "@/hooks/useMessages";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

interface EventAttendeesSheetProps {
  event: EventItem;
  onClose: () => void;
}

const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const EventAttendeesSheet = ({ event, onClose }: EventAttendeesSheetProps) => {
  const [filter, setFilter] = useState<"women" | "men" | "all">("women");
  const [activeChatConvId, setActiveChatConvId] = useState<string | null>(null);
  const [activeChatContact, setActiveChatContact] = useState<{ name: string; photo: string; age?: number; vibe?: string } | null>(null);
  const [showSubscription, setShowSubscription] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [broadcasts, setBroadcasts] = useState<{ id: string; message: string; created_at: string }[]>([]);
  const [viewingProfile, setViewingProfile] = useState<(Attendee | SoundclashAttendee) | null>(null);
  // Local like state for mock (non-UUID) demo profiles
  const [localLikes, setLocalLikes] = useState<Set<string>>(new Set());
  const [localMatches, setLocalMatches] = useState<Set<string>>(new Set());
  const userRole = useUserRole();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isPromoter } = useEventPromoters(String(event.id));
  const { sendLike, hasLiked, hasReceivedFrom, isMutualMatch, respondToRequest, getReceivedRequest } = useLikeRequests();
  const { startConversation } = useMessages();

  const isSoundclash = event.id === SOUNDCLASH_EVENT_ID;
  const standardAttendees = !isSoundclash ? getEventAttendees(event.id) : { females: [], males: [] };
  const soundclashData = isSoundclash ? getSoundclashAttendees() : null;
  const isPaid = userRole === "admin";

  // Check if user has a ticket (order) for this event
  const eventIdStr = String(event.id);
  const { data: hasTicket } = useQuery({
    queryKey: ["user_has_ticket", eventIdStr, user?.id],
    queryFn: async () => {
      if (!user || !isUuid(eventIdStr)) return false;
      const { data, error } = await supabase
        .from("orders")
        .select("id")
        .eq("event_id", eventIdStr)
        .eq("user_id", user.id)
        .eq("status", "paid")
        .limit(1);
      if (error) return false;
      // Also check RSVPs as a fallback for free events
      if (data && data.length > 0) return true;
      const { data: rsvp } = await supabase
        .from("event_rsvps")
        .select("id")
        .eq("event_id", eventIdStr)
        .eq("user_id", user.id)
        .limit(1);
      return !!(rsvp && rsvp.length > 0);
    },
    enabled: !!user && isUuid(eventIdStr),
  });

  // User can see full profiles if they have a ticket, are a promoter, or are admin
  const canSeeProfiles = hasTicket || isPromoter || isPaid;
  // Fetch broadcasts
  useEffect(() => {
    const fetchBroadcasts = async () => {
      const { data } = await supabase
        .from("event_broadcasts" as any)
        .select("id, message, created_at")
        .eq("event_id", String(event.id))
        .order("created_at", { ascending: false })
        .limit(5);
      if (data) setBroadcasts(data as any);
    };
    fetchBroadcasts();

    const channel = supabase
      .channel(`broadcasts-${event.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "event_broadcasts", filter: `event_id=eq.${event.id}` }, (payload) => {
        setBroadcasts((prev) => [payload.new as any, ...prev].slice(0, 5));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [event.id]);

  const sendBroadcast = async () => {
    if (!broadcastMsg.trim() || !user) return;
    setSendingBroadcast(true);
    const { error } = await supabase.from("event_broadcasts" as any).insert({
      event_id: String(event.id),
      sender_id: user.id,
      message: broadcastMsg.trim(),
    } as any);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setBroadcastMsg("");
      toast({ title: "Broadcast sent! 📢" });
    }
    setSendingBroadcast(false);
  };

  const females = isSoundclash ? (soundclashData?.females ?? []) : standardAttendees.females;
  const males = isSoundclash ? (soundclashData?.males ?? []) : standardAttendees.males;
  const totalAttending = isSoundclash ? SOUNDCLASH_TOTAL : TOTAL_ATTENDING;
  const onAppTotal = isSoundclash ? SOUNDCLASH_ON_APP : ON_APP_TOTAL;
  const onAppWomen = isSoundclash ? SOUNDCLASH_WOMEN : ON_APP_WOMEN;
  const onAppMen = isSoundclash ? SOUNDCLASH_MEN : ON_APP_MEN;

  const allAttendees =
    filter === "women" ? females :
    filter === "men" ? males :
    [...females, ...males].sort((a: any, b: any) => (b.mutualFriends || 0) - (a.mutualFriends || 0));

  const visibleAttendees = canSeeProfiles ? allAttendees : allAttendees;
  const hiddenCount = 0; // Everyone can see the list, but photos are blurred without ticket

  const formattedAttending = totalAttending >= 1000
    ? `${(totalAttending / 1000).toFixed(1)}K`
    : totalAttending;

  const getLikeStatus = (personId: string): "none" | "sent" | "received" | "matched" => {
    if (!isUuid(personId)) {
      // Mock profile — use local state
      if (localMatches.has(personId)) return "matched";
      if (localLikes.has(personId)) return "sent";
      return "none";
    }
    if (isMutualMatch(personId)) return "matched";
    if (hasLiked(personId)) return "sent";
    if (hasReceivedFrom(personId)) return "received";
    return "none";
  };

  const handleLike = (person: Attendee | SoundclashAttendee) => {
    if (!canSeeProfiles) { setShowSubscription(false); toast({ title: "Ticket required 🎟️", description: "Get your ticket to see who's attending and connect." }); return; }
    if (!user) { toast({ title: "Sign in to like", variant: "destructive" }); return; }

    const personId = String(person.id);

    if (!isUuid(personId)) {
      // Mock profile — simulate like → after a moment auto-match for demo
      if (localLikes.has(personId) || localMatches.has(personId)) return;
      setLocalLikes((prev) => new Set(prev).add(personId));
      toast({ title: "Like sent! 💛", description: "They'll be notified of your interest." });
      // Simulate them liking back after 1.5s for demo
      setTimeout(() => {
        setLocalLikes((prev) => { const n = new Set(prev); n.delete(personId); return n; });
        setLocalMatches((prev) => new Set(prev).add(personId));
        toast({ title: "It's a match! 🎉", description: `${person.name} liked you back! You can now message them.` });
      }, 1500);
      return;
    }

    const status = getLikeStatus(personId);
    if (status === "received") {
      const req = getReceivedRequest(personId);
      if (req) respondToRequest.mutate({ requestId: req.id, status: "accepted" });
    } else if (status === "none") {
      sendLike.mutate(personId);
    }
  };

  const handleMessage = async (person: Attendee | SoundclashAttendee) => {
    if (!canSeeProfiles) { toast({ title: "Ticket required 🎟️", description: "Get your ticket to connect with attendees." }); return; }
    if (!user) { toast({ title: "Sign in first", variant: "destructive" }); return; }

    const personId = String(person.id);
    const matched = !isUuid(personId) ? localMatches.has(personId) : isMutualMatch(personId);

    if (!matched) {
      toast({ title: "Match first 💛", description: "You both need to like each other before messaging." });
      return;
    }

    if (!isUuid(personId)) {
      // Mock profile — open demo chat without DB
      setActiveChatContact({ name: person.name, photo: person.photo, age: person.age, vibe: person.vibe });
      setActiveChatConvId("demo");
      return;
    }

    try {
      const convId = await startConversation(personId);
      setActiveChatContact({ name: person.name, photo: person.photo, age: person.age, vibe: person.vibe });
      setActiveChatConvId(convId);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // DM chat view
  if (activeChatConvId && activeChatContact) {
    return (
      <DMChatScreen
        conversationId={activeChatConvId}
        contactName={activeChatContact.name}
        contactPhoto={activeChatContact.photo}
        contactAge={activeChatContact.age}
        contactVibe={activeChatContact.vibe}
        isOnline={true}
        eventContext={event.title}
        onBack={() => { setActiveChatConvId(null); setActiveChatContact(null); }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative mt-16 flex-1 bg-card rounded-t-3xl border-t border-border overflow-hidden flex flex-col animate-slide-up">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted" />
        </div>

        {/* Header */}
        <div className="px-4 pb-3 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-foreground text-lg leading-tight truncate">{event.title}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{event.date} · {event.venue}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors ml-2">
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary">
              <Users size={14} className="text-primary" />
              <span className="text-xs font-medium text-foreground">{formattedAttending} attending</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full gradient-gold">
              <Sparkles size={14} className="text-primary-foreground" />
              <span className="text-xs font-semibold text-primary-foreground">{onAppTotal.toLocaleString()} on the app</span>
            </div>
          </div>

          <div className="flex gap-2">
            {([
              { key: "women" as const, label: `Women (${onAppWomen})`, emoji: "👩🏾" },
              { key: "men" as const, label: `Men (${onAppMen})`, emoji: "👨🏾" },
              { key: "all" as const, label: "All", emoji: "👥" },
            ]).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  filter === f.key
                    ? "gradient-gold text-primary-foreground shadow-gold"
                    : "bg-secondary text-muted-foreground hover:bg-muted"
                }`}
              >
                <span>{f.emoji}</span>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Broadcasts */}
        {broadcasts.length > 0 && (
          <div className="px-4 py-2 space-y-1.5">
            {broadcasts.slice(0, 2).map((b) => (
              <div key={b.id} className="flex items-start gap-2 bg-primary/10 rounded-xl px-3 py-2">
                <Megaphone size={14} className="text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-foreground flex-1">{b.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Promoter broadcast input */}
        {isPromoter && (
          <div className="px-4 py-2 border-b border-border">
            <div className="flex gap-2">
              <input
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="Broadcast to all attendees..."
                className="flex-1 px-3 py-2 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                onClick={sendBroadcast}
                disabled={sendingBroadcast || !broadcastMsg.trim()}
                className="p-2.5 rounded-xl gradient-gold text-primary-foreground disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Attendees list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 pb-24">
          {/* Ticket gate banner */}
          {!canSeeProfiles && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/10 border border-primary/20 mb-2">
              <Ticket size={24} className="text-primary shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">Get your ticket to unlock</p>
                <p className="text-xs text-muted-foreground mt-0.5">See full profiles, photos, and connect with attendees</p>
              </div>
              <Lock size={16} className="text-muted-foreground shrink-0" />
            </div>
          )}

          {visibleAttendees.map((person) => {
            const personId = String(person.id);
            const status = getLikeStatus(personId);

            return (
              <AttendeeCard
                key={person.id}
                person={person}
                canSeeProfiles={canSeeProfiles}
                likeStatus={status}
                onPhotoClick={() => { if (canSeeProfiles) setViewingProfile(person); else toast({ title: "Ticket required 🎟️", description: "Get your ticket to view profiles." }); }}
                onLike={() => handleLike(person)}
                onMessage={() => handleMessage(person)}
                onLikeBlocked={() => { toast({ title: "Ticket required 🎟️", description: "Get your ticket to connect." }); }}
              />
            );
          })}

          {visibleAttendees.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">No matches found for this filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Profile modal */}
      {viewingProfile && (
        <ProfileViewModal
          person={viewingProfile}
          onClose={() => setViewingProfile(null)}
          onLike={() => { handleLike(viewingProfile); }}
          onMessage={() => { handleMessage(viewingProfile); setViewingProfile(null); }}
          liked={hasLiked(String(viewingProfile.id))}
          likeStatus={getLikeStatus(String(viewingProfile.id))}
        />
      )}

      <SubscriptionModal open={showSubscription} onOpenChange={setShowSubscription} />
    </div>
  );
};

const AttendeeCard = ({
  person,
  isPaid,
  likeStatus,
  onPhotoClick,
  onLike,
  onMessage,
  onLikeBlocked,
}: {
  person: Attendee | SoundclashAttendee;
  isPaid: boolean;
  likeStatus: "none" | "sent" | "received" | "matched";
  onPhotoClick: () => void;
  onLike: () => void;
  onMessage: () => void;
  onLikeBlocked: () => void;
}) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-2xl border border-border">
      {/* Clickable photo */}
      <button onClick={onPhotoClick} className="shrink-0 focus:outline-none">
        <img
          src={person.photo}
          alt={person.name}
          className="w-16 h-16 rounded-xl object-cover ring-2 ring-border hover:ring-primary transition-all cursor-pointer active:scale-95"
        />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {isPaid ? (
            <h3 className="font-semibold text-foreground text-sm">{person.name}, {person.age}</h3>
          ) : (
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-4 rounded bg-muted animate-pulse" />
              <Lock size={12} className="text-muted-foreground" />
            </div>
          )}
          {isPaid && (
            <span className="px-2 py-0.5 rounded-full bg-card text-[10px] font-medium text-muted-foreground border border-border">
              {person.vibe}
            </span>
          )}
        </div>
        {isPaid ? (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{person.bio}</p>
        ) : (
          <p className="text-xs text-muted-foreground mt-0.5 italic">Profile hidden</p>
        )}
        <div className="flex items-center gap-3 mt-1">
          {isPaid && <span className="text-[10px] text-muted-foreground">📍 {person.distance}</span>}
          {isPaid && person.mutualFriends > 0 && (
            <span className="text-[10px] text-primary font-medium">👥 {person.mutualFriends} mutual</span>
          )}
          {/* Like status indicator */}
          {isPaid && likeStatus === "sent" && (
            <span className="text-[10px] text-primary font-medium flex items-center gap-0.5">
              <Clock size={10} /> Pending
            </span>
          )}
          {isPaid && likeStatus === "received" && (
            <span className="text-[10px] text-primary font-medium flex items-center gap-0.5">
              <Heart size={10} className="fill-primary" /> Likes you!
            </span>
          )}
          {isPaid && likeStatus === "matched" && (
            <span className="text-[10px] font-medium flex items-center gap-0.5 text-green-500">
              <Check size={10} /> Matched
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => {
            if (!isPaid) { onLikeBlocked(); return; }
            onLike();
          }}
          className={`p-2 rounded-full transition-all ${
            likeStatus === "matched" || likeStatus === "sent" ? "bg-red-500/20" : "hover:bg-secondary"
          }`}
        >
          <Heart
            size={18}
            className={likeStatus !== "none" ? "text-red-500 fill-red-500" : "text-muted-foreground"}
          />
        </button>
        <button
          onClick={() => {
            if (!isPaid) { onLikeBlocked(); return; }
            onMessage();
          }}
          className={`p-2 rounded-full transition-colors ${
            likeStatus === "matched" ? "hover:bg-primary/20" : "hover:bg-secondary opacity-50"
          }`}
        >
          <MessageCircle size={18} className={likeStatus === "matched" ? "text-primary" : "text-muted-foreground"} />
        </button>
      </div>
    </div>
  );
};

export default EventAttendeesSheet;
