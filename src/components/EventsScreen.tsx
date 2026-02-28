import { Search, MapPin, Calendar, Users, Share2 } from "lucide-react";
import eventParty from "@/assets/event-party.jpg";
import eventBrunch from "@/assets/event-brunch.jpg";
import eventConcert from "@/assets/event-concert.jpg";

const filters = ["All", "Today", "This Weekend", "Afrobeats", "Networking", "Sports", "Faith", "Family"];

const events = [
  {
    id: 1,
    title: "Afrobeats Night — Friday Vibes",
    host: "AfroHub Community",
    date: "Fri, Mar 7 · 9:00 PM",
    venue: "Cedar Street Courtyard",
    city: "Austin, TX",
    distance: "2.3 mi",
    image: eventParty,
    attending: 186,
    free: false,
  },
  {
    id: 2,
    title: "Diaspora Brunch — Sunday Edition",
    host: "Diaspora Brunch Club",
    date: "Sun, Mar 9 · 11:00 AM",
    venue: "The Grove Houston",
    city: "Houston, TX",
    distance: "165 mi",
    image: eventBrunch,
    attending: 86,
    free: true,
  },
  {
    id: 3,
    title: "Burna Boy Tribute Night",
    host: "Empire Control Room",
    date: "Sat, Mar 8 · 9:00 PM",
    venue: "Empire Control Room",
    city: "Austin, TX",
    distance: "1.8 mi",
    image: eventConcert,
    attending: 342,
    free: false,
  },
];

const EventsScreen = () => {
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display text-xl font-bold text-gradient-gold mb-3">Events</h1>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>
      </header>

      {/* Filter chips */}
      <div className="px-4 py-3 overflow-x-auto scrollbar-hide max-w-lg mx-auto">
        <div className="flex gap-2 w-max">
          {filters.map((filter, i) => (
            <button
              key={filter}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                i === 0
                  ? "gradient-gold text-primary-foreground shadow-gold"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Events list */}
      <div className="px-4 space-y-4 max-w-lg mx-auto">
        {events.map((event) => (
          <article
            key={event.id}
            className="bg-card rounded-2xl border border-border overflow-hidden shadow-card animate-slide-up"
          >
            <div className="relative">
              <img
                src={event.image}
                alt={event.title}
                className="w-full aspect-[16/9] object-cover"
                loading="lazy"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  event.free
                    ? "bg-card/90 text-primary border border-primary/30"
                    : "gradient-gold text-primary-foreground"
                }`}>
                  {event.free ? "Free" : "Tickets"}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-display font-bold text-foreground text-lg leading-tight">
                {event.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{event.host}</p>

              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar size={14} className="text-primary" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} className="text-primary" />
                  <span>{event.distance}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{event.attending} attending</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full hover:bg-secondary transition-colors">
                    <Share2 size={16} className="text-muted-foreground" />
                  </button>
                  <button className="px-5 py-2 rounded-full gradient-gold text-primary-foreground text-sm font-semibold shadow-gold transition-transform hover:scale-105 active:scale-95">
                    RSVP
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default EventsScreen;
