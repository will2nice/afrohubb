import { useState, useRef } from "react";
import { Heart, Play, Volume2, VolumeX } from "lucide-react";

const reels = [
  { id: 0, author: "NWE", video: "/videos/nwe-trending-reel.mp4", caption: "Pan-African culture united 🌍✊🏾", likes: "58.7K" },
  { id: 1, author: "NWE", video: "/videos/nwe-reel-2.mp4", caption: "Our history is our power 🌍📚", likes: "42.3K" },
  { id: 2, author: "NWE", video: "/videos/nwe-reel-3.mp4", caption: "Diaspora in motion ✨🖤", likes: "35.6K" },
  { id: 3, author: "NWE", video: "/videos/nwe-reel-4.mp4", caption: "Excellence has no borders 🌍🔥", likes: "67.1K" },
];

const FeedReelsCarousel = () => {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  const handlePlay = (id: number) => {
    // Pause others
    Object.entries(videoRefs.current).forEach(([key, vid]) => {
      if (Number(key) !== id && vid) {
        vid.pause();
      }
    });
    const vid = videoRefs.current[id];
    if (playingId === id) {
      vid?.pause();
      setPlayingId(null);
    } else {
      vid?.play();
      setPlayingId(id);
    }
  };

  const toggleLike = (id: number) => {
    setLiked((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  return (
    <div className="px-4 pb-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-foreground">Reels</h2>
        <span className="text-[10px] text-muted-foreground">NWE · Trending</span>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar">
        {reels.map((reel) => (
          <div
            key={reel.id}
            className="relative shrink-0 w-[130px] h-[200px] rounded-2xl overflow-hidden border border-border/50 bg-black"
          >
            <video
              ref={(el) => { videoRefs.current[reel.id] = el; }}
              src={reel.video}
              className="w-full h-full object-cover"
              loop
              muted={muted}
              playsInline
              preload="metadata"
              onClick={() => handlePlay(reel.id)}
              onEnded={() => setPlayingId(null)}
            />

            {/* Play overlay */}
            {playingId !== reel.id && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
                onClick={() => handlePlay(reel.id)}
              >
                <Play size={28} className="text-white/90" fill="currentColor" />
              </div>
            )}

            {/* Bottom info */}
            <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-[9px] text-white/90 font-medium leading-tight line-clamp-2">
                {reel.caption}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[9px] text-white/70">{reel.author}</span>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); toggleLike(reel.id); }}>
                    <Heart
                      size={12}
                      className={liked.has(reel.id) ? "text-red-500" : "text-white/70"}
                      fill={liked.has(reel.id) ? "currentColor" : "none"}
                    />
                  </button>
                  <span className="text-[9px] text-white/70">{reel.likes}</span>
                </div>
              </div>
            </div>

            {/* Mute toggle on playing */}
            {playingId === reel.id && (
              <button
                className="absolute top-2 right-2 p-1 rounded-full bg-black/40"
                onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
              >
                {muted ? <VolumeX size={10} className="text-white" /> : <Volume2 size={10} className="text-white" />}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedReelsCarousel;
