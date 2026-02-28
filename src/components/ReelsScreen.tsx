import { useState } from "react";
import { Heart, MessageCircle, Share2, Music, Bookmark, Play } from "lucide-react";
import reel1 from "@/assets/reel-1.jpg";
import reel2 from "@/assets/reel-2.jpg";
import reel3 from "@/assets/reel-3.jpg";
import profileWoman1 from "@/assets/profile-woman-1.jpg";
import profileMan1 from "@/assets/profile-man-1.jpg";
import profileMan2 from "@/assets/profile-man-2.jpg";

const reels = [
  {
    id: 1,
    author: "Dayo",
    avatar: profileMan2,
    image: reel1,
    caption: "This Afrobeats challenge is taking over 🔥💃 #AfroHub #DanceChallenge",
    song: "CKay — Love Nwantiti",
    likes: "19.3K",
    comments: "842",
    shares: "1.2K",
  },
  {
    id: 2,
    author: "Nneka Cooks",
    avatar: profileWoman1,
    image: reel2,
    caption: "The REAL jollof recipe. No debates 🍚🔥 Drop your country flag if you claim the best jollof!",
    song: "Original Sound — Nneka Cooks",
    likes: "42.1K",
    comments: "3.8K",
    shares: "5.6K",
  },
  {
    id: 3,
    author: "Kofi Styles",
    avatar: profileMan1,
    image: reel3,
    caption: "Ankara drip check ✨ Where my fashion lovers at? #AfricanFashion #Ankara",
    song: "Burna Boy — City Boys",
    likes: "8.7K",
    comments: "412",
    shares: "967",
  },
];

const ReelsScreen = () => {
  const [currentReel, setCurrentReel] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const reel = reels[currentReel];

  const handleScroll = (direction: "up" | "down") => {
    if (direction === "down") {
      setCurrentReel((i) => Math.min(i + 1, reels.length - 1));
    } else if (direction === "up") {
      setCurrentReel((i) => Math.max(i - 1, 0));
    }
  };

  const toggleLike = (id: number) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      className="fixed inset-0 bg-background"
      onTouchStart={(e) => {
        const startY = e.touches[0].clientY;
        const handleEnd = (ev: TouchEvent) => {
          const diff = startY - ev.changedTouches[0].clientY;
          if (diff > 60) handleScroll("down");
          else if (diff < -60) handleScroll("up");
          document.removeEventListener("touchend", handleEnd);
        };
        document.addEventListener("touchend", handleEnd);
      }}
    >
      {/* Full-screen reel */}
      {reel && <div className="relative w-full h-full animate-fade-in" key={reel.id}>
        <img
          src={reel.image}
          alt=""
          className="w-full h-full object-cover"
        />

        {/* Play button overlay (decorative) */}
        <button className="absolute inset-0 flex items-center justify-center group">
          <div className="w-16 h-16 rounded-full bg-background/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={28} className="text-foreground ml-1" fill="currentColor" />
          </div>
        </button>

        {/* Top gradient */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background/60 to-transparent">
          <div className="flex items-center justify-center pt-4">
            <h1 className="font-display text-lg font-bold text-foreground">Reels</h1>
          </div>
        </div>

        {/* Right side actions */}
        <div className="absolute right-3 bottom-32 flex flex-col items-center gap-5">
          <button
            onClick={() => toggleLike(reel.id)}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-11 h-11 rounded-full bg-background/20 flex items-center justify-center backdrop-blur-sm">
              <Heart
                size={22}
                className={liked.has(reel.id) ? "text-accent" : "text-foreground"}
                fill={liked.has(reel.id) ? "currentColor" : "none"}
              />
            </div>
            <span className="text-[11px] font-semibold text-foreground">{reel.likes}</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 rounded-full bg-background/20 flex items-center justify-center backdrop-blur-sm">
              <MessageCircle size={22} className="text-foreground" />
            </div>
            <span className="text-[11px] font-semibold text-foreground">{reel.comments}</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 rounded-full bg-background/20 flex items-center justify-center backdrop-blur-sm">
              <Share2 size={22} className="text-foreground" />
            </div>
            <span className="text-[11px] font-semibold text-foreground">{reel.shares}</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 rounded-full bg-background/20 flex items-center justify-center backdrop-blur-sm">
              <Bookmark size={22} className="text-foreground" />
            </div>
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-20 left-0 right-16 p-4 bg-gradient-to-t from-background/80 via-background/40 to-transparent pt-16">
          <div className="flex items-center gap-2.5 mb-2">
            <img
              src={reel.avatar}
              alt={reel.author}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-primary"
            />
            <span className="text-sm font-semibold text-foreground">{reel.author}</span>
            <button className="px-3 py-1 rounded-full border border-foreground/30 text-xs font-semibold text-foreground hover:bg-foreground/10 transition-colors">
              Follow
            </button>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed mb-2">{reel.caption}</p>
          <div className="flex items-center gap-2">
            <Music size={12} className="text-foreground/70" />
            <p className="text-xs text-foreground/70 truncate">{reel.song}</p>
          </div>
        </div>

        {/* Reel indicators */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[72px] flex gap-1.5">
          {reels.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentReel(i)}
              className={`h-1 rounded-full transition-all ${
                i === currentReel ? "w-6 gradient-gold" : "w-1.5 bg-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>}
    </div>
  );
};

export default ReelsScreen;
