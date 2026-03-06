import { useState } from "react";
import { useScreenView } from "@/hooks/useAnalytics";
import { trackEvent } from "@/lib/posthog";
import { Search, MapPin, Calendar, Users, Share2, Ticket, Eye, UserCheck, Plus, Download, Loader2, ExternalLink, X, CheckCircle, XCircle } from "lucide-react";
import { events as allEvents, cities, type City, type EventItem, SOUNDCLASH_EVENT_ID, AFRO_NATION_EVENT_ID } from "@/data/cityData";
import CityPicker from "@/components/CityPicker";
import EventAttendeesSheet from "@/components/EventAttendeesSheet";
import CreateEventSheet from "@/components/CreateEventSheet";
import TicketPurchaseSheet from "@/components/TicketPurchaseSheet";
import { useEvents } from "@/hooks/useEvents";
import { useEventbriteImport } from "@/hooks/useEventbriteImport";
import { TOTAL_ATTENDING, ON_APP_TOTAL } from "@/data/eventAttendees";
import { SOUNDCLASH_TOTAL, SOUNDCLASH_ON_APP } from "@/data/soundclashAttendees";

const filters = ["All", "Today", "This Weekend", "Concerts", "Festivals", "Sports", "Art", "Networking"];

const filterMap: Record<string, (e: EventItem) => boolean> = {
  "All": () => true,
  "Today": (e) => e.date.toLowerCase().includes("today") || e.date.toLowerCase().includes("fri,") || e.date.toLowerCase().includes("mon,"),
  "This Weekend": (e) => e.date.toLowerCase().includes("sat,") || e.date.toLowerCase().includes("sun,") || e.date.toLowerCase().includes("weekend"),
  "Concerts": (e) => (e.category?.toLowerCase().includes("afrobeats") || e.category?.toLowerCase().includes("concert") || e.category?.toLowerCase().includes("hip-hop") || e.category?.toLowerCase().includes("r&b") || e.title.toLowerCase().includes("concert") || e.title.toLowerCase().includes("live")) ?? false,
  "Festivals": (e) => e.category?.toLowerCase().includes("festival") ?? false,
  "Sports": (e) => (e.category?.toLowerCase().includes("soccer") || e.category?.toLowerCase().includes("sports") || e.category?.toLowerCase().includes("watch party") || e.category?.toLowerCase().includes("fifa")) ?? false,
  "Art": (e) => (e.title.toLowerCase().includes("art") || e.title.toLowerCase().includes("film") || e.category?.toLowerCase().includes("culture")) ?? false,
  "Networking": (e) => (e.category?.toLowerCase().includes("networking") || e.title.toLowerCase().includes("mixer") || e.title.toLowerCase().includes("professional")) ?? false,
};

interface EventsScreenProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

const hashCode = (s: string) => s.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);

