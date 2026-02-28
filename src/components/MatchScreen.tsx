import { useState } from "react";
import { X, Heart, MessageCircle, SlidersHorizontal, MapPin, Sparkles, ChevronDown, Calendar, Users } from "lucide-react";
import profileWoman1 from "@/assets/profile-woman-1.jpg";
import profileWoman2 from "@/assets/profile-woman-2.jpg";
import profileMan1 from "@/assets/profile-man-1.jpg";
import profileMan2 from "@/assets/profile-man-2.jpg";
import { events as allEvents, type City } from "@/data/cityData";

// Expanded profiles pool
const allProfiles = [
  { id: 1, name: "Amara", age: 26, bio: "Lagos → Austin. Software engineer by day, Afrobeats dancer by night.", photo: profileWoman1, interests: ["Afrobeats", "Tech", "Cooking", "Travel"], verified: true },
  { id: 2, name: "Kofi", age: 29, bio: "Ghanaian-American. Building startups and building community.", photo: profileMan1, interests: ["Soccer", "Entrepreneurship", "Music", "Fashion"], verified: true },
  { id: 3, name: "Darius", age: 27, bio: "Creative director. Film nerd. Always looking for the next adventure.", photo: profileMan2, interests: ["Film", "Photography", "Art", "Vinyl"], verified: false },
  { id: 4, name: "Nneka", age: 23, bio: "Just moved here! Looking for my people and good vibes only ✨", photo: profileWoman2, interests: ["Music", "Dance", "Food", "Culture"], verified: true },
  { id: 5, name: "Jasmine", age: 25, bio: "Fashion girlie & culture enthusiast. Let's explore together 💃", photo: profileWoman1, interests: ["Fashion", "Nightlife", "Art", "Travel"], verified: true },
  { id: 6, name: "Marcus", age: 26, bio: "Entrepreneur & culture lover. Always at the best events 🔥", photo: profileMan1, interests: ["Business", "Afrobeats", "Sports", "Tech"], verified: false },
  { id: 7, name: "Priya", age: 25, bio: "Photographer capturing diaspora magic 📸 Food is my love language.", photo: profileWoman2, interests: ["Photography", "Food", "Travel", "Music"], verified: true },
  { id: 8, name: "Tunde", age: 28, bio: "Gym bro who also loves Afrobeats. Let's work out then turn up 💪", photo: profileMan2, interests: ["Fitness", "Afrobeats", "Soccer", "Cooking"], verified: true },
  { id: 9, name: "Zara", age: 21, bio: "Just moved here! Art student who loves live music 🌟", photo: profileWoman1, interests: ["Art", "Music", "Dance", "Nightlife"], verified: false },
  { id: 10, name: "Fatou", age: 28, bio: "Tech sis by day, party girl by night. DJ on the weekends 🎧", photo: profileWoman2, interests: ["DJing", "Tech", "Nightlife", "Fashion"], verified: true },
  { id: 11, name: "Kwame", age: 30, bio: "Networking king. Let's build something together 🤝", photo: profileMan1, interests: ["Business", "Networking", "Sports", "Travel"], verified: true },
  { id: 12, name: "Chioma", age: 23, bio: "Art & Afrobeats are my personality 🎨 Let's vibe!", photo: profileWoman1, interests: ["Art", "Afrobeats", "Dance", "Culture"], verified: false },
];

const prompts = [
  { q: "A perfect weekend is…", a: "Farmer's market, jollof rice, and a rooftop sunset" },
  { q: "My culture taught me…", a: "That community is everything. Ubuntu — I am because we are." },
  { q: "Green flag I look for…", a: "Someone who can hold a conversation AND hold a rhythm 💃" },
  { q: "I'm at my best when…", a: "I'm surrounded by good music, good food, and good people" },
  { q: "My love language is…", a: "Quality time and acts of service — cook for me and I'm yours 🍲" },
  { q: "You should NOT go on a date with me if…", a: "You can't dance. Just kidding… unless? 😂" },
];

// Get 3 prompts deterministically per profile
const getPrompts = (profileId: number) => {
  const start = (profileId * 7) % prompts.length;
  return [
    prompts[start % prompts.length],
    prompts[(start + 1) % prompts.length],
    prompts[(start + 2) % prompts.length],
  ];
};

// Get profiles for an event (deterministic shuffle based on event id)
const getEventProfiles = (eventId: number) => {
  const shuffled = [...allProfiles].sort((a, b) => ((a.id * eventId * 31) % 97) - ((b.id * eventId * 31) % 97));
  return shuffled.slice(0, Math.min(8, shuffled.length));
};

interface MatchScreenProps {
  selectedCity: City;
}

type MatchFilter = { type: "city" } | { type: "event"; eventId: number; eventTitle: string };

