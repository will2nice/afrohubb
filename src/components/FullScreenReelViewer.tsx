import { useState, useRef } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Volume2, VolumeX, Music, X } from "lucide-react";

interface ReelData {
  id: string;
  author: string;
  video: string;
  caption: string;
  likes: string;
  comments: string;
}

interface FullScreenReelViewerProps {
  reels: ReelData[];
  startIndex: number;
  onClose: () => void;
}

const FullScreenReelViewer = ({ reels, startIndex, onClose }: FullScreenReelViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [muted, setMuted] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [following, setFollowing] = useState(false);
  const touchStartY = useRef(0);

  const reel = reels[currentIndex];

  const handleScroll = (direction: "up" | "down") => {
    if (direction === "down" && currentIndex < reels.length - 1) setCurrentIndex((i) => i + 1);
    else if (direction === "up" && currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const toggleLike = (id: string) => {
    setLiked((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const handleDoubleTap = (id: string) => {
    if (!liked.has(id)) setLiked((prev) => new Set(prev).add(id));
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const toggleSave = (id: string) => {
    setSaved((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in fade-in duration-200">
      <div
        className="relative w-full h-full max-w-lg"
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
              preload="auto"
              onDoubleClick={() => handleDoubleTap(reel.id)}
            />

            {showHeart && (
              <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                <Heart size={80} className="text-red-500" fill="currentColor" style={{ animation: "scale-in 0.3s ease-out, fade-out 0.5s ease-out 0.3s forwards" }} />
              </div>
            )}

            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 z-20">
              {/* Progress bars */}
              <div className="flex gap-1 px-3 pt-2">
                {reels.map((_, i) => (
                  <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/20">
                    <div className={`h-full rounded-full transition-all duration-500 ${i < currentIndex ? "w-full bg-white" : i === currentIndex ? "w-full bg-white animate-pulse" : "w-0"}`} />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between px-4 pt-3">
                <h1 className="font-display text-lg font-bold text-white">Reels</h1>
                <div className="flex items-center gap-2">
                  <button onClick={() => setMuted(!muted)} className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                    {muted ? <VolumeX size={16} className="text-white" /> : <Volume2 size={16} className="text-white" />}
                  </button>
                  <button onClick={onClose} className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                    <X size={16} className="text-white" />
                  </button>
                </div>
              </div>
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
                <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${liked.has(reel.id) ? "bg-red-500/20" : "bg-white/10"}`}>
                  <Heart size={22} className={liked.has(reel.id) ? "text-red-500" : "text-white"} fill={liked.has(reel.id) ? "currentColor" : "none"} />
                </div>
                <span className="text-[10px] font-semibold text-white">{reel.likes}</span>
              </button>
              <button className="flex flex-col items-center gap-0.5 transition-transform active:scale-90">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm"><MessageCircle size={22} className="text-white" /></div>
                <span className="text-[10px] font-semibold text-white">{reel.comments}</span>
              </button>
              <button className="flex flex-col items-center gap-0.5 transition-transform active:scale-90">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm"><Share2 size={22} className="text-white" /></div>
              </button>
              <button onClick={() => toggleSave(reel.id)} className="flex flex-col items-center gap-0.5 transition-transform active:scale-90">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${saved.has(reel.id) ? "bg-primary/20" : "bg-white/10"}`}>
                  <Bookmark size={22} className={saved.has(reel.id) ? "text-primary" : "text-white"} fill={saved.has(reel.id) ? "currentColor" : "none"} />
                </div>
              </button>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-6 left-0 right-14 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-16 z-10">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-sm font-bold text-white">{reel.author}</span>
                {following && <span className="text-[10px] text-primary font-semibold">Following</span>}
              </div>
              <p className="text-xs text-white/90 leading-relaxed mb-2 line-clamp-2">{reel.caption}</p>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm w-fit">
                <Music size={11} className="text-white/70 animate-pulse" />
                <p className="text-[10px] text-white/80 truncate max-w-[180px]">Original Sound — {reel.author}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav arrows */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex items-center gap-3 z-20">
        <button onClick={() => handleScroll("up")} disabled={currentIndex === 0} className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center disabled:opacity-30 backdrop-blur-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m18 15-6-6-6 6"/></svg>
        </button>
        <span className="text-xs font-semibold text-white/70">{currentIndex + 1}/{reels.length}</span>
        <button onClick={() => handleScroll("down")} disabled={currentIndex === reels.length - 1} className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center disabled:opacity-30 backdrop-blur-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m6 9 6 6 6-6"/></svg>
        </button>
      </div>
    </div>
  );
};

export default FullScreenReelViewer;
