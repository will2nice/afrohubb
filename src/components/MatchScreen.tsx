import { useState } from "react";
import { X, Heart, MessageCircle, SlidersHorizontal, MapPin, Sparkles } from "lucide-react";
import profileWoman1 from "@/assets/profile-woman-1.jpg";
import profileMan1 from "@/assets/profile-man-1.jpg";
import profileMan2 from "@/assets/profile-man-2.jpg";

const profiles = [
  {
    id: 1,
    name: "Amara",
    age: 26,
    city: "Austin, TX",
    bio: "Lagos → Austin. Software engineer by day, Afrobeats dancer by night.",
    photo: profileWoman1,
    prompts: [
      { q: "A perfect weekend is…", a: "Farmer's market, jollof rice, and a rooftop sunset" },
      { q: "My culture taught me…", a: "That community is everything. Ubuntu — I am because we are." },
      { q: "Green flag I look for…", a: "Someone who can hold a conversation AND hold a rhythm 💃" },
    ],
    interests: ["Afrobeats", "Tech", "Cooking", "Travel"],
    verified: true,
  },
  {
    id: 2,
    name: "Kofi",
    age: 29,
    city: "Houston, TX",
    bio: "Ghanaian-American. Building startups and building community.",
    photo: profileMan1,
    prompts: [
      { q: "A perfect weekend is…", a: "Soccer in the park, then trying a new West African spot" },
      { q: "My culture taught me…", a: "Respect your elders, feed your friends, dance like nobody's watching" },
      { q: "Green flag I look for…", a: "Curiosity about the world and a genuine heart" },
    ],
    interests: ["Soccer", "Entrepreneurship", "Music", "Fashion"],
    verified: true,
  },
  {
    id: 3,
    name: "Darius",
    age: 27,
    city: "Dallas, TX",
    bio: "Creative director. Film nerd. Always looking for the next adventure.",
    photo: profileMan2,
    prompts: [
      { q: "A perfect weekend is…", a: "Film marathon, vinyl shopping, late-night taco run" },
      { q: "My culture taught me…", a: "Storytelling is how we keep our ancestors alive" },
      { q: "Green flag I look for…", a: "Someone who's passionate about something—anything" },
    ],
    interests: ["Film", "Photography", "Art", "Vinyl"],
    verified: false,
  },
];

const MatchScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);

  const profile = profiles[currentIndex % profiles.length];

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

  if (showMatch) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-24 animate-fade-in">
        <div className="text-center mb-8">
          <Sparkles size={48} className="text-primary mx-auto mb-4 animate-pulse-gold" />
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">It's a Match!</h2>
          <p className="text-muted-foreground">You and Amara liked each other</p>
        </div>
        <div className="flex items-center gap-4 mb-8">
          <img src={profileMan1} alt="" className="w-24 h-24 rounded-full object-cover ring-4 ring-primary shadow-gold" />
          <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center">
            <Heart size={16} className="text-primary-foreground" fill="currentColor" />
          </div>
          <img src={profileWoman1} alt="" className="w-24 h-24 rounded-full object-cover ring-4 ring-primary shadow-gold" />
        </div>
        <button
          onClick={() => setShowMatch(false)}
          className="w-full max-w-xs py-3 rounded-full gradient-gold text-primary-foreground font-semibold shadow-gold transition-transform hover:scale-105 active:scale-95"
        >
          Say Hi 👋
        </button>
        <button
          onClick={() => {
            setShowMatch(false);
            setCurrentIndex((i) => i + 1);
          }}
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

      {/* Profile Card */}
      <div className="px-4 pt-4 max-w-lg mx-auto">
        <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-elevated animate-slide-up">
          {/* Photo */}
          <div className="relative">
            <img
              src={profile.photo}
              alt={profile.name}
              className="w-full aspect-[3/4] object-cover"
            />
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
                <span className="text-sm text-muted-foreground">{profile.city}</span>
              </div>
              <p className="text-sm text-foreground/80 mt-2">{profile.bio}</p>
            </div>
          </div>

          {/* Interests */}
          <div className="px-5 py-4 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Prompts */}
          <div className="px-5 pb-5 space-y-3">
            {profile.prompts.map((prompt, i) => (
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
