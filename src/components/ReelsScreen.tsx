import { useState, useRef } from "react";
import { Heart, MessageCircle, Share2, Music, Bookmark, Play, Volume2, VolumeX } from "lucide-react";
import reel1 from "@/assets/reel-1.jpg";
import reel2 from "@/assets/reel-2.jpg";
import reel3 from "@/assets/reel-3.jpg";
import profileWoman1 from "@/assets/profile-woman-1.jpg";
import profileWoman2 from "@/assets/profile-woman-2.jpg";
import profileMan1 from "@/assets/profile-man-1.jpg";
import profileMan2 from "@/assets/profile-man-2.jpg";
import eventConcert from "@/assets/event-concert.jpg";
import eventParty from "@/assets/event-party.jpg";

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
  {
    id: 4,
    author: "Amara Vibes",
    avatar: profileWoman2,
    image: eventConcert,
    caption: "Burna Boy concert was INSANE last night 🎤🔥 Houston showed out!! #BurnaBoyConcert #Afrobeats",
    song: "Burna Boy — Last Last",
    likes: "67.2K",
    comments: "5.1K",
    shares: "8.3K",
  },
  {
    id: 5,
    author: "DJ Kwame",
    avatar: profileMan2,
    image: eventParty,
    caption: "Saturday night set was different 🎧🕺 When the amapiano drops and everyone goes crazy #DJLife #Amapiano",
    song: "DJ Kwame — Live Set Mix",
    likes: "31.5K",
    comments: "2.4K",
    shares: "4.1K",
  },
];

const ReelsScreen = () => {
  const [currentReel, setCurrentReel] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [showHeart, setShowHeart] = useState(false);
  const [muted, setMuted] = useState(false);
  const [following, setFollowing] = useState<Set<number>>(new Set());
  const touchStartY = useRef(0);

  const reel = reels[currentReel];

  const handleScroll = (direction: "up" | "down") => {
    if (direction === "down" && currentReel < reels.length - 1) {
      setCurrentReel((i) => i + 1);
    } else if (direction === "up" && currentReel > 0) {
      setCurrentReel((i) => i - 1);
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

  const handleDoubleTap = (id: number) => {
    if (!liked.has(id)) {
      setLiked((prev) => new Set(prev).add(id));
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const toggleSave = (id: number) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFollow = (id: number) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      {/* Centered reel container with rounded edges */}
      <div
        className="relative w-[85%] max-w-[380px] h-[calc(100vh-130px)] rounded-3xl overflow-hidden shadow-elevated border border-border/30"
        onTouchStart={(e) => {
          touchStartY.current = e.touches[0].clientY;
        }}
        onTouchEnd={(e) => {
          const diff = touchStartY.current - e.changedTouches[0].clientY;
          if (diff > 60) handleScroll("down");
          else if (diff < -60) handleScroll("up");
        }}
      >
        {reel && (
          <div className="relative w-full h-full animate-fade-in" key={reel.id}>
            <img
              src={reel.image}
              alt=""
              className="w-full h-full object-cover"
              onDoubleClick={() => handleDoubleTap(reel.id)}
            />

            {/* Double-tap heart animation */}
            {showHeart && (
              <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                <Heart
                  size={80}
                  className="text-red-500 animate-scale-in"
                  fill="currentColor"
                  style={{ animation: "scale-in 0.3s ease-out, fade-out 0.5s ease-out 0.3s forwards" }}
                />
              </div>
            )}

            {/* Top gradient & header */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background/70 to-transparent z-10">
              <div className="flex items-center justify-between px-4 pt-4">
                <h1 className="font-display text-lg font-bold text-foreground">Reels</h1>
                <button onClick={() => setMuted(!muted)} className="p-2 rounded-full bg-background/20 backdrop-blur-sm">
                  {muted ? <VolumeX size={16} className="text-foreground" /> : <Volume2 size={16} className="text-foreground" />}
                </button>
              </div>
            </div>

            {/* Progress bar at top */}
            <div className="absolute top-1.5 left-3 right-3 flex gap-1 z-20">
              {reels.map((_, i) => (
                <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden bg-foreground/20">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      i < currentReel ? "w-full gradient-gold" : i === currentReel ? "w-full gradient-gold animate-pulse" : "w-0"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Right side actions */}
            <div className="absolute right-3 bottom-28 flex flex-col items-center gap-4 z-10">
              {/* Profile pic */}
              <div className="relative mb-1">
                <img src={reel.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-primary" />
                {!following.has(reel.id) && (
                  <button
                    onClick={() => toggleFollow(reel.id)}
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full gradient-gold flex items-center justify-center text-primary-foreground text-xs font-bold"
                  >
                    +
                  </button>
                )}
              </div>

              <button
                onClick={() => toggleLike(reel.id)}
                className="flex flex-col items-center gap-0.5 transition-transform active:scale-90"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
                  liked.has(reel.id) ? "bg-red-500/20" : "bg-background/20"
                }`}>
                  <Heart
                    size={22}
                    className={`transition-colors ${liked.has(reel.id) ? "text-red-500" : "text-foreground"}`}
                    fill={liked.has(reel.id) ? "currentColor" : "none"}
                  />
                </div>
                <span className="text-[10px] font-semibold text-foreground">{reel.likes}</span>
              </button>

              <button className="flex flex-col items-center gap-0.5 transition-transform active:scale-90">
                <div className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center backdrop-blur-sm">
                  <MessageCircle size={22} className="text-foreground" />
                </div>
                <span className="text-[10px] font-semibold text-foreground">{reel.comments}</span>
              </button>

              <button className="flex flex-col items-center gap-0.5 transition-transform active:scale-90">
                <div className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center backdrop-blur-sm">
                  <Share2 size={22} className="text-foreground" />
                </div>
                <span className="text-[10px] font-semibold text-foreground">{reel.shares}</span>
              </button>

              <button
                onClick={() => toggleSave(reel.id)}
                className="flex flex-col items-center gap-0.5 transition-transform active:scale-90"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
                  saved.has(reel.id) ? "bg-primary/20" : "bg-background/20"
                }`}>
                  <Bookmark
                    size={22}
                    className={`transition-colors ${saved.has(reel.id) ? "text-primary" : "text-foreground"}`}
                    fill={saved.has(reel.id) ? "currentColor" : "none"}
                  />
                </div>
              </button>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-3 left-0 right-14 p-4 bg-gradient-to-t from-background/80 via-background/40 to-transparent pt-16 z-10">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-sm font-bold text-foreground">{reel.author}</span>
                {following.has(reel.id) && (
                  <span className="text-[10px] text-primary font-semibold">Following</span>
                )}
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

      {/* Navigation arrows for desktop */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[76px] flex items-center gap-3 z-20">
        <button
          onClick={() => handleScroll("up")}
          disabled={currentReel === 0}
          className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center disabled:opacity-30 transition-opacity hover:bg-secondary"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="m18 15-6-6-6 6"/></svg>
        </button>
        <span className="text-xs font-semibold text-muted-foreground">{currentReel + 1}/{reels.length}</span>
        <button
          onClick={() => handleScroll("down")}
          disabled={currentReel === reels.length - 1}
          className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center disabled:opacity-30 transition-opacity hover:bg-secondary"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="m6 9 6 6 6-6"/></svg>
        </button>
      </div>
    </div>
  );
};

export default ReelsScreen;
