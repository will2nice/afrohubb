import { useState } from "react";
import { Search, MapPinned, Users, Sliders, X, Filter, BadgeCheck, Ticket, MapPin, ChevronDown, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useScreenView } from "@/hooks/useAnalytics";
import { trackEvent } from "@/lib/posthog";
import { type City, cities } from "@/data/cityData";
import MapScreen from "@/components/MapScreen";
import PlacesScreen from "@/components/PlacesScreen";
import AskForHelpScreen from "@/components/AskForHelpScreen";
import FlightsScreen from "@/components/FlightsScreen";
import CampusScreen from "@/components/CampusScreen";
import VerifiedBadge from "@/components/VerifiedBadge";
import { useDiscoverProfiles, useDiscoverEvents, type DiscoverProfile } from "@/hooks/useDiscover";
import { trackProfileViewed } from "@/lib/analytics";

type DiscoverView = "explore" | "map" | "places" | "campus" | "flights" | "help";
type DiscoverTab = "people" | "events";

const INTEREST_OPTIONS = [
  "🎵 Music", "🎨 Art & Culture", "💼 Business", "🌍 Networking",
  "🏀 Sports", "🍽️ Food & Dining", "🌙 Nightlife", "📚 Education",
  "✈️ Travel", "🎬 Film & Media", "💃 Dance", "🧘 Wellness",
  "👗 Fashion", "💻 Tech", "📸 Photography", "🎤 Comedy",
];

const EVENT_CATEGORIES = [
  "All", "Afrobeats", "Concert", "Festival", "Sports", "Networking", "Culture", "Nightlife", "Food",
];

interface DiscoverScreenProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
  onOpenDM?: () => void;
  onNavigate?: (tab: string) => void;
}

