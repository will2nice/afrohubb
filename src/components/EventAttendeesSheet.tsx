import { useState, useEffect } from "react";
import { X, Heart, MessageCircle, Users, Sparkles, Lock, Crown, Megaphone, Send } from "lucide-react";
import { type EventItem, SOUNDCLASH_EVENT_ID } from "@/data/cityData";
import { getEventAttendees, type Attendee, ON_APP_WOMEN, ON_APP_MEN, ON_APP_TOTAL, TOTAL_ATTENDING, FREE_ATTENDEE_LIMIT } from "@/data/eventAttendees";
import { getSoundclashAttendees, SOUNDCLASH_TOTAL, SOUNDCLASH_ON_APP, SOUNDCLASH_WOMEN, SOUNDCLASH_MEN, type SoundclashAttendee } from "@/data/soundclashAttendees";
import DMChatScreen, { type ChatContact } from "@/components/DMChatScreen";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import SubscriptionModal from "@/components/SubscriptionModal";
import { useEventPromoters } from "@/hooks/useEventPromoters";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface EventAttendeesSheetProps {
  event: EventItem;
  onClose: () => void;
}

const EventAttendeesSheet = ({ event, onClose }: EventAttendeesSheetProps) => {
  const [filter, setFilter] = useState<"women" | "men" | "all">("women");
  const [chatContact, setChatContact] = useState<ChatContact | null>(null);
  const [showSubscription, setShowSubscription] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [broadcasts, setBroadcasts] = useState<{ id: string; message: string; created_at: string }[]>([]);
  const userRole = useUserRole();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isPromoter } = useEventPromoters(String(event.id));

  const isSoundclash = event.id === SOUNDCLASH_EVENT_ID;

  // Get attendees based on event type
  const standardAttendees = !isSoundclash ? getEventAttendees(event.id) : { females: [], males: [] };
  const soundclashData = isSoundclash ? getSoundclashAttendees() : null;

  const isPaid = userRole === "admin";

  // Fetch broadcasts for this event
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

  // Resolve attendee lists
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

  // Free users see only FREE_ATTENDEE_LIMIT
  const visibleAttendees = isPaid ? allAttendees : allAttendees.slice(0, FREE_ATTENDEE_LIMIT);
  const hiddenCount = isPaid ? 0 : Math.max(0, allAttendees.length - FREE_ATTENDEE_LIMIT);

  const formattedAttending = totalAttending >= 1000
    ? `${(totalAttending / 1000).toFixed(1)}K`
    : totalAttending;

  const openChat = (person: Attendee | SoundclashAttendee) => {
    if (!isPaid) {
      setShowSubscription(true);
      return;
    }
    setChatContact({
      id: person.id,
      name: person.name,
      age: person.age,
      photo: person.photo,
      vibe: person.vibe,
      online: true,
    });
  };

  if (chatContact) {
    return (
      <DMChatScreen
        conversationId=""
        contactName={chatContact.name}
        contactPhoto={chatContact.photo}
        contactAge={chatContact.age}
        contactVibe={chatContact.vibe}
        isOnline={true}
        eventContext={event.title}
        onBack={() => setChatContact(null)}
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

          {/* Stats */}
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

          {/* Gender filter */}
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

        {/* Broadcast messages banner */}
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
          {visibleAttendees.map((person) => (
            <AttendeeCard
              key={person.id}
              person={person}
              isPaid={isPaid}
              onMessage={() => openChat(person)}
              onLikeBlocked={() => {
                if (!isPaid) setShowSubscription(true);
              }}
            />
          ))}

          {/* Paywall blur wall */}
          {hiddenCount > 0 && (
            <div className="relative mt-4">
              {/* Blurred preview cards */}
              <div className="space-y-3 blur-md pointer-events-none select-none">
                {allAttendees.slice(FREE_ATTENDEE_LIMIT, FREE_ATTENDEE_LIMIT + 3).map((person) => (
                  <AttendeeCard key={person.id} person={person} isPaid={true} onMessage={() => {}} onLikeBlocked={() => {}} />
                ))}
              </div>
              {/* Upgrade overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl">
                <Crown size={32} className="text-primary mb-2" />
                <p className="font-display font-bold text-foreground text-base">+{hiddenCount.toLocaleString()} more people</p>
                <p className="text-xs text-muted-foreground mt-1 text-center px-8">
                  Upgrade to AfroHub Plus to see all attendees, names, ages & connect
                </p>
                <button
                  onClick={() => setShowSubscription(true)}
                  className="mt-3 px-6 py-2.5 rounded-full gradient-gold text-primary-foreground text-sm font-semibold shadow-gold hover:scale-105 active:scale-95 transition-transform"
                >
                  Unlock AfroHub Plus 👑
                </button>
              </div>
            </div>
          )}

          {visibleAttendees.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">No matches found for this filter</p>
            </div>
          )}
        </div>
      </div>
      <SubscriptionModal open={showSubscription} onOpenChange={setShowSubscription} />
    </div>
  );
};

const AttendeeCard = ({ person, isPaid, onMessage, onLikeBlocked }: { person: Attendee | SoundclashAttendee; isPaid: boolean; onMessage: () => void; onLikeBlocked: () => void }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-2xl border border-border">
      <img
        src={person.photo}
        alt="Attendee"
        className="w-16 h-16 rounded-xl object-cover ring-2 ring-border"
      />
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
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => {
            if (!isPaid) { onLikeBlocked(); return; }
            setLiked(!liked);
          }}
          className={`p-2 rounded-full transition-all ${
            liked ? "bg-red-500/20" : "hover:bg-secondary"
          }`}
        >
          <Heart
            size={18}
            className={liked ? "text-red-500 fill-red-500" : "text-muted-foreground"}
          />
        </button>
        <button onClick={onMessage} className="p-2 rounded-full hover:bg-secondary transition-colors">
          <MessageCircle size={18} className="text-primary" />
        </button>
      </div>
    </div>
  );
};

export default EventAttendeesSheet;
