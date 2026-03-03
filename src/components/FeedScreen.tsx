import { useState } from "react";
import { Search, Bell, Heart, MessageCircle, Share2, Bookmark, Users } from "lucide-react";
import { feedPosts, type City } from "@/data/cityData";
import CityPicker from "@/components/CityPicker";
import FeedReelsCarousel from "@/components/FeedReelsCarousel";

const chips = ["For You", "Nearby", "Diaspora", "Culture", "Business", "Dating Tips", "New Here"];

// Map chips to filter logic
const chipTagMap: Record<string, (post: typeof feedPosts[0]) => boolean> = {
  "For You": () => true,
  "Nearby": (p) => p.type === "event" || p.time.includes("ago"),
  "Diaspora": (p) => (p.text?.toLowerCase().includes("diaspora") || p.text?.toLowerCase().includes("moved") || p.text?.toLowerCase().includes("new") || p.text?.toLowerCase().includes("community")) ?? false,
  "Culture": (p) => (p.text?.toLowerCase().includes("art") || p.text?.toLowerCase().includes("fashion") || p.text?.toLowerCase().includes("culture") || p.text?.toLowerCase().includes("music") || p.type === "event") ?? false,
  "Business": (p) => (p.text?.toLowerCase().includes("tech") || p.text?.toLowerCase().includes("build") || p.text?.toLowerCase().includes("business") || p.text?.toLowerCase().includes("network") || p.text?.toLowerCase().includes("professional")) ?? false,
  "Dating Tips": (p) => (p.text?.toLowerCase().includes("love") || p.text?.toLowerCase().includes("date") || p.text?.toLowerCase().includes("vibe") || p.text?.toLowerCase().includes("looking")) ?? false,
  "New Here": (p) => (p.text?.toLowerCase().includes("moved") || p.text?.toLowerCase().includes("new") || p.text?.toLowerCase().includes("just") || p.text?.toLowerCase().includes("first")) ?? false,
};

interface FeedScreenProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

const FeedScreen = ({ selectedCity, onCityChange }: FeedScreenProps) => {
  const [activeChip, setActiveChip] = useState("For You");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());

  const nwePosts = feedPosts.filter((p) => p.city === "_global");
  const cityPosts = feedPosts.filter((p) => p.city === selectedCity.id);
  const filterFn = chipTagMap[activeChip] || (() => true);
  const filteredCity = activeChip === "For You" ? cityPosts : cityPosts.filter(filterFn);
  const posts = [...nwePosts, ...filteredCity];

  const toggleLike = (id: number) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSave = (id: number) => {
    setSavedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <CityPicker selectedCity={selectedCity} onCityChange={onCityChange} />
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-secondary transition-colors">
              <Search size={20} className="text-muted-foreground" />
            </button>
            <button className="p-2 rounded-full hover:bg-secondary transition-colors relative">
              <Bell size={20} className="text-muted-foreground" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full gradient-gold" />
            </button>
          </div>
        </div>
      </header>

      {/* Chips */}
      <div className="px-4 py-3 overflow-x-auto scrollbar-hide max-w-lg mx-auto">
        <div className="flex gap-2 w-max">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveChip(chip)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeChip === chip
                  ? "gradient-gold text-primary-foreground shadow-gold"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Reels carousel */}
      <FeedReelsCarousel />

      {/* Feed */}
      <div className="px-4 space-y-4 max-w-lg mx-auto">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">No posts match this filter yet</p>
            <button onClick={() => setActiveChip("For You")} className="mt-3 text-sm text-primary font-semibold">Show all posts</button>
          </div>
        ) : posts.map((post) => (
          <article
            key={post.id}
            className="bg-card rounded-2xl border border-border overflow-hidden shadow-card animate-slide-up"
          >
            {post.author && (
              <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                {post.avatar ? (
                  <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover ring-2 ring-border" />
                ) : (
                  <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
                    <Users size={18} className="text-primary-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.location} · {post.time}</p>
                </div>
                {post.type === "event" && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold gradient-gold text-primary-foreground uppercase tracking-wider">Event</span>
                )}
              </div>
            )}

            {post.text && (
              <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">{post.text}</p>
            )}

            {post.image && (
              <div className="relative">
                <img src={post.image} alt="" className="w-full aspect-[4/3] object-cover" loading="lazy" />
                {post.type === "event" && post.eventTitle && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-transparent p-4 pt-12">
                    <h3 className="font-display font-bold text-foreground text-lg leading-tight">{post.eventTitle}</h3>
                    <p className="text-sm text-primary mt-1">{post.eventDate}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{post.eventVenue}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">{post.attending} attending</span>
                      <button className="px-5 py-2 rounded-full gradient-gold text-primary-foreground text-sm font-semibold shadow-gold transition-transform hover:scale-105 active:scale-95">RSVP</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-1 px-3 py-3 border-t border-border">
              <button 
                onClick={() => toggleLike(post.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors"
              >
                <Heart size={18} className={likedPosts.has(post.id) ? "text-red-500" : "text-muted-foreground"} fill={likedPosts.has(post.id) ? "currentColor" : "none"} />
                <span className="text-xs text-muted-foreground">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors">
                <MessageCircle size={18} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{post.comments}</span>
              </button>
              <button className="p-1.5 rounded-full hover:bg-secondary transition-colors">
                <Share2 size={18} className="text-muted-foreground" />
              </button>
              <div className="flex-1" />
              <button 
                onClick={() => toggleSave(post.id)}
                className="p-1.5 rounded-full hover:bg-secondary transition-colors"
              >
                <Bookmark size={18} className={savedPosts.has(post.id) ? "text-primary" : "text-muted-foreground"} fill={savedPosts.has(post.id) ? "currentColor" : "none"} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default FeedScreen;
