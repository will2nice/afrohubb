import { Calendar, MapPin, ExternalLink, Share2, Users, UserCheck, Bookmark } from "lucide-react";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    host: string;
    date: string;
    venue: string;
    image: string;
    free: boolean;
    price?: string;
    category: string;
    source: string;
    description?: string;
    external_url?: string;
  };
  isGoing: boolean;
  onRsvp: () => void;
  onGetTickets: () => void;
  onTable: () => void;
  onShare: () => void;
  sourceLabel: string | null;
  sourceColor: string;
}

const SOURCE_ICONS: Record<string, string> = {
  eventbrite: "🎟️",
  posh: "✨",
  dice: "🎲",
  shotgun: "🔫",
  billetto: "🎫",
  afronation: "🌍",
  partyfoul: "🎉",
};

const EventCard = ({ event, isGoing, onRsvp, onGetTickets, onTable, onShare, sourceLabel, sourceColor }: EventCardProps) => {
  const handleViewEvent = () => {
    if (event.external_url) {
      window.open(event.external_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <article className="bg-card rounded-2xl border border-border overflow-hidden shadow-card animate-slide-up flex flex-col">
      <div className="relative">
        <img src={event.image} alt={event.title} className="w-full aspect-square object-cover" loading="lazy" />
        {/* Source badge with icon */}
        <div className="absolute top-2 left-2 flex gap-1">
          {sourceLabel && (
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${sourceColor} text-white backdrop-blur-sm flex items-center gap-0.5`}>
              <span>{SOURCE_ICONS[event.source] || "🔗"}</span> {sourceLabel}
            </span>
          )}
          {isGoing && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-green-500/90 text-white backdrop-blur-sm flex items-center gap-0.5">
              <UserCheck size={8} /> Going
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            event.free
              ? "bg-card/90 text-primary border border-primary/30"
              : "gradient-gold text-primary-foreground"
          }`}>
            {event.free ? "Free" : event.price || "Paid"}
          </span>
        </div>
        {/* Bottom gradient with title + promoter */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-10">
          <h3 className="font-display font-bold text-white text-sm leading-tight line-clamp-2">{event.title}</h3>
          <p className="text-[10px] text-white/70 mt-0.5 flex items-center gap-1">
            {event.host}
          </p>
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2">
          <div className="flex items-center gap-0.5">
            <Calendar size={10} className="text-primary" />
            <span className="truncate">{event.date}</span>
          </div>
          {event.venue && (
            <div className="flex items-center gap-0.5">
              <MapPin size={10} className="text-primary" />
              <span className="truncate max-w-[80px]">{event.venue}</span>
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-1 pt-1">
          <div className="flex items-center gap-1">
            <button onClick={onShare} className="p-1.5 rounded-full hover:bg-secondary transition-colors" title="Share">
              <Share2 size={12} className="text-muted-foreground" />
            </button>
            <button onClick={onRsvp} className="p-1.5 rounded-full hover:bg-secondary transition-colors" title="Save">
              <Bookmark size={12} className={isGoing ? "text-primary fill-primary" : "text-muted-foreground"} />
            </button>
          </div>
          {/* Primary CTA: View on source platform */}
          {event.external_url ? (
            <button
              onClick={handleViewEvent}
              className="px-3 py-1.5 rounded-full text-[10px] font-semibold gradient-gold text-primary-foreground shadow-gold flex items-center gap-1"
            >
              <ExternalLink size={10} /> View Event
            </button>
          ) : (
            <button
              onClick={onRsvp}
              className="px-3 py-1.5 rounded-full text-[10px] font-semibold gradient-gold text-primary-foreground shadow-gold flex items-center gap-1"
            >
              <UserCheck size={10} /> RSVP
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default EventCard;
