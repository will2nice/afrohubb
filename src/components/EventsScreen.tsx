import { useState } from "react";
import { useScreenView } from "@/hooks/useAnalytics";
import TableBookingSheet from "@/components/TableBookingSheet";
import { trackEvent } from "@/lib/posthog";
import { trackEventViewed } from "@/lib/analytics";
import { Search, Calendar, Plus, Download, Loader2, Link2 } from "lucide-react";
import { type City } from "@/data/cityData";
import EventAddOns from "@/components/EventAddOns";
import CityPicker from "@/components/CityPicker";
import EventAttendeesSheet from "@/components/EventAttendeesSheet";
import CreateEventSheet from "@/components/CreateEventSheet";
import TicketPurchaseSheet from "@/components/TicketPurchaseSheet";
import EventCard from "@/components/EventCard";
import EventCategoryBanners from "@/components/EventCategoryBanners";
import { useEvents, type DbEvent } from "@/hooks/useEvents";
import { useEventbriteImport } from "@/hooks/useEventbriteImport";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MappedEvent {
  id: string;
  title: string;
  host: string;
  date: string;
  rawDate: string;
  venue: string;
  city: string;
  image: string;
  free: boolean;
  price?: string;
  category: string;
  source: string;
  external_url?: string;
  description?: string;
}

const isToday = (e: MappedEvent) => {
  const eventDate = new Date(e.rawDate);
  const now = new Date();
  return eventDate.getFullYear() === now.getFullYear() &&
    eventDate.getMonth() === now.getMonth() &&
    eventDate.getDate() === now.getDate();
};

const isThisWeekend = (e: MappedEvent) => {
  const eventDate = new Date(e.rawDate);
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilSat = (6 - dayOfWeek + 7) % 7 || 7;
  const satStart = new Date(now);
  satStart.setDate(now.getDate() + (dayOfWeek === 6 ? 0 : daysUntilSat));
  satStart.setHours(0, 0, 0, 0);
  const sunEnd = new Date(satStart);
  sunEnd.setDate(satStart.getDate() + 1);
  sunEnd.setHours(23, 59, 59, 999);
  const friStart = new Date(satStart);
  friStart.setDate(satStart.getDate() - 1);
  friStart.setHours(17, 0, 0, 0);
  return eventDate >= friStart && eventDate <= sunEnd;
};

const categoryFilterMap: Record<string, (e: MappedEvent) => boolean> = {
  party: (e) => /party|club|dance|nightlife|afrobeats|brunch/i.test(e.category + " " + e.title),
  live: (e) => /concert|live|performance|hip-hop|r&b|showcase|music/i.test(e.category + " " + e.title),
  activities: (e) => /activity|outdoor|sports|soccer|watch party|fifa|game/i.test(e.category + " " + e.title),
  food: (e) => /food|drink|brunch|dinner|restaurant|bar|cocktail/i.test(e.category + " " + e.title),
  fitness: (e) => /fitness|gym|workout|yoga|run|wellness/i.test(e.category + " " + e.title),
  art: (e) => /art|fashion|film|culture|gallery|exhibition/i.test(e.category + " " + e.title),
  networking: (e) => /networking|mixer|professional|business|conference/i.test(e.category + " " + e.title),
};

const filters = ["All", "Today", "This Weekend"];

const filterMap: Record<string, (e: MappedEvent) => boolean> = {
  "All": () => true,
  "Today": isToday,
  "This Weekend": isThisWeekend,
};

const sourceLabel = (source: string) => {
  const map: Record<string, string> = { eventbrite: "Eventbrite", posh: "Posh", dice: "DICE", shotgun: "Shotgun", billetto: "Billetto", afronation: "Afro Nation" };
  return map[source] || null;
};

const sourceColor = (source: string) => {
  const map: Record<string, string> = { eventbrite: "bg-[hsl(14,100%,53%)]/90", posh: "bg-[hsl(270,80%,60%)]/90", dice: "bg-[hsl(210,80%,50%)]/90", shotgun: "bg-[hsl(330,70%,55%)]/90", billetto: "bg-[hsl(170,60%,45%)]/90" };
  return map[source] || "bg-primary/90";
};

interface EventsScreenProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

