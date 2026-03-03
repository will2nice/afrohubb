import { useState, useRef } from "react";
import { Search, Bell, Heart, MessageCircle, Share2, Bookmark, Users, Play, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { feedPosts, type City } from "@/data/cityData";
import CityPicker from "@/components/CityPicker";
import FeedStories from "@/components/FeedStories";
import FullScreenReelViewer from "@/components/FullScreenReelViewer";

const chips = ["For You", "Nearby", "Diaspora", "Culture", "Business", "Dating Tips", "New Here"];

const chipTagMap: Record<string, (post: typeof feedPosts[0]) => boolean> = {
  "For You": () => true,
  "Nearby": (p) => p.type === "event" || p.time.includes("ago"),
  "Diaspora": (p) => (p.text?.toLowerCase().includes("diaspora") || p.text?.toLowerCase().includes("moved") || p.text?.toLowerCase().includes("new") || p.text?.toLowerCase().includes("community")) ?? false,
  "Culture": (p) => (p.text?.toLowerCase().includes("art") || p.text?.toLowerCase().includes("fashion") || p.text?.toLowerCase().includes("culture") || p.text?.toLowerCase().includes("music") || p.type === "event") ?? false,
  "Business": (p) => (p.text?.toLowerCase().includes("tech") || p.text?.toLowerCase().includes("build") || p.text?.toLowerCase().includes("business") || p.text?.toLowerCase().includes("network") || p.text?.toLowerCase().includes("professional")) ?? false,
  "Dating Tips": (p) => (p.text?.toLowerCase().includes("love") || p.text?.toLowerCase().includes("date") || p.text?.toLowerCase().includes("vibe") || p.text?.toLowerCase().includes("looking")) ?? false,
  "New Here": (p) => (p.text?.toLowerCase().includes("moved") || p.text?.toLowerCase().includes("new") || p.text?.toLowerCase().includes("just") || p.text?.toLowerCase().includes("first")) ?? false,
};

const reelItems = [
  { id: "reel-0", author: "NWE", video: "/videos/nwe-trending-reel.mp4", caption: "Pan-African culture, history & excellence. The diaspora united 🌍✊🏾 #NWE #PanAfrican #BlackExcellence", likes: "58.7K", comments: "4.2K" },
  { id: "reel-1", author: "NWE", video: "/videos/nwe-reel-2.mp4", caption: "Our history is our power. Know where you come from 🌍📚 #NWE #AfricanHistory #Diaspora", likes: "42.3K", comments: "3.1K" },
  { id: "reel-2", author: "NWE", video: "/videos/nwe-reel-3.mp4", caption: "The beauty of the diaspora in motion ✨🖤 #NWE #BlackExcellence #Culture", likes: "35.6K", comments: "2.7K" },
  { id: "reel-3", author: "NWE", video: "/videos/nwe-reel-4.mp4", caption: "Excellence has no borders. From Africa to the world 🌍🔥 #NWE #PanAfrican", likes: "67.1K", comments: "5.8K" },
];

interface FeedScreenProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

const ReelCard = ({ reel, onOpenFullScreen }: { reel: typeof reelItems[0]; onOpenFullScreen: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const togglePlay = () => {
    if (playing) {
      videoRef.current?.pause();
      setPlaying(false);
    } else {
      videoRef.current?.play();
      setPlaying(true);
    }
  };

  return (
    <article className="bg-card rounded-2xl border border-border overflow-hidden shadow-card animate-slide-up">
      {/* Author header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
          <span className="text-xs font-bold text-primary-foreground">NWE</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{reel.author}</p>
          <p className="text-xs text-muted-foreground">Trending Reel</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold gradient-gold text-primary-foreground uppercase tracking-wider">Reel</span>
      </div>

      {/* Caption */}
      <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">{reel.caption}</p>

      {/* Video */}
      <div className="relative cursor-pointer" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={reel.video}
          className="w-full aspect-[4/3] object-cover"
          loop
          muted={muted}
          playsInline
          preload="metadata"
        />
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <Play size={24} className="text-white ml-1" fill="currentColor" />
            </div>
          </div>
        )}
        {/* Expand button */}
        <button
          className="absolute top-3 left-3 p-2 rounded-full bg-black/40 backdrop-blur-sm"
          onClick={(e) => { e.stopPropagation(); videoRef.current?.pause(); setPlaying(false); onOpenFullScreen(); }}
        >
          <Maximize2 size={14} className="text-white" />
        </button>
        {playing && (
          <button
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
          >
            {muted ? <VolumeX size={14} className="text-white" /> : <Volume2 size={14} className="text-white" />}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 py-3 border-t border-border">
        <button
          onClick={() => setLiked(!liked)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors"
        >
          <Heart size={18} className={liked ? "text-red-500" : "text-muted-foreground"} fill={liked ? "currentColor" : "none"} />
          <span className="text-xs text-muted-foreground">{reel.likes}</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors">
          <MessageCircle size={18} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{reel.comments}</span>
        </button>
        <button className="p-1.5 rounded-full hover:bg-secondary transition-colors">
          <Share2 size={18} className="text-muted-foreground" />
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setSaved(!saved)}
          className="p-1.5 rounded-full hover:bg-secondary transition-colors"
        >
          <Bookmark size={18} className={saved ? "text-primary" : "text-muted-foreground"} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
    </article>
  );
};

const FeedScreen = ({ selectedCity, onCityChange }: FeedScreenProps) => {
  const [activeChip, setActiveChip] = useState("For You");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());
  const [fullScreenReelIndex, setFullScreenReelIndex] = useState<number | null>(null);

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

  // Interleave reels into feed: insert one reel after every 2 posts
  const buildFeed = () => {
    const items: { type: "post"; data: typeof posts[0] }[] | { type: "reel"; data: typeof reelItems[0] }[] = [];
    let reelIdx = 0;
    const result: ({ type: "post"; data: typeof posts[0] } | { type: "reel"; data: typeof reelItems[0] })[] = [];

    posts.forEach((post, i) => {
      result.push({ type: "post", data: post });
      // Insert a reel after every 2 posts
      if ((i + 1) % 2 === 0 && reelIdx < reelItems.length) {
        result.push({ type: "reel", data: reelItems[reelIdx] });
        reelIdx++;
      }
    });
    return result;
  };

  const feedItems = buildFeed();

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

      {/* Stories */}
      <FeedStories />

      {/* Chips */}
      <div className="px-4 pb-3 overflow-x-auto scrollbar-hide max-w-lg mx-auto">
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

      {/* Feed with interleaved reels */}
      <div className="px-4 space-y-4 max-w-lg mx-auto">
        {feedItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">No posts match this filter yet</p>
            <button onClick={() => setActiveChip("For You")} className="mt-3 text-sm text-primary font-semibold">Show all posts</button>
          </div>
        ) : feedItems.map((item) => {
          if (item.type === "reel") {
            const reelIndex = reelItems.findIndex(r => r.id === item.data.id);
            return <ReelCard key={item.data.id} reel={item.data} onOpenFullScreen={() => setFullScreenReelIndex(reelIndex)} />;
          }
          const post = item.data;
          return (
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
          );
        })}
      </div>
      {fullScreenReelIndex !== null && (
        <FullScreenReelViewer
          reels={reelItems}
          startIndex={fullScreenReelIndex}
          onClose={() => setFullScreenReelIndex(null)}
        />
      )}
    </div>
  );
};

export default FeedScreen;
