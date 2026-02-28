import { useState, useMemo } from "react";
import { X, Heart, MessageCircle, SlidersHorizontal, MapPin, Sparkles, ChevronDown, Calendar, Users, LayoutGrid, Square, Globe, BookOpen, Church, Flag, Check, HeartHandshake, Send, ArrowLeft } from "lucide-react";
import profileMan1 from "@/assets/profile-man-1.jpg";
import profileMan2 from "@/assets/profile-man-2.jpg";
import { matchProfiles, getPrompts, getEventProfiles, allLanguages, allReligions, allCountriesWithFlags, countryFlagMap, type MatchProfile } from "@/data/matchProfiles";
import { events as allEvents, type City } from "@/data/cityData";

interface MatchScreenProps {
  selectedCity: City;
}

type MatchFilter = { type: "city" } | { type: "event"; eventId: number; eventTitle: string };
type ViewMode = "single" | "grid";
type DiscoverTab = "singles" | "doubleDate";

interface ProfileFilters {
  languages: string[];
  religions: string[];
  countries: string[];
}

const emptyFilters: ProfileFilters = { languages: [], religions: [], countries: [] };

// Generate double date pairs from female profiles
const generateDoubleDatePairs = (profiles: MatchProfile[]) => {
  const femaleProfiles = profiles.filter(p => p.gender === "female");
  const pairs: { id: number; profile1: MatchProfile; profile2: MatchProfile; tagline: string }[] = [];
  const taglines = [
    "Looking for a fun double date night out! 🎉",
    "Besties who brunch — let's make it a double 🥂",
    "Two friends, double the fun 💃💃",
    "We're a package deal for the right duo 😜",
    "Double date = double the vibes ✨",
    "Best friends looking for best friends 🤞🏾",
    "Dinner for four? We're in! 🍽️",
    "Adventure buddies seeking adventure buddies 🌍",
  ];
  for (let i = 0; i + 1 < femaleProfiles.length; i += 2) {
    pairs.push({
      id: i / 2 + 1,
      profile1: femaleProfiles[i],
      profile2: femaleProfiles[i + 1],
      tagline: taglines[Math.floor(i / 2) % taglines.length],
    });
  }
  return pairs;
};