const DiscoverScreen = ({ selectedCity, onCityChange, onOpenDM }: DiscoverScreenProps) => {
  useScreenView("discover");
  const [view, setView] = useState<DiscoverView>("explore");
  const [tab, setTab] = useState<DiscoverTab>("people");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // People filters
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [ageMin, setAgeMin] = useState<number | undefined>();
  const [ageMax, setAgeMax] = useState<number | undefined>();

  // Event filters
  const [eventCategory, setEventCategory] = useState("All");
  const [freeOnly, setFreeOnly] = useState(false);

  const { data: profiles = [], isLoading: profilesLoading } = useDiscoverProfiles({
    city: selectedCity.id !== "all" ? selectedCity.id : undefined,
    interests: selectedInterests.length > 0 ? selectedInterests : undefined,
    verifiedOnly,
    ageMin,
    ageMax,
  });

  const { data: events = [], isLoading: eventsLoading } = useDiscoverEvents({
    city: selectedCity.id !== "all" ? selectedCity.id : undefined,
    category: eventCategory !== "All" ? eventCategory.toLowerCase() : undefined,
    freeOnly,
    search: searchQuery || undefined,
  });

  // Filter profiles by search
  const filteredProfiles = profiles.filter((p) =>
    !searchQuery ||
    p.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.nationality?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeFilterCount = [
    selectedInterests.length > 0,
    verifiedOnly,
    ageMin !== undefined,
    ageMax !== undefined,
    freeOnly,
    eventCategory !== "All",
  ].filter(Boolean).length;

  const toggleItems: { id: DiscoverView; label: string }[] = [
    { id: "explore", label: "Explore" },
    { id: "map", label: "Map" },
    { id: "places", label: "Places" },
    { id: "campus", label: "Campus" },
    { id: "flights", label: "Flights" },
    { id: "help", label: "Help" },
  ];

  if (view !== "explore") {
    return (
      <div className="relative min-h-screen">
        {view === "map" && <MapScreen selectedCity={selectedCity} onCityChange={onCityChange} />}
        {view === "places" && <PlacesScreen selectedCity={selectedCity} onCityChange={onCityChange} />}
        {view === "campus" && <CampusScreen />}
        {view === "flights" && <FlightsScreen selectedCity={selectedCity} onCityChange={onCityChange} />}
        {view === "help" && <AskForHelpScreen onOpenDM={onOpenDM || (() => {})} />}

        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center bg-card/95 backdrop-blur-lg border border-border rounded-full p-1 shadow-lg">
            {toggleItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { trackEvent("discover_tab_changed", { view: item.id }); setView(item.id); }}
                className={`px-3 py-2 rounded-full text-xs font-semibold transition-all ${view === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-xl font-bold text-gradient-gold">Discover</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-full relative transition-colors ${showFilters ? "bg-primary/10 text-primary" : "hover:bg-secondary text-muted-foreground"}`}
            >
              <Sliders size={20} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people, events, cities..."
              className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <X size={16} />
              </button>
            )}
          </div>

          {/* People / Events toggle */}
          <div className="flex gap-1 bg-secondary rounded-xl p-1">
            <button
              onClick={() => setTab("people")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "people" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              <Users size={14} /> People
            </button>
            <button
              onClick={() => setTab("events")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "events" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              <Ticket size={14} /> Events
            </button>
          </div>
        </div>
      </header>

      {/* Filter Panel */}
      {showFilters && (
        <div className="max-w-lg mx-auto px-4 py-3 border-b border-border bg-card/50 space-y-3">
          {tab === "people" ? (
            <>
              {/* City quick select */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">City</p>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {[{ id: "all", name: "All Cities", flag: "🌍" }, ...cities.slice(0, 15)].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => onCityChange(c as City)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                        selectedCity.id === c.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {c.flag} {c.name.split(",")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Interests</p>
                <div className="flex flex-wrap gap-1.5">
                  {INTEREST_OPTIONS.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => setSelectedInterests((prev) => prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest])}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                        selectedInterests.includes(interest) ? "bg-primary/10 border border-primary/30 text-foreground" : "bg-secondary border border-border text-muted-foreground"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age range */}
              <div className="flex items-center gap-3">
                <p className="text-xs font-medium text-muted-foreground">Age</p>
                <input
                  type="number"
                  placeholder="Min"
                  value={ageMin ?? ""}
                  onChange={(e) => setAgeMin(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-16 px-2 py-1.5 rounded-lg bg-secondary border border-border text-xs text-foreground focus:outline-none"
                />
                <span className="text-xs text-muted-foreground">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={ageMax ?? ""}
                  onChange={(e) => setAgeMax(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-16 px-2 py-1.5 rounded-lg bg-secondary border border-border text-xs text-foreground focus:outline-none"
                />
              </div>

              {/* Verified toggle */}
              <button
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  verifiedOnly ? "bg-primary/10 border border-primary/30 text-foreground" : "bg-secondary border border-border text-muted-foreground"
                }`}
              >
                <BadgeCheck size={14} /> Verified only
              </button>
            </>
          ) : (
            <>
              {/* Event category */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Category</p>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                  {EVENT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setEventCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                        eventCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Free / Paid */}
              <button
                onClick={() => setFreeOnly(!freeOnly)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  freeOnly ? "bg-primary/10 border border-primary/30 text-foreground" : "bg-secondary border border-border text-muted-foreground"
                }`}
              >
                <Ticket size={14} /> Free events only
              </button>
            </>
          )}

          {/* Clear filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setSelectedInterests([]);
                setVerifiedOnly(false);
                setAgeMin(undefined);
                setAgeMax(undefined);
                setEventCategory("All");
                setFreeOnly(false);
              }}
              className="text-xs text-destructive font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      <div className="max-w-lg mx-auto">
        {tab === "people" ? (
          /* ─── PEOPLE FEED ─── */
          <div className="px-4 py-4 space-y-3">
            {profilesLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                  <Skeleton className="w-14 h-14 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              ))
            ) : filteredProfiles.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <Users size={32} className="mx-auto text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No people found</p>
                <p className="text-xs text-muted-foreground">Try changing your filters or city</p>
              </div>
            ) : (
              filteredProfiles.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))
            )}
          </div>
        ) : (
          /* ─── EVENTS FEED ─── */
          <div className="px-4 py-4 space-y-3">
            {eventsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-card border border-border overflow-hidden">
                  <Skeleton className="w-full h-36" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            ) : events.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <Ticket size={32} className="mx-auto text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No events found</p>
                <p className="text-xs text-muted-foreground">Try different filters or check another city</p>
              </div>
            ) : (
              events.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))
            )}
          </div>
        )}
      </div>

      {/* Floating toggle pill */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center bg-card/95 backdrop-blur-lg border border-border rounded-full p-1 shadow-lg">
          {toggleItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { trackEvent("discover_tab_changed", { view: item.id }); setView(item.id); }}
              className={`px-3 py-2 rounded-full text-xs font-semibold transition-all ${view === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Person Card ─── */
const PersonCard = ({ person }: { person: DiscoverProfile }) => {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors cursor-pointer"
      onClick={() => trackProfileViewed(person.id)}
    >
      {person.avatar_url ? (
        <img src={person.avatar_url} alt={person.display_name} className="w-14 h-14 rounded-xl object-cover ring-2 ring-border" />
      ) : (
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="text-lg font-bold text-primary">{person.display_name.charAt(0)}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-foreground truncate">{person.display_name}</p>
          {person.is_verified && <VerifiedBadge size={14} />}
          {person.age && <span className="text-xs text-muted-foreground">{person.age}</span>}
        </div>
        {person.city && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <MapPin size={10} /> {person.city}
          </div>
        )}
        {person.bio && (
          <p className="text-xs text-foreground/60 mt-1 line-clamp-1">{person.bio}</p>
        )}
        {person.interests && person.interests.length > 0 && (
          <div className="flex gap-1 mt-1.5 overflow-hidden">
            {person.interests.slice(0, 3).map((i) => (
              <span key={i} className="px-1.5 py-0.5 rounded-full bg-primary/10 text-[9px] font-medium text-foreground whitespace-nowrap">
                {i}
              </span>
            ))}
            {person.interests.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-full bg-secondary text-[9px] font-medium text-muted-foreground">
                +{person.interests.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
      {person.vibe && (
        <span className="px-2 py-1 rounded-lg bg-primary/10 text-[10px] font-medium text-primary shrink-0">
          {person.vibe}
        </span>
      )}
    </div>
  );
};

/* ─── Event Card ─── */
const EventCard = ({ event }: { event: any }) => {
  const dateStr = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });

  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden hover:border-primary/20 transition-colors cursor-pointer">
      {event.image_url && (
        <div className="relative">
          <img src={event.image_url} alt={event.title} className="w-full h-36 object-cover" />
          {event.price && (
            <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              event.price === "Free" ? "bg-emerald-500/90 text-white" : "bg-card/90 text-foreground"
            }`}>
              {event.price}
            </span>
          )}
          {event.source && event.source !== "user" && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-card/90 text-[10px] font-medium text-muted-foreground capitalize">
              {event.source}
            </span>
          )}
        </div>
      )}
      <div className="p-3 space-y-1.5">
        <h3 className="text-sm font-bold text-foreground line-clamp-1">{event.title}</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin size={10} /> {event.location || event.city}</span>
          <span>{dateStr}</span>
        </div>
        {event.description && (
          <p className="text-xs text-foreground/60 line-clamp-2">{event.description}</p>
        )}
        <div className="flex items-center gap-2 pt-1">
          <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-muted-foreground capitalize">{event.category}</span>
          {event.external_url && (
            <a
              href={event.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-primary font-medium hover:underline ml-auto"
              onClick={(e) => e.stopPropagation()}
            >
              View on {event.source || "source"} →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverScreen;