const MatchScreen = ({ selectedCity }: MatchScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [showFilterPicker, setShowFilterPicker] = useState(false);
  const [matchFilter, setMatchFilter] = useState<MatchFilter>({ type: "city" });

  // Get city events for the filter picker
  const texasCities = ["austin", "dallas", "houston", "sanantonio"];
  const isTexas = texasCities.includes(selectedCity.id);
  const cityIds = isTexas ? texasCities : [selectedCity.id];
  const cityEvents = allEvents.filter((e) => cityIds.includes(e.city));

  // Get profiles based on filter
  const activeProfiles = matchFilter.type === "event"
    ? getEventProfiles(matchFilter.eventId)
    : allProfiles;

  const profile = activeProfiles[currentIndex % activeProfiles.length];
  const profilePrompts = getPrompts(profile.id);
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

  const handlePass = () => {
    setCurrentIndex((i) => i + 1);
  };

  const selectFilter = (filter: MatchFilter) => {
    setMatchFilter(filter);
    setCurrentIndex(0);
    setShowFilterPicker(false);
  };

  const filterLabel = matchFilter.type === "city"
    ? `🌆 ${selectedCity.name}`
    : `🎫 ${matchFilter.eventTitle}`;

  if (showMatch) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-24 animate-fade-in">
        <div className="text-center mb-8">
          <Sparkles size={48} className="text-primary mx-auto mb-4 animate-pulse-gold" />
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">It's a Match!</h2>
          <p className="text-muted-foreground">You and {profile.name} liked each other</p>
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
        <button
          onClick={() => setShowMatch(false)}
          className="w-full max-w-xs py-3 rounded-full gradient-gold text-primary-foreground font-semibold shadow-gold transition-transform hover:scale-105 active:scale-95"
        >
          Say Hi 👋
        </button>
        <button
          onClick={() => { setShowMatch(false); setCurrentIndex((i) => i + 1); }}
          className="mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
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
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <SlidersHorizontal size={20} className="text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Event/City Filter */}
      <div className="px-4 pt-3 max-w-lg mx-auto">
        <button
          onClick={() => setShowFilterPicker(!showFilterPicker)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-card border border-border shadow-card"
        >
          <div className="flex items-center gap-2">
            {matchFilter.type === "city" ? (
              <MapPin size={16} className="text-primary" />
            ) : (
              <Calendar size={16} className="text-primary" />
            )}
            <span className="text-sm font-semibold text-foreground truncate">{filterLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{activeProfiles.length} people</span>
            <ChevronDown size={16} className={`text-muted-foreground transition-transform ${showFilterPicker ? "rotate-180" : ""}`} />
          </div>
        </button>

        {/* Filter picker dropdown */}
        {showFilterPicker && (
          <div className="mt-2 bg-card border border-border rounded-2xl shadow-elevated overflow-hidden animate-slide-up max-h-80 overflow-y-auto">
            {/* City option */}
            <button
              onClick={() => selectFilter({ type: "city" })}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${matchFilter.type === "city" ? "bg-primary/10" : "hover:bg-secondary/50"}`}
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <MapPin size={18} className="text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-foreground">Everyone in {selectedCity.name}</p>
                <p className="text-[11px] text-muted-foreground">All {allProfiles.length} people near you</p>
              </div>
              {matchFilter.type === "city" && <div className="w-2 h-2 rounded-full gradient-gold" />}
            </button>

            <div className="px-4 py-2 border-t border-border">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Match by Event</p>
            </div>

            {/* Event options */}
            {cityEvents.slice(0, 15).map((event) => {
              const isSelected = matchFilter.type === "event" && matchFilter.eventId === event.id;
              const eventProfiles = getEventProfiles(event.id);
              return (
                <button
                  key={event.id}
                  onClick={() => selectFilter({ type: "event", eventId: event.id, eventTitle: event.title })}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${isSelected ? "bg-primary/10" : "hover:bg-secondary/50"}`}
                >
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

      {/* Profile Card */}
      <div className="px-4 pt-3 max-w-lg mx-auto">
        <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-elevated animate-slide-up">
          {/* Photo */}
          <div className="relative">
            <img src={profile.photo} alt={profile.name} className="w-full aspect-[3/4] object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent p-5 pt-20">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {profile.name}, {profile.age}
                </h2>
                {profile.verified && (
                  <div className="w-5 h-5 rounded-full gradient-gold flex items-center justify-center">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="hsl(0,0%,5%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={14} className="text-primary" />
                <span className="text-sm text-muted-foreground">{profileCity}</span>
              </div>
              <p className="text-sm text-foreground/80 mt-2">{profile.bio}</p>
            </div>
          </div>

          {/* Interests */}
          <div className="px-5 py-4 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span key={interest} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Prompts */}
          <div className="px-5 pb-5 space-y-3">
            {profilePrompts.map((prompt, i) => (
              <div key={i} className="bg-muted rounded-xl p-4">
                <p className="text-xs font-semibold text-primary mb-1">{prompt.q}</p>
                <p className="text-sm text-foreground leading-relaxed">{prompt.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-6 py-6">
          <button
            onClick={handlePass}
            className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center shadow-card transition-transform hover:scale-110 active:scale-90"
          >
            <X size={28} className="text-muted-foreground" />
          </button>
          <button
            onClick={handleLike}
            className="w-20 h-20 rounded-full gradient-gold flex items-center justify-center shadow-gold animate-pulse-gold transition-transform hover:scale-110 active:scale-90"
          >
            <Heart size={32} className="text-primary-foreground" fill="currentColor" />
          </button>
          <button className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center shadow-card transition-transform hover:scale-110 active:scale-90">
            <MessageCircle size={28} className="text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchScreen;