const EventsScreen = ({ selectedCity, onCityChange }: EventsScreenProps) => {
  useScreenView("events", { city: selectedCity.id });
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [ticketEvent, setTicketEvent] = useState<{ id: string; title: string } | null>(null);
  const [tableEvent, setTableEvent] = useState<{ id: string; title: string } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<MappedEvent | null>(null);
  const [importUrl, setImportUrl] = useState("");
  const [importingUrl, setImportingUrl] = useState(false);
  const { events: dbEvents, toggleRsvp, rsvpEventIds, loading } = useEvents(selectedCity.id);
  const { importEvents, importing } = useEventbriteImport();
  const { user } = useAuth();
  const { toast } = useToast();

  const cityEvents: MappedEvent[] = dbEvents.map((e) => ({
    id: e.id,
    title: e.title,
    host: sourceLabel((e as any).source) ? `via ${sourceLabel((e as any).source)}` : "Community",
    date: new Date(e.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
    rawDate: e.date,
    venue: e.location || "",
    city: e.city,
    image: e.image_url || "/placeholder.svg",
    free: e.price === "Free" || !e.price,
    price: e.price || undefined,
    category: e.category,
    source: (e as any).source || "user",
    external_url: (e as any).external_url || undefined,
    description: (e as any).description || undefined,
  }));

  const filterFn = filterMap[activeFilter] || (() => true);
  const catFilterFn = activeCategoryFilter ? (categoryFilterMap[activeCategoryFilter] || (() => true)) : () => true;

  const filteredEvents = cityEvents
    .filter(filterFn)
    .filter(catFilterFn)
    .filter(e =>
      searchQuery === "" || e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.host.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleRsvp = (event: MappedEvent) => {
    trackEvent("event_rsvp", { event_id: event.id, event_title: event.title, city: event.city });
    trackEventViewed(event.id, event.title);
    toggleRsvp.mutate(event.id);
  };

  const handleShare = async (event: MappedEvent) => {
    const text = `🎫 ${event.title} — ${event.date}${event.venue ? ` at ${event.venue}` : ""}`;
    if (navigator.share) {
      try { await navigator.share({ title: event.title, text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied!", description: "Event details copied to clipboard." });
    }
  };

  const handleImportUrl = async () => {
    if (!importUrl.trim()) return;
    setImportingUrl(true);
    try {
      const { data, error } = await supabase.functions.invoke("import-event-url", {
        body: { url: importUrl.trim(), city: selectedCity.id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: "Event imported! 🎉", description: data?.title || "The event has been added." });
      setImportUrl("");
    } catch (err: any) {
      toast({ title: "Import failed", description: err.message || "Could not import event from that URL.", variant: "destructive" });
    } finally {
      setImportingUrl(false);
    }
  };

  const handleCategorySelect = (catId: string) => {
    setActiveCategoryFilter(activeCategoryFilter === catId ? null : catId);
    setActiveFilter("All");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-display text-xl font-bold text-gradient-gold">Experiences</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => importEvents([selectedCity.id])}
                disabled={importing}
                className="p-2 rounded-full bg-secondary border border-border hover:bg-muted transition-colors"
                title="Import from platforms"
              >
                {importing ? <Loader2 size={16} className="text-primary animate-spin" /> : <Download size={16} className="text-primary" />}
              </button>
              <button onClick={() => setShowCreateEvent(true)} className="p-2 rounded-full gradient-gold">
                <Plus size={16} className="text-primary-foreground" />
              </button>
              <CityPicker selectedCity={selectedCity} onCityChange={onCityChange} />
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-2">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          {/* Paste event link */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="url"
                placeholder="Paste event link (Eventbrite, Posh...)"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleImportUrl()}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-secondary text-xs text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
            <button
              onClick={handleImportUrl}
              disabled={importingUrl || !importUrl.trim()}
              className="px-4 py-2 rounded-xl gradient-gold text-primary-foreground text-xs font-semibold disabled:opacity-50 flex items-center gap-1"
            >
              {importingUrl ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              Import
            </button>
          </div>
        </div>
      </header>

      {/* Filter chips */}
      <div className="px-4 py-3 overflow-x-auto scrollbar-hide max-w-lg mx-auto">
        <div className="flex gap-2 w-max">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => { setActiveFilter(filter); setActiveCategoryFilter(null); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === filter && !activeCategoryFilter
                  ? "gradient-gold text-primary-foreground shadow-gold"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {filter}
            </button>
          ))}
          {activeCategoryFilter && (
            <button
              onClick={() => setActiveCategoryFilter(null)}
              className="px-4 py-1.5 rounded-full text-sm font-medium gradient-gold text-primary-foreground shadow-gold flex items-center gap-1"
            >
              {activeCategoryFilter} ×
            </button>
          )}
        </div>
      </div>

      {(activeFilter !== "All" || activeCategoryFilter) && (
        <div className="px-4 pb-2 max-w-lg mx-auto">
          <p className="text-xs text-muted-foreground">{filteredEvents.length} events found</p>
        </div>
      )}

      {/* Events grid */}
      <div className="px-4 max-w-lg mx-auto">
        {loading ? (
          <div className="text-center py-16">
            <Loader2 size={32} className="text-primary mx-auto animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Calendar size={40} className="text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-sm text-muted-foreground">
              {cityEvents.length === 0
                ? "No events yet in this city. Import from a platform or create your own!"
                : "No events match this filter"}
            </p>
            {cityEvents.length > 0 && (
              <button onClick={() => { setActiveFilter("All"); setActiveCategoryFilter(null); }} className="mt-3 text-sm text-primary font-semibold">Show all events</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredEvents.map((event) => {
              const isGoing = rsvpEventIds.includes(event.id);
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  isGoing={isGoing}
                  onRsvp={() => handleRsvp(event)}
                  onGetTickets={() => setTicketEvent({ id: event.id, title: event.title })}
                  onTable={() => setTableEvent({ id: event.id, title: event.title })}
                  onShare={() => handleShare(event)}
                  sourceLabel={sourceLabel(event.source)}
                  sourceColor={sourceColor(event.source)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Category discovery banners */}
      <div className="mt-8 mb-6">
        <EventCategoryBanners onCategorySelect={handleCategorySelect} />
      </div>

      {/* Sheets */}
      {selectedEvent && (
        <EventAttendeesSheet
          event={{ id: 0, title: selectedEvent.title, host: selectedEvent.host, date: selectedEvent.date, venue: selectedEvent.venue, city: selectedEvent.city, distance: "", image: selectedEvent.image, attending: 0, free: selectedEvent.free }}
          onClose={() => setSelectedEvent(null)}
        />
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
      {tableEvent && (
        <TableBookingSheet
          eventId={tableEvent.id}
          eventTitle={tableEvent.title}
          open={!!tableEvent}
          onClose={() => setTableEvent(null)}
        />
      )}
    </div>
  );
};

export default EventsScreen;
