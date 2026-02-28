import { useState } from "react";
import { X, Heart, MessageCircle, Users, Sparkles } from "lucide-react";
import { type EventItem } from "@/data/cityData";
import { getEventAttendees, type Attendee } from "@/data/eventAttendees";
import DMChatScreen, { type ChatContact } from "@/components/DMChatScreen";

interface EventAttendeesSheetProps {
  event: EventItem;
  onClose: () => void;
}

const EventAttendeesSheet = ({ event, onClose }: EventAttendeesSheetProps) => {
  const [filter, setFilter] = useState<"women" | "men" | "all">("women");
  const [chatContact, setChatContact] = useState<ChatContact | null>(null);
  const { females, males } = getEventAttendees(event.id, event.attending);

  const displayedAttendees =
    filter === "women" ? females :
    filter === "men" ? males :
    [...females, ...males].sort((a, b) => a.mutualFriends > b.mutualFriends ? -1 : 1);

  const totalOnApp = females.length + males.length;
  const formattedAttending = event.attending >= 1000
    ? `${(event.attending / 1000).toFixed(1)}K`
    : event.attending;

  const openChat = (person: Attendee) => {
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
        contact={chatContact}
        eventContext={event.title}
        onBack={() => setChatContact(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative mt-16 flex-1 bg-card rounded-t-3xl border-t border-border overflow-hidden flex flex-col animate-slide-up">
        {/* Handle */}
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
              <span className="text-xs font-semibold text-primary-foreground">{totalOnApp} on the app</span>
            </div>
          </div>

          {/* Gender filter */}
          <div className="flex gap-2">
            {([
              { key: "women" as const, label: `Women (${females.length})`, emoji: "👩🏾" },
              { key: "men" as const, label: `Men (${males.length})`, emoji: "👨🏾" },
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

        {/* Attendees list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 pb-24">
          {displayedAttendees.map((person) => (
            <AttendeeCard key={person.id} person={person} onMessage={() => openChat(person)} />
          ))}
          {displayedAttendees.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">No matches found for this filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AttendeeCard = ({ person, onMessage }: { person: Attendee; onMessage: () => void }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-2xl border border-border">
      <img
        src={person.photo}
        alt={person.name}
        className="w-16 h-16 rounded-xl object-cover ring-2 ring-border"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground text-sm">{person.name}, {person.age}</h3>
          <span className="px-2 py-0.5 rounded-full bg-card text-[10px] font-medium text-muted-foreground border border-border">
            {person.vibe}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{person.bio}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] text-muted-foreground">📍 {person.distance}</span>
          {person.mutualFriends > 0 && (
            <span className="text-[10px] text-primary font-medium">👥 {person.mutualFriends} mutual</span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setLiked(!liked)}
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
