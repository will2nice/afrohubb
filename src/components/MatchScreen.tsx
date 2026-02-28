import { useState, useMemo } from "react";
import { X, Heart, MessageCircle, SlidersHorizontal, MapPin, Sparkles, ChevronDown, Calendar, Users, LayoutGrid, Square, Globe, BookOpen, Church, Flag, Check } from "lucide-react";
import profileMan1 from "@/assets/profile-man-1.jpg";
import { matchProfiles, getPrompts, getEventProfiles, allLanguages, allReligions, allCountries, allTribes } from "@/data/matchProfiles";
import { events as allEvents, type City } from "@/data/cityData";

interface MatchScreenProps {
  selectedCity: City;
}

type MatchFilter = { type: "city" } | { type: "event"; eventId: number; eventTitle: string };
type ViewMode = "single" | "grid";

interface ProfileFilters {
  languages: string[];
  religions: string[];
  countries: string[];
  tribes: string[];
}

const emptyFilters: ProfileFilters = { languages: [], religions: [], countries: [], tribes: [] };

const MatchScreen = ({ selectedCity }: MatchScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [showFilterPicker, setShowFilterPicker] = useState(false);
  const [showProfileFilters, setShowProfileFilters] = useState(false);
  const [matchFilter, setMatchFilter] = useState<MatchFilter>({ type: "city" });
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [selectedGridProfile, setSelectedGridProfile] = useState<number | null>(null);
  const [profileFilters, setProfileFilters] = useState<ProfileFilters>(emptyFilters);
  const [activeFilterTab, setActiveFilterTab] = useState<keyof ProfileFilters>("languages");

  const texasCities = ["austin", "dallas", "houston", "sanantonio"];
  const isTexas = texasCities.includes(selectedCity.id);
  const cityIds = isTexas ? texasCities : [selectedCity.id];
  const cityEvents = allEvents.filter((e) => cityIds.includes(e.city));

  const baseProfiles = matchFilter.type === "event"
    ? getEventProfiles(matchFilter.eventId)
    : matchProfiles;

  // Apply profile filters
  const activeProfiles = useMemo(() => {
    return baseProfiles.filter((p) => {
      if (profileFilters.languages.length > 0 && !p.languages.some(l => profileFilters.languages.includes(l))) return false;
      if (profileFilters.religions.length > 0 && !profileFilters.religions.includes(p.religion)) return false;
      if (profileFilters.countries.length > 0 && !profileFilters.countries.includes(p.country)) return false;
      if (profileFilters.tribes.length > 0 && !profileFilters.tribes.includes(p.tribe)) return false;
      return true;
    });
  }, [baseProfiles, profileFilters]);

  const activeFilterCount = profileFilters.languages.length + profileFilters.religions.length + profileFilters.countries.length + profileFilters.tribes.length;

  const profile = activeProfiles[currentIndex % Math.max(activeProfiles.length, 1)];
  const profilePrompts = profile ? getPrompts(profile.id) : [];
  const profileCity = matchFilter.type === "event"
    ? cityEvents.find(e => e.id === matchFilter.eventId)?.venue || selectedCity.name
    : selectedCity.name;

  const handleLike = () => {
    if (currentIndex === 0) {
      setShowMatch(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePass = () => setCurrentIndex((i) => i + 1);

  const selectFilter = (filter: MatchFilter) => {
    setMatchFilter(filter);
    setCurrentIndex(0);
    setShowFilterPicker(false);
  };

  const toggleFilterOption = (category: keyof ProfileFilters, value: string) => {
    setProfileFilters(prev => {
      const arr = prev[category];
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      return { ...prev, [category]: next };
    });
    setCurrentIndex(0);
  };

  const clearAllFilters = () => {
    setProfileFilters(emptyFilters);
    setCurrentIndex(0);
  };

  const filterLabel = matchFilter.type === "city"
    ? `🌆 ${selectedCity.name}`
    : `🎫 ${matchFilter.eventTitle}`;

  const gridProfiles = Array.from({ length: Math.min(6, activeProfiles.length) }, (_, i) =>
    activeProfiles[(currentIndex + i) % activeProfiles.length]
  );

  const handleGridSelect = (profileId: number) => {
    setSelectedGridProfile(profileId);
    const idx = activeProfiles.findIndex(p => p.id === profileId);
    if (idx >= 0) setCurrentIndex(idx);
    setViewMode("single");
  };

  const filterTabs: { key: keyof ProfileFilters; label: string; icon: React.ReactNode; options: string[] }[] = [
    { key: "languages", label: "Language", icon: <Globe size={16} />, options: allLanguages },
    { key: "religions", label: "Religion", icon: <Church size={16} />, options: allReligions },
    { key: "countries", label: "Country", icon: <Flag size={16} />, options: allCountries },
    { key: "tribes", label: "Tribe", icon: <BookOpen size={16} />, options: allTribes },
  ];

  // ─── Filter Sheet ───
  if (showProfileFilters) {
    return (
      <div className="min-h-screen pb-24 animate-fade-in">
        <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <button onClick={() => setShowProfileFilters(false)} className="p-2 rounded-full hover:bg-secondary transition-colors">
              <X size={20} className="text-foreground" />
            </button>
            <h1 className="font-display text-lg font-bold text-foreground">Filters</h1>
            <button onClick={clearAllFilters} className="text-sm text-primary font-semibold">
              Clear All
            </button>
          </div>
        </header>

        {/* Tab bar */}
        <div className="px-4 pt-3 max-w-lg mx-auto">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {filterTabs.map((tab) => {
              const count = profileFilters[tab.key].length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilterTab(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    activeFilterTab === tab.key
                      ? "gradient-gold text-primary-foreground"
                      : "bg-card text-muted-foreground border border-border"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {count > 0 && (
                    <span className={`ml-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      activeFilterTab === tab.key ? "bg-background/30 text-primary-foreground" : "bg-primary text-primary-foreground"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter options */}
        <div className="px-4 pt-2 max-w-lg mx-auto">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="max-h-[55vh] overflow-y-auto">
              {filterTabs.find(t => t.key === activeFilterTab)?.options.map((option) => {
                const isSelected = profileFilters[activeFilterTab].includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => toggleFilterOption(activeFilterTab, option)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 transition-colors border-b border-border/50 last:border-b-0 ${
                      isSelected ? "bg-primary/10" : "hover:bg-secondary/50"
                    }`}
                  >
                    <span className="text-sm font-medium text-foreground">{option}</span>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full gradient-gold flex items-center justify-center">
                        <Check size={14} className="text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Apply button */}
        <div className="px-4 pt-4 max-w-lg mx-auto">
          <button
            onClick={() => setShowProfileFilters(false)}
            className="w-full py-4 rounded-2xl gradient-gold text-primary-foreground font-semibold text-base shadow-gold transition-transform hover:scale-[1.02] active:scale-95"
          >
            Show {activeProfiles.length} {activeProfiles.length === 1 ? "Person" : "People"}
          </button>
        </div>
      </div>
    );
  }

  // ─── Match screen ───
  if (showMatch && profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-24 animate-fade-in">
        <div className="text-center mb-8">
          <Sparkles size={48} className="text-primary mx-auto mb-4 animate-pulse-gold" />
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">It's a Match!</h2>
          <p className="text-muted-foreground">You and {profile.name} liked each other</p>
          <p className="text-xs text-muted-foreground mt-1">{profile.flag} {profile.country}</p>
          {matchFilter.type === "event" && (
            <p className="text-xs text-primary mt-1">🎫 Both going to {matchFilter.eventTitle}</p>
          )}
        </div>
        <div className="flex items-center gap-4 mb-8">
          <img src={profileMan1} alt="" className="w-24 h-24 rounded-full object-cover ring-4 ring-primary shadow-gold" />
          <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center">
            <Heart size={16} className="text-primary-foreground" fill="currentColor" />
          </div>
          <img src={profile.photo} alt="" className="w-24 h-24 rounded-full object-cover ring-4 ring-primary shadow-gold" />
        </div>
        <button onClick={() => setShowMatch(false)} className="w-full max-w-xs py-3 rounded-full gradient-gold text-primary-foreground font-semibold shadow-gold transition-transform hover:scale-105 active:scale-95">
          Say Hi 👋
        </button>
        <button onClick={() => { setShowMatch(false); setCurrentIndex((i) => i + 1); }} className="mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Keep swiping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <h1 className="font-display text-xl font-bold text-gradient-gold">Discover</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === "single" ? "grid" : "single")}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              {viewMode === "single" ? (
                <LayoutGrid size={20} className="text-muted-foreground" />
              ) : (
                <Square size={20} className="text-muted-foreground" />
              )}
            </button>
            <button
              onClick={() => setShowProfileFilters(true)}
              className="p-2 rounded-full hover:bg-secondary transition-colors relative"
            >
              <SlidersHorizontal size={20} className="text-muted-foreground" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full gradient-gold flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="px-4 pt-2 max-w-lg mx-auto">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
            {Object.entries(profileFilters).flatMap(([key, values]) =>
              values.map((v: string) => (
                <button
                  key={`${key}-${v}`}
                  onClick={() => toggleFilterOption(key as keyof ProfileFilters, v)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-xs font-medium text-foreground whitespace-nowrap"
                >
                  {v}
                  <X size={12} className="text-muted-foreground" />
                </button>
              ))
            )}
            <button onClick={clearAllFilters} className="px-2.5 py-1 rounded-full text-xs font-medium text-primary whitespace-nowrap">
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="px-4 pt-3 max-w-lg mx-auto">
        <button
          onClick={() => setShowFilterPicker(!showFilterPicker)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-card border border-border shadow-card"
        >
          <div className="flex items-center gap-2">
            {matchFilter.type === "city" ? <MapPin size={16} className="text-primary" /> : <Calendar size={16} className="text-primary" />}
            <span className="text-sm font-semibold text-foreground truncate">{filterLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{activeProfiles.length} people</span>
            <ChevronDown size={16} className={`text-muted-foreground transition-transform ${showFilterPicker ? "rotate-180" : ""}`} />
          </div>
        </button>

        {showFilterPicker && (
          <div className="mt-2 bg-card border border-border rounded-2xl shadow-elevated overflow-hidden animate-slide-up max-h-80 overflow-y-auto">
            <button onClick={() => selectFilter({ type: "city" })} className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${matchFilter.type === "city" ? "bg-primary/10" : "hover:bg-secondary/50"}`}>
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <MapPin size={18} className="text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-foreground">Everyone in {selectedCity.name}</p>
                <p className="text-[11px] text-muted-foreground">All {matchProfiles.length} people near you</p>
              </div>
              {matchFilter.type === "city" && <div className="w-2 h-2 rounded-full gradient-gold" />}
            </button>
            <div className="px-4 py-2 border-t border-border">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Match by Event</p>
            </div>
            {cityEvents.slice(0, 15).map((event) => {
              const isSelected = matchFilter.type === "event" && matchFilter.eventId === event.id;
              const eventProfiles = getEventProfiles(event.id);
              return (
                <button key={event.id} onClick={() => selectFilter({ type: "event", eventId: event.id, eventTitle: event.title })} className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${isSelected ? "bg-primary/10" : "hover:bg-secondary/50"}`}>
                  <img src={event.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{event.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground truncate">{event.date.split("·")[0]}</span>
                      <span className="text-[11px] text-primary font-medium flex items-center gap-0.5">
                        <Users size={10} /> {eventProfiles.length} on app
                      </span>
                    </div>
                  </div>
                  {isSelected && <div className="w-2 h-2 rounded-full gradient-gold" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Event context banner */}
      {matchFilter.type === "event" && (
        <div className="px-4 pt-2 max-w-lg mx-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20">
            <Calendar size={14} className="text-primary" />
            <span className="text-xs text-foreground font-medium truncate">Showing people going to {matchFilter.eventTitle}</span>
          </div>
        </div>
      )}

      {/* No results */}
      {activeProfiles.length === 0 ? (
        <div className="px-4 pt-16 max-w-lg mx-auto text-center">
          <SlidersHorizontal size={48} className="text-muted-foreground mx-auto mb-4 opacity-40" />
          <h3 className="font-display text-lg font-bold text-foreground mb-2">No matches found</h3>
          <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters to see more people</p>
          <button onClick={clearAllFilters} className="px-6 py-3 rounded-full gradient-gold text-primary-foreground font-semibold shadow-gold">
            Clear Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* ─── GRID VIEW ─── */
        <div className="px-4 pt-3 max-w-lg mx-auto">
          <div className="grid grid-cols-2 gap-3">
            {gridProfiles.map((p) => (
              <button
                key={p.id}
                onClick={() => handleGridSelect(p.id)}
                className="bg-card rounded-2xl border border-border overflow-hidden shadow-card text-left transition-transform hover:scale-[1.02] active:scale-95 animate-fade-in"
              >
                <div className="relative">
                  <img src={p.photo} alt={p.name} className="w-full aspect-[3/4] object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent p-3 pt-10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{p.flag}</span>
                      <h3 className="font-display text-sm font-bold text-foreground">{p.name}, {p.age}</h3>
                      {p.verified && (
                        <div className="w-4 h-4 rounded-full gradient-gold flex items-center justify-center flex-shrink-0">
                          <svg width="8" height="6" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="hsl(0,0%,5%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{p.country}</p>
                  </div>
                </div>
                <div className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {p.interests.slice(0, 2).map((interest) => (
                      <span key={interest} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium">{interest}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-center py-6">
            <button
              onClick={() => setCurrentIndex((i) => i + 6)}
              className="px-6 py-3 rounded-full gradient-gold text-primary-foreground font-semibold shadow-gold transition-transform hover:scale-105 active:scale-95"
            >
              Show More
            </button>
          </div>
        </div>
      ) : profile ? (
        /* ─── SINGLE CARD VIEW ─── */
        <div className="px-4 pt-3 max-w-lg mx-auto">
          <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-elevated animate-slide-up">
            <div className="relative">
              <img src={profile.photo} alt={profile.name} className="w-full aspect-[3/4] object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent p-5 pt-20">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{profile.flag}</span>
                  <h2 className="font-display text-2xl font-bold text-foreground">{profile.name}, {profile.age}</h2>
                  {profile.verified && (
                    <div className="w-5 h-5 rounded-full gradient-gold flex items-center justify-center">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="hsl(0,0%,5%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin size={14} className="text-primary" />
                  <span className="text-sm text-muted-foreground">{profileCity}</span>
                  <span className="text-sm text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">{profile.country}</span>
                </div>
                <p className="text-sm text-foreground/80 mt-2">{profile.bio}</p>
              </div>
            </div>

            {/* Profile details: language, religion, tribe */}
            <div className="px-5 py-3 border-t border-border flex flex-wrap gap-2">
              {profile.languages.map((lang) => (
                <span key={lang} className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-foreground flex items-center gap-1">
                  <Globe size={10} className="text-primary" /> {lang}
                </span>
              ))}
              <span className="px-2.5 py-1 rounded-full bg-secondary border border-border text-xs font-medium text-foreground flex items-center gap-1">
                <Church size={10} className="text-muted-foreground" /> {profile.religion}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-secondary border border-border text-xs font-medium text-foreground flex items-center gap-1">
                <BookOpen size={10} className="text-muted-foreground" /> {profile.tribe}
              </span>
            </div>

            <div className="px-5 py-4 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span key={interest} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">{interest}</span>
                ))}
              </div>
            </div>

            <div className="px-5 pb-5 space-y-3">
              {profilePrompts.map((prompt, i) => (
                <div key={i} className="bg-muted rounded-xl p-4">
                  <p className="text-xs font-semibold text-primary mb-1">{prompt.q}</p>
                  <p className="text-sm text-foreground leading-relaxed">{prompt.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 py-6">
            <button onClick={handlePass} className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center shadow-card transition-transform hover:scale-110 active:scale-90">
              <X size={28} className="text-muted-foreground" />
            </button>
            <button onClick={handleLike} className="w-20 h-20 rounded-full gradient-gold flex items-center justify-center shadow-gold animate-pulse-gold transition-transform hover:scale-110 active:scale-90">
              <Heart size={32} className="text-primary-foreground" fill="currentColor" />
            </button>
            <button className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center shadow-card transition-transform hover:scale-110 active:scale-90">
              <MessageCircle size={28} className="text-primary" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MatchScreen;
