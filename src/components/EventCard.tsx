import { Calendar, MapPin, Ticket, UserCheck, ExternalLink, Share2, Users } from "lucide-react";

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
  };
  isGoing: boolean;
  onRsvp: () => void;
  onGetTickets: () => void;
  onTable: () => void;
  onShare: () => void;
  sourceLabel: string | null;
  sourceColor: string;
}

const EventCard = ({ event, isGoing, onRsvp, onGetTickets, onTable, onShare, sourceLabel, sourceColor }: EventCardProps) => {
  return (
    <article className="bg-card rounded-2xl border border-border overflow-hidden shadow-card animate-slide-up flex flex-col">
      <div className="relative">
        <img src={event.image} alt={event.title} className="w-full aspect-square object-cover" loading="lazy" />
        {/* Overlay badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {sourceLabel && (
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${sourceColor} text-white backdrop-blur-sm flex items-center gap-0.5`}>
              <ExternalLink size={8} /> {sourceLabel}
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
            {event.free ? "Free" : event.price || "Tickets"}
          </span>
        </div>
        {/* Bottom gradient with title overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-10">
          <h3 className="font-display font-bold text-white text-sm leading-tight line-clamp-2">{event.title}</h3>
          <p className="text-[10px] text-white/70 mt-0.5">{event.host}</p>
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
            <button onClick={onShare} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
              <Share2 size={12} className="text-muted-foreground" />
            </button>
            <button onClick={onTable} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
              <Users size={12} className="text-muted-foreground" />
            </button>
          </div>
          {isGoing ? (
            <button
              onClick={onRsvp}
              className="px-3 py-1.5 rounded-full text-[10px] font-semibold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1"
            >
              <UserCheck size={10} /> Going ✓
            </button>
          ) : event.free ? (
            <button
              onClick={onRsvp}
              className="px-3 py-1.5 rounded-full text-[10px] font-semibold gradient-gold text-primary-foreground shadow-gold flex items-center gap-1"
            >
              <Ticket size={10} /> RSVP
            </button>
          ) : (
            <button
              onClick={onGetTickets}
              className="px-3 py-1.5 rounded-full text-[10px] font-semibold gradient-gold text-primary-foreground shadow-gold flex items-center gap-1"
            >
              <Ticket size={10} /> Tickets
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default EventCard;