const MatchScreen = ({ selectedCity }: MatchScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [showFilterPicker, setShowFilterPicker] = useState(false);
  const [showProfileFilters, setShowProfileFilters] = useState(false);
  const [matchFilter, setMatchFilter] = useState<MatchFilter>({ type: "city" });
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [selectedGridProfile, setSelectedGridProfile] = useState<number | null>(null);
  const [profileFilters, setProfileFilters] = useState<ProfileFilters>(emptyFilters);
  const [activeFilterTab, setActiveFilterTab] = useState<keyof ProfileFilters>("countries");
  const [discoverTab, setDiscoverTab] = useState<DiscoverTab>("singles");
  const [doubleDateIndex, setDoubleDateIndex] = useState(0);
  const [doubleDateViewMode, setDoubleDateViewMode] = useState<ViewMode>("single");
  const [showRecommend, setShowRecommend] = useState(false);
  const [recommendedProfile, setRecommendedProfile] = useState<MatchProfile | null>(null);
  const [recommendSent, setRecommendSent] = useState(false);

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
      return true;
    });
  }, [baseProfiles, profileFilters]);

  const activeFilterCount = profileFilters.languages.length + profileFilters.religions.length + profileFilters.countries.length;

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

  const doubleDatePairs = useMemo(() => generateDoubleDatePairs(activeProfiles), [activeProfiles]);
  const currentPair = doubleDatePairs[doubleDateIndex % Math.max(doubleDatePairs.length, 1)];
  const gridDoubleDatePairs = Array.from({ length: Math.min(6, doubleDatePairs.length) }, (_, i) =>
    doubleDatePairs[(doubleDateIndex + i) % doubleDatePairs.length]
  );

  const handleDoubleDateLike = () => {
    setDoubleDateIndex((i) => i + 1);
  };
  const handleDoubleDatePass = () => {
    setDoubleDateIndex((i) => i + 1);
  };

  const friendsList = [
    { id: 1, name: "Marcus", photo: profileMan1 },
    { id: 2, name: "Kwame", photo: profileMan2 },
  ];

  const handleRecommend = (profile: MatchProfile) => {
    setRecommendedProfile(profile);
    setShowRecommend(true);
    setRecommendSent(false);
  };

  const sendRecommendation = (friendName: string) => {
    setRecommendSent(true);
    setTimeout(() => {
      setShowRecommend(false);
      setRecommendedProfile(null);
    }, 1500);
  };

  const filterTabs: { key: keyof ProfileFilters; label: string; icon: React.ReactNode; options: string[] }[] = [
    { key: "countries", label: "Country", icon: <Flag size={16} />, options: allCountriesWithFlags.map(c => c.slice(c.indexOf(' ') + 1)) },
    { key: "languages", label: "Language", icon: <Globe size={16} />, options: allLanguages },
    { key: "religions", label: "Religion", icon: <Church size={16} />, options: allReligions },
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
                    <span className="text-sm font-medium text-foreground">
                      {activeFilterTab === "countries" && countryFlagMap[option] ? `${countryFlagMap[option]} ` : ""}{option}
                    </span>
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
              onClick={() => {
                if (discoverTab === "doubleDate") {
                  setDoubleDateViewMode(doubleDateViewMode === "single" ? "grid" : "single");
                } else {
                  setViewMode(viewMode === "single" ? "grid" : "single");
                }
              }}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              {(discoverTab === "singles" ? viewMode : doubleDateViewMode) === "single" ? (
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

      {/* Singles / Double Date tab switcher */}
      <div className="px-4 pt-3 max-w-lg mx-auto">
        <div className="bg-card border border-border rounded-2xl p-1 flex gap-1">
          <button
            onClick={() => setDiscoverTab("singles")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              discoverTab === "singles"
                ? "gradient-gold text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:bg-secondary/50"
            }`}
          >
            <Heart size={16} />
            Singles
          </button>
          <button
            onClick={() => setDiscoverTab("doubleDate")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              discoverTab === "doubleDate"
                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                : "text-muted-foreground hover:bg-secondary/50"
            }`}
          >
            <HeartHandshake size={16} />
            Double Date
          </button>
        </div>
      </div>

      {/* ─── RECOMMEND SHEET ─── */}
      {showRecommend && recommendedProfile && (
        <>
          <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50" onClick={() => setShowRecommend(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
            <div className="max-w-lg mx-auto">
              <div className="bg-card border border-border rounded-t-3xl shadow-elevated p-5">
                {recommendSent ? (
                  <div className="text-center py-8">
                    <Send size={40} className="text-primary mx-auto mb-3" />
                    <h3 className="font-display text-lg font-bold text-foreground">Recommendation Sent!</h3>
                    <p className="text-sm text-muted-foreground mt-1">Your friend will check out {recommendedProfile.name}'s profile</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-lg font-bold text-foreground">Recommend {recommendedProfile.name}</h3>
                      <button onClick={() => setShowRecommend(false)} className="p-1.5 rounded-full hover:bg-secondary">
                        <X size={18} className="text-muted-foreground" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Send {recommendedProfile.name}'s profile to a friend you think would be a good match</p>
                    <div className="flex items-center gap-3 mb-5 p-3 bg-muted rounded-xl">
                      <img src={recommendedProfile.photo} alt="" className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{recommendedProfile.flag} {recommendedProfile.name}, {recommendedProfile.age}</p>
                        <p className="text-xs text-muted-foreground">{recommendedProfile.country}</p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Send to</p>
                    <div className="space-y-2">
                      {friendsList.map((friend) => (
                        <button
                          key={friend.id}
                          onClick={() => sendRecommendation(friend.name)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                        >
                          <img src={friend.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                          <span className="flex-1 text-left text-sm font-semibold text-foreground">{friend.name}</span>
                          <Send size={16} className="text-primary" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── DOUBLE DATE TAB ─── */}
      {discoverTab === "doubleDate" ? (
        <div className="px-4 pt-3 max-w-lg mx-auto">
          {doubleDatePairs.length === 0 ? (
            <div className="text-center pt-16">
              <HeartHandshake size={48} className="text-muted-foreground mx-auto mb-4 opacity-40" />
              <h3 className="font-display text-lg font-bold text-foreground mb-2">No double date pairs</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : doubleDateViewMode === "grid" ? (
            /* ─── DOUBLE DATE GRID VIEW ─── */
            <>
              <div className="grid grid-cols-2 gap-3">
                {gridDoubleDatePairs.map((pair) => (
                  <button
                    key={pair.id}
                    onClick={() => {
                      const idx = doubleDatePairs.findIndex(p => p.id === pair.id);
                      if (idx >= 0) setDoubleDateIndex(idx);
                      setDoubleDateViewMode("single");
                    }}
                    className="bg-card rounded-2xl border border-border overflow-hidden shadow-card text-left transition-transform hover:scale-[1.02] active:scale-95 animate-fade-in"
                  >
                    <div className="flex">
                      <div className="flex-1 relative">
                        <img src={pair.profile1.photo} alt={pair.profile1.name} className="w-full aspect-[3/4] object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-transparent p-1.5 pt-6">
                          <p className="font-display text-[10px] font-bold text-foreground truncate">{pair.profile1.flag} {pair.profile1.name}</p>
                        </div>
                      </div>
                      <div className="w-px bg-border" />
                      <div className="flex-1 relative">
                        <img src={pair.profile2.photo} alt={pair.profile2.name} className="w-full aspect-[3/4] object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-transparent p-1.5 pt-6">
                          <p className="font-display text-[10px] font-bold text-foreground truncate">{pair.profile2.flag} {pair.profile2.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-2 py-2">
                      <p className="text-[10px] text-muted-foreground truncate">{pair.tagline}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-center py-6">
                <button
                  onClick={() => setDoubleDateIndex((i) => i + 6)}
                  className="px-6 py-3 rounded-full gradient-gold text-primary-foreground font-semibold shadow-gold transition-transform hover:scale-105 active:scale-95"
                >
                  Show More Pairs
                </button>
              </div>
            </>
          ) : currentPair ? (
            /* ─── DOUBLE DATE SINGLE CARD VIEW ─── */
            <>
              <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-elevated animate-slide-up">
                <div className="px-5 py-3 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-b border-border">
                  <div className="flex items-center gap-2">
                    <HeartHandshake size={16} className="text-pink-500" />
                    <p className="text-sm font-semibold text-foreground">{currentPair.tagline}</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-1 relative">
                    <img src={currentPair.profile1.photo} alt={currentPair.profile1.name} className="w-full aspect-[3/4] object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent p-3 pt-12">
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{currentPair.profile1.flag}</span>
                        <h3 className="font-display text-sm font-bold text-foreground">{currentPair.profile1.name}, {currentPair.profile1.age}</h3>
                        {currentPair.profile1.verified && (
                          <div className="w-4 h-4 rounded-full gradient-gold flex items-center justify-center">
                            <svg width="7" height="5" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="hsl(0,0%,5%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{currentPair.profile1.country}</p>
                    </div>
                  </div>
                  <div className="w-0.5 bg-border" />
                  <div className="flex-1 relative">
                    <img src={currentPair.profile2.photo} alt={currentPair.profile2.name} className="w-full aspect-[3/4] object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent p-3 pt-12">
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{currentPair.profile2.flag}</span>
                        <h3 className="font-display text-sm font-bold text-foreground">{currentPair.profile2.name}, {currentPair.profile2.age}</h3>
                        {currentPair.profile2.verified && (
                          <div className="w-4 h-4 rounded-full gradient-gold flex items-center justify-center">
                            <svg width="7" height="5" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="hsl(0,0%,5%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{currentPair.profile2.country}</p>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-3 border-t border-border">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Their interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[...new Set([...currentPair.profile1.interests.slice(0, 3), ...currentPair.profile2.interests.slice(0, 3)])].map((interest) => (
                      <span key={interest} className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-[11px] font-medium">{interest}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 py-6">
                <button onClick={handleDoubleDatePass} className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center shadow-card transition-transform hover:scale-110 active:scale-90">
                  <X size={28} className="text-muted-foreground" />
                </button>
                <button onClick={handleDoubleDateLike} className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-90">
                  <HeartHandshake size={32} className="text-accent-foreground" />
                </button>
                <button className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center shadow-card transition-transform hover:scale-110 active:scale-90">
                  <MessageCircle size={28} className="text-primary" />
                </button>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                {doubleDatePairs.length - (doubleDateIndex % doubleDatePairs.length) - 1} more pairs to discover
              </p>
            </>
          ) : null}
        </div>
      ) : (
        /* ─── SINGLES TAB (existing content) ─── */
        <>
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
              <div className="grid grid-cols-3 gap-3">
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

                {/* Profile details: language, religion */}
                <div className="px-5 py-3 border-t border-border flex flex-wrap gap-2">
                  {profile.languages.map((lang) => (
                    <span key={lang} className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-foreground flex items-center gap-1">
                      <Globe size={10} className="text-primary" /> {lang}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 rounded-full bg-secondary border border-border text-xs font-medium text-foreground flex items-center gap-1">
                    <Church size={10} className="text-muted-foreground" /> {profile.religion}
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

              <div className="flex items-center justify-center gap-4 py-6">
                <button onClick={handlePass} className="w-14 h-14 rounded-full bg-secondary border border-border flex items-center justify-center shadow-card transition-transform hover:scale-110 active:scale-90">
                  <X size={24} className="text-muted-foreground" />
                </button>
                <button onClick={() => handleRecommend(profile)} className="w-14 h-14 rounded-full bg-secondary border border-border flex items-center justify-center shadow-card transition-transform hover:scale-110 active:scale-90">
                  <Send size={22} className="text-blue-500" />
                </button>
                <button onClick={handleLike} className="w-20 h-20 rounded-full gradient-gold flex items-center justify-center shadow-gold animate-pulse-gold transition-transform hover:scale-110 active:scale-90">
                  <Heart size={32} className="text-primary-foreground" fill="currentColor" />
                </button>
                <button className="w-14 h-14 rounded-full bg-secondary border border-border flex items-center justify-center shadow-card transition-transform hover:scale-110 active:scale-90">
                  <MessageCircle size={22} className="text-primary" />
                </button>
              </div>

              {/* Recommend hint */}
              <p className="text-center text-[11px] text-muted-foreground -mt-3 mb-4">
                Tap <Send size={10} className="inline text-blue-500" /> to recommend to a friend
              </p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default MatchScreen;