const EventsScreen = ({ selectedCity, onCityChange }: EventsScreenProps) => {
  useScreenView("events", { city: selectedCity.id });
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [rsvpEvents, setRsvpEvents] = useState<Set<number>>(new Set());
  const [notGoingEvents, setNotGoingEvents] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [rsvpDialogEvent, setRsvpDialogEvent] = useState<EventItem | null>(null);
  const [ticketEvent, setTicketEvent] = useState<{ id: string; title: string } | null>(null);
  const { events: dbEvents } = useEvents(selectedCity.id);
  const { importEvents, importing } = useEventbriteImport();

  const dbMapped: (EventItem & { source?: string; external_url?: string; dbId?: string })[] = dbEvents.map((e) => ({
    id: typeof e.id === "string" ? Math.abs(hashCode(e.id)) : 0,
    dbId: e.id,
    title: e.title,
    host: (e as any).source === "eventbrite" ? "via Eventbrite" : (e as any).source === "posh" ? "via Posh" : "Community",
    date: new Date(e.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
    venue: e.location || "",
    city: e.city,
    distance: "",
    image: e.image_url || "/placeholder.svg",
    attending: TOTAL_ATTENDING,
    free: e.price === "Free",
    price: e.price || undefined,
    category: e.category,
    source: (e as any).source || "user",
    external_url: (e as any).external_url || undefined,
  }));

  const poshEvents = dbMapped.filter((e) => e.source === "posh");
  const otherDbEvents = dbMapped.filter((e) => e.source !== "posh");
  const mockEvents = allEvents.filter((e) => e.city === selectedCity.id);
  const pinnedMock = mockEvents.filter((e) => e.source === "posh");
  const unpinnedMock = mockEvents.filter((e) => e.source !== "posh");
  const cityEvents = [...pinnedMock, ...poshEvents, ...otherDbEvents, ...unpinnedMock];
  const filterFn = filterMap[activeFilter] || (() => true);
  const filteredEvents = cityEvents.filter(filterFn).filter(e =>
    searchQuery === "" || e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.host.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRsvpAction = (event: EventItem, action: "going" | "not_going") => {
    trackEvent("event_rsvp", { event_id: event.id, event_title: event.title, action, city: event.city });
    if (action === "going") {
      setRsvpEvents((prev) => new Set(prev).add(event.id));
      setNotGoingEvents((prev) => { const n = new Set(prev); n.delete(event.id); return n; });
      setSelectedEvent(event);
    } else {
      setNotGoingEvents((prev) => new Set(prev).add(event.id));
      setRsvpEvents((prev) => { const n = new Set(prev); n.delete(event.id); return n; });
    }
    setRsvpDialogEvent(null);
  };

  const formatAttending = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-display text-xl font-bold text-gradient-gold">Events</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => importEvents([selectedCity.id])}
                disabled={importing}
                className="p-2 rounded-full bg-secondary border border-border hover:bg-muted transition-colors"
                title="Import from Eventbrite"
              >
                {importing ? <Loader2 size={16} className="text-primary animate-spin" /> : <Download size={16} className="text-primary" />}
              </button>
              <button onClick={() => setShowCreateEvent(true)} className="p-2 rounded-full gradient-gold">
                <Plus size={16} className="text-primary-foreground" />
              </button>
              <CityPicker selectedCity={selectedCity} onCityChange={onCityChange} />
            </div>
          </div>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>
      </header>

      {/* Filter chips */}
      <div className="px-4 py-3 overflow-x-auto scrollbar-hide max-w-lg mx-auto">
        <div className="flex gap-2 w-max">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? "gradient-gold text-primary-foreground shadow-gold"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {activeFilter !== "All" && (
        <div className="px-4 pb-2 max-w-lg mx-auto">
          <p className="text-xs text-muted-foreground">{filteredEvents.length} events found</p>
        </div>
      )}

      {/* Events list */}
      <div className="px-4 space-y-4 max-w-lg mx-auto">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Calendar size={40} className="text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-sm text-muted-foreground">No events match this filter</p>
            <button onClick={() => setActiveFilter("All")} className="mt-3 text-sm text-primary font-semibold">Show all events</button>
          </div>
        ) : filteredEvents.map((event) => {
          const isGoing = rsvpEvents.has(event.id);
          const isNotGoing = notGoingEvents.has(event.id);
          const isEventbrite = event.source === "eventbrite" || (event as any).source === "eventbrite";
          const isPosh = event.source === "posh" || (event as any).source === "posh";
          const isAfroNation = event.id === AFRO_NATION_EVENT_ID;
          const isSoundclash = event.id === SOUNDCLASH_EVENT_ID;
          const displayAttending = isAfroNation ? 45000 : isSoundclash ? SOUNDCLASH_TOTAL : TOTAL_ATTENDING;
          const displayOnApp = isAfroNation ? 8500 : isSoundclash ? SOUNDCLASH_ON_APP : ON_APP_TOTAL;

          return (
            <article key={event.id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-card animate-slide-up">
              <div className="relative">
                <img src={event.image} alt={event.title} className="w-full aspect-[16/9] object-cover" loading="lazy" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {isEventbrite && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[hsl(14,100%,53%)]/90 text-white backdrop-blur-sm flex items-center gap-1">
                      <ExternalLink size={10} /> Eventbrite
                    </span>
                  )}
                  {isPosh && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[hsl(270,80%,60%)]/90 text-white backdrop-blur-sm flex items-center gap-1">
                      <ExternalLink size={10} /> Posh
                    </span>
                  )}
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
                  {isNotGoing && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-red-500/90 text-white backdrop-blur-sm flex items-center gap-1">
                      <XCircle size={10} /> Not Going
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

                {/* Attending stats row */}
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => setSelectedEvent(event)} className="flex items-center gap-1.5 group">
                    <Users size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors underline-offset-2 group-hover:underline">
                      {formatAttending(displayAttending)} attending
                    </span>
                    <Eye size={12} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <span className="text-[10px] text-primary font-medium px-2 py-0.5 rounded-full bg-primary/10">
                    {displayOnApp.toLocaleString()} on app
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <button className="p-2 rounded-full hover:bg-secondary transition-colors">
                    <Share2 size={16} className="text-muted-foreground" />
                  </button>
                  <div className="flex items-center gap-2">
                    {isGoing ? (
                      <button
                        onClick={() => { setRsvpEvents(prev => { const n = new Set(prev); n.delete(event.id); return n; }); }}
                        className="px-5 py-2 rounded-full text-sm font-semibold bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all flex items-center gap-1.5"
                      >
                        <UserCheck size={14} /> I'm Going
                      </button>
                    ) : event.free ? (
                      <button
                        onClick={() => setRsvpDialogEvent(event)}
                        className="px-5 py-2 rounded-full text-sm font-semibold gradient-gold text-primary-foreground shadow-gold hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <Ticket size={14} /> RSVP
                      </button>
                    ) : (event as any).dbId ? (
                      <button
                        onClick={() => setTicketEvent({ id: (event as any).dbId, title: event.title })}
                        className="px-5 py-2 rounded-full text-sm font-semibold gradient-gold text-primary-foreground shadow-gold hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <Ticket size={14} /> Get Tickets
                      </button>
                    ) : (
                      <button
                        onClick={() => setRsvpDialogEvent(event)}
                        className="px-5 py-2 rounded-full text-sm font-semibold gradient-gold text-primary-foreground shadow-gold hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <Ticket size={14} /> RSVP
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* RSVP Dialog */}
      {rsvpDialogEvent && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setRsvpDialogEvent(null)} />
          <div className="relative w-full max-w-sm mx-4 mb-8 sm:mb-0 bg-card rounded-2xl border border-border shadow-2xl p-5 animate-slide-up">
            <button onClick={() => setRsvpDialogEvent(null)} className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-secondary">
              <X size={18} className="text-muted-foreground" />
            </button>
            <h3 className="font-display font-bold text-foreground text-base pr-8 leading-tight">{rsvpDialogEvent.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{rsvpDialogEvent.date}</p>

            <div className="mt-5 space-y-3">
              <button
                onClick={() => handleRsvpAction(rsvpDialogEvent, "going")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-all"
              >
                <CheckCircle size={20} className="text-green-500" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">I'm Going ✅</p>
                  <p className="text-[11px] text-muted-foreground">RSVP & see who else is attending</p>
                </div>
              </button>

              <button
                onClick={() => handleRsvpAction(rsvpDialogEvent, "not_going")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary border border-border hover:bg-muted transition-all"
              >
                <XCircle size={20} className="text-muted-foreground" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Not Going</p>
                  <p className="text-[11px] text-muted-foreground">Maybe next time</p>
                </div>
              </button>

              {!rsvpDialogEvent.free && (rsvpDialogEvent as any).dbId && (
                <button
                  onClick={() => { setRsvpDialogEvent(null); setTicketEvent({ id: (rsvpDialogEvent as any).dbId, title: rsvpDialogEvent.title }); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl gradient-gold text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Ticket size={20} />
                  <div className="text-left">
                    <p className="text-sm font-semibold">Buy Tickets</p>
                    <p className="text-[11px] opacity-80">{rsvpDialogEvent.price || "View pricing"}</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedEvent && (
        <EventAttendeesSheet event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
      <CreateEventSheet open={showCreateEvent} onClose={() => setShowCreateEvent(false)} defaultCity={selectedCity.name} />
      {ticketEvent && (
        <TicketPurchaseSheet
          eventId={ticketEvent.id}
          eventTitle={ticketEvent.title}
          open={!!ticketEvent}
          onClose={() => setTicketEvent(null)}
        />
      )}
    </div>
  );
};

export default EventsScreen;
