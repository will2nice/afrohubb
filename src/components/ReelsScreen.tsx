import { useState, useRef } from "react";
import { Heart, MessageCircle, Share2, Music, Bookmark, Volume2, VolumeX } from "lucide-react";

const reels = [
  { id: 0, author: "NWE", video: "/videos/nwe-trending-reel.mp4", caption: "Pan-African culture, history & excellence. The diaspora united 🌍✊🏾 #NWE #PanAfrican #BlackExcellence", song: "Original Sound — NWE", likes: "58.7K", comments: "4.2K", shares: "12.1K" },
  { id: 1, author: "NWE", video: "/videos/nwe-reel-2.mp4", caption: "Our history is our power. Know where you come from 🌍📚 #NWE #AfricanHistory #Diaspora", song: "Original Sound — NWE", likes: "42.3K", comments: "3.1K", shares: "9.8K" },
  { id: 2, author: "NWE", video: "/videos/nwe-reel-3.mp4", caption: "The beauty of the diaspora in motion ✨🖤 #NWE #BlackExcellence #Culture", song: "Original Sound — NWE", likes: "35.6K", comments: "2.7K", shares: "7.4K" },
  { id: 3, author: "NWE", video: "/videos/nwe-reel-4.mp4", caption: "Excellence has no borders. From Africa to the world 🌍🔥 #NWE #PanAfrican", song: "Original Sound — NWE", likes: "67.1K", comments: "5.8K", shares: "14.2K" },
];

const ReelsScreen = () => {
  const [currentReel, setCurrentReel] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [showHeart, setShowHeart] = useState(false);
  const [muted, setMuted] = useState(false);
  const [following, setFollowing] = useState(false);
  const touchStartY = useRef(0);

  const reel = reels[currentReel];

  const handleScroll = (direction: "up" | "down") => {
    if (direction === "down" && currentReel < reels.length - 1) setCurrentReel((i) => i + 1);
    else if (direction === "up" && currentReel > 0) setCurrentReel((i) => i - 1);
  };
  const toggleLike = (id: number) => { setLiked((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; }); };
  const handleDoubleTap = (id: number) => { if (!liked.has(id)) setLiked((prev) => new Set(prev).add(id)); setShowHeart(true); setTimeout(() => setShowHeart(false), 800); };
  const toggleSave = (id: number) => { setSaved((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; }); };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div
        className="relative w-[85%] max-w-[380px] h-[calc(100vh-130px)] rounded-3xl overflow-hidden shadow-elevated border border-border/30"
        onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
        onTouchEnd={(e) => {
          const diff = touchStartY.current - e.changedTouches[0].clientY;
          if (diff > 60) handleScroll("down");
          else if (diff < -60) handleScroll("up");
        }}
      >
        {reel && (
          <div className="relative w-full h-full animate-fade-in" key={reel.id}>
            <video
              src={reel.video}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted={muted}
              playsInline
              preload="metadata"
              onDoubleClick={() => handleDoubleTap(reel.id)}
            />

            {showHeart && (
              <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                <Heart size={80} className="text-red-500 animate-scale-in" fill="currentColor" style={{ animation: "scale-in 0.3s ease-out, fade-out 0.5s ease-out 0.3s forwards" }} />
              </div>
            )}

            {/* Top gradient & header */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background/70 to-transparent z-10">
              <div className="flex items-center justify-between px-4 pt-4">
                <h1 className="font-display text-lg font-bold text-foreground">Reels</h1>
                <button onClick={() => setMuted(!muted)} className="p-2 rounded-full bg-background/20 backdrop-blur-sm">
                  {muted ? <VolumeX size={16} className="text-foreground" /> : <Volume2 size={16} className="text-foreground" />}
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="absolute top-1.5 left-3 right-3 flex gap-1 z-20">
              {reels.map((_, i) => (
                <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden bg-foreground/20">
                  <div className={`h-full rounded-full transition-all duration-500 ${i < currentReel ? "w-full gradient-gold" : i === currentReel ? "w-full gradient-gold animate-pulse" : "w-0"}`} />
                </div>
              ))}
            </div>

            {/* Right side actions */}
            <div className="absolute right-3 bottom-28 flex flex-col items-center gap-4 z-10">
              <div className="relative mb-1">
                <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center ring-2 ring-primary">
                  <span className="text-[10px] font-bold text-primary-foreground">NWE</span>
                </div>
                {!following && (
                  <button onClick={() => setFollowing(true)} className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full gradient-gold flex items-center justify-center text-primary-foreground text-xs font-bold">+</button>
                )}
              </div>
              <button onClick={() => toggleLike(reel.id)} className="flex flex-col items-center gap-0.5 transition-transform active:scale-90">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${liked.has(reel.id) ? "bg-red-500/20" : "bg-background/20"}`}>
                  <Heart size={22} className={`transition-colors ${liked.has(reel.id) ? "text-red-500" : "text-foreground"}`} fill={liked.has(reel.id) ? "currentColor" : "none"} />
                </div>
                <span className="text-[10px] font-semibold text-foreground">{reel.likes}</span>
              </button>
              <button className="flex flex-col items-center gap-0.5 transition-transform active:scale-90">
                <div className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center backdrop-blur-sm"><MessageCircle size={22} className="text-foreground" /></div>
                <span className="text-[10px] font-semibold text-foreground">{reel.comments}</span>
              </button>
              <button className="flex flex-col items-center gap-0.5 transition-transform active:scale-90">
                <div className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center backdrop-blur-sm"><Share2 size={22} className="text-foreground" /></div>
                <span className="text-[10px] font-semibold text-foreground">{reel.shares}</span>
              </button>
              <button onClick={() => toggleSave(reel.id)} className="flex flex-col items-center gap-0.5 transition-transform active:scale-90">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${saved.has(reel.id) ? "bg-primary/20" : "bg-background/20"}`}>
                  <Bookmark size={22} className={`transition-colors ${saved.has(reel.id) ? "text-primary" : "text-foreground"}`} fill={saved.has(reel.id) ? "currentColor" : "none"} />
                </div>
              </button>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-3 left-0 right-14 p-4 bg-gradient-to-t from-background/80 via-background/40 to-transparent pt-16 z-10">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-sm font-bold text-foreground">{reel.author}</span>
                {following && <span className="text-[10px] text-primary font-semibold">Following</span>}
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed mb-2 line-clamp-2">{reel.caption}</p>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-background/20 backdrop-blur-sm w-fit">
                <Music size={11} className="text-foreground/70 animate-pulse" />
                <p className="text-[10px] text-foreground/80 truncate max-w-[180px]">{reel.song}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation arrows */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[76px] flex items-center gap-3 z-20">
        <button onClick={() => handleScroll("up")} disabled={currentReel === 0} className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center disabled:opacity-30 transition-opacity hover:bg-secondary">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="m18 15-6-6-6 6"/></svg>
        </button>
        <span className="text-xs font-semibold text-muted-foreground">{currentReel + 1}/{reels.length}</span>
        <button onClick={() => handleScroll("down")} disabled={currentReel === reels.length - 1} className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center disabled:opacity-30 transition-opacity hover:bg-secondary">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="m6 9 6 6 6-6"/></svg>
        </button>
      </div>
    </div>
  );
};

export default ReelsScreen;
