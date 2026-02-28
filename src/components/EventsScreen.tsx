import { useState } from "react";
import { Search, MapPin, Calendar, Users, Share2, Ticket, Eye, ChevronDown, Check, UserCheck } from "lucide-react";
import { events as allEvents, cities, type City, type EventItem } from "@/data/cityData";
import EventAttendeesSheet from "@/components/EventAttendeesSheet";

const filters = ["All", "Today", "This Weekend", "Concerts", "Festivals", "Sports", "Art", "Networking"];

interface EventsScreenProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

const EventsScreen = ({ selectedCity, onCityChange }: EventsScreenProps) => {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [rsvpEvents, setRsvpEvents] = useState<Set<number>>(new Set());
  const cityEvents = allEvents.filter((e) => e.city === selectedCity.id);

  const toggleRsvp = (event: EventItem) => {
    setRsvpEvents((prev) => {
      const next = new Set(prev);
      if (next.has(event.id)) {
        next.delete(event.id);
      } else {
        next.add(event.id);
        // Auto-open attendees when you RSVP
        setSelectedEvent(event);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-display text-xl font-bold text-gradient-gold">Events</h1>
            <button
              onClick={() => setShowCityPicker(!showCityPicker)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border"
            >
              <MapPin size={14} className="text-primary" />
              <span className="text-sm font-medium text-foreground">{selectedCity.flag} {selectedCity.name}</span>
              <ChevronDown size={14} className={`text-muted-foreground transition-transform ${showCityPicker ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* City picker dropdown */}
          {showCityPicker && (
            <div className="absolute left-4 right-4 top-14 bg-card border border-border rounded-xl shadow-elevated z-50 overflow-hidden animate-slide-up max-w-lg mx-auto">
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => { onCityChange(city); setShowCityPicker(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors"
                >
                  <span className="text-lg">{city.flag}</span>
                  <span className="text-sm font-medium text-foreground flex-1 text-left">{city.name}</span>
                  {city.id === selectedCity.id && (
                    <Check size={16} className="text-primary" />
                  )}
                </button>
              ))}
            </div>
          )}

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
        {cityEvents.map((event) => {
          const isGoing = rsvpEvents.has(event.id);
          return (
            <article
              key={event.id}
              className="bg-card rounded-2xl border border-border overflow-hidden shadow-card animate-slide-up"
            >
              <div className="relative">
                <img src={event.image} alt={event.title} className="w-full aspect-[16/9] object-cover" loading="lazy" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {event.category && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-card/90 text-foreground border border-border backdrop-blur-sm">
                      {event.category}
                    </span>
                  )}
                  {isGoing && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-500/90 text-white backdrop-blur-sm flex items-center gap-1">
                      <UserCheck size={10} /> Going
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.free
                      ? "bg-card/90 text-primary border border-primary/30"
                      : "gradient-gold text-primary-foreground"
                  }`}>
                    {event.free ? "Free" : event.price || "Tickets"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-display font-bold text-foreground text-lg leading-tight">{event.title}</h3>
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
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="flex items-center gap-1.5 group"
                  >
                    <Users size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors underline-offset-2 group-hover:underline">
                      {event.attending >= 1000 ? `${(event.attending / 1000).toFixed(1)}K` : event.attending} attending
                    </span>
                    <Eye size={12} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-full hover:bg-secondary transition-colors">
                      <Share2 size={16} className="text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => toggleRsvp(event)}
                      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                        isGoing
                          ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                          : "gradient-gold text-primary-foreground shadow-gold hover:scale-105 active:scale-95"
                      }`}
                    >
                      {isGoing ? (
                        <>
                          <UserCheck size={14} />
                          I'm Going
                        </>
                      ) : event.price ? (
                        <>
                          <Ticket size={14} />
                          Get Tickets
                        </>
                      ) : (
                        "RSVP"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Attendees Sheet */}
      {selectedEvent && (
        <EventAttendeesSheet event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
};

export default EventsScreen;
