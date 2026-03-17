import { useState, useRef } from "react";
import { Search, Heart, MessageCircle, Share2, Bookmark, Users, Play, Volume2, VolumeX, Maximize2, Newspaper, Megaphone, Film, LayoutGrid, AlertTriangle, Send, BookOpen, PenSquare } from "lucide-react";
import NotificationCenter, { NotificationBell } from "@/components/NotificationCenter";
import { feedPosts, type City, type FeedCategory } from "@/data/cityData";
import CityPicker from "@/components/CityPicker";
import FeedStories from "@/components/FeedStories";
import FullScreenReelViewer from "@/components/FullScreenReelViewer";
import CultureLearnScreen from "@/components/CultureLearnScreen";
import CreatePostSheet from "@/components/CreatePostSheet";
import CommentSheet from "@/components/CommentSheet";
import { usePosts, type PostComment } from "@/hooks/usePosts";
import { useAuth } from "@/contexts/AuthContext";
import { useScreenView } from "@/hooks/useAnalytics";

// ─── Feed content-type tabs ───
const feedTabs = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "reels", label: "Reels", icon: Film },
  { id: "posts", label: "Posts", icon: Users },
  { id: "local-news", label: "News", icon: Newspaper },
  { id: "community", label: "Updates", icon: Megaphone },
  { id: "learn", label: "Learn", icon: BookOpen },
] as const;

type FeedTab = typeof feedTabs[number]["id"];

const chips = ["For You", "Nearby", "Diaspora", "Culture", "Business", "New Here"];

const chipTagMap: Record<string, (post: typeof feedPosts[0]) => boolean> = {
  "For You": () => true,
  "Nearby": (p) => p.type === "event" || p.time.includes("ago"),
  "Diaspora": (p) => (p.text?.toLowerCase().includes("diaspora") || p.text?.toLowerCase().includes("moved") || p.text?.toLowerCase().includes("new") || p.text?.toLowerCase().includes("community")) ?? false,
  "Culture": (p) => (p.text?.toLowerCase().includes("art") || p.text?.toLowerCase().includes("fashion") || p.text?.toLowerCase().includes("culture") || p.text?.toLowerCase().includes("music") || p.type === "event") ?? false,
  "Business": (p) => (p.text?.toLowerCase().includes("tech") || p.text?.toLowerCase().includes("build") || p.text?.toLowerCase().includes("business") || p.text?.toLowerCase().includes("network") || p.text?.toLowerCase().includes("professional")) ?? false,
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

// ─── Reel Card ───
const ReelCard = ({ reel, onOpenFullScreen }: { reel: typeof reelItems[0]; onOpenFullScreen: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const togglePlay = () => {
    if (playing) { videoRef.current?.pause(); setPlaying(false); }
    else { videoRef.current?.play(); setPlaying(true); }
  };

  return (
    <article className="bg-card rounded-2xl border border-border overflow-hidden shadow-card animate-slide-up">
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
      <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">{reel.caption}</p>
      <div className="relative cursor-pointer" onClick={togglePlay}>
        <video ref={videoRef} src={reel.video} className="w-full aspect-[4/3] object-cover" loop muted={muted} playsInline preload="metadata" />
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <Play size={24} className="text-white ml-1" fill="currentColor" />
            </div>
          </div>
        )}
        <button className="absolute top-3 left-3 p-2 rounded-full bg-black/40 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); videoRef.current?.pause(); setPlaying(false); onOpenFullScreen(); }}>
          <Maximize2 size={14} className="text-white" />
        </button>
        {playing && (
          <button className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}>
            {muted ? <VolumeX size={14} className="text-white" /> : <Volume2 size={14} className="text-white" />}
          </button>
        )}
      </div>
      <div className="flex items-center gap-1 px-3 py-3 border-t border-border">
        <button onClick={() => setLiked(!liked)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors">
          <Heart size={18} className={liked ? "text-red-500" : "text-muted-foreground"} fill={liked ? "currentColor" : "none"} />
          <span className="text-xs text-muted-foreground">{reel.likes}</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors">
          <MessageCircle size={18} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{reel.comments}</span>
        </button>
        <button onClick={async () => { const t = `${reel.caption}`; if (navigator.share) { try { await navigator.share({ title: "AfroHub Reel", text: t }); } catch {} } else { await navigator.clipboard.writeText(t); } }} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
          <Share2 size={18} className="text-muted-foreground" />
        </button>
        <div className="flex-1" />
        <button onClick={() => setSaved(!saved)} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
          <Bookmark size={18} className={saved ? "text-primary" : "text-muted-foreground"} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
    </article>
  );
};

// ─── News Post Card ───
const NewsPostCard = ({ post, liked, saved, onLike, onSave }: {
  post: typeof feedPosts[0]; liked: boolean; saved: boolean; onLike: () => void; onSave: () => void;
}) => (
  <article className="bg-card rounded-2xl border border-border overflow-hidden shadow-card animate-slide-up">
    <div className="flex items-center gap-3 px-4 pt-4 pb-2">
      <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
        <Newspaper size={18} className="text-destructive" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{post.author}</p>
        <p className="text-xs text-muted-foreground">{post.location} · {post.time}</p>
      </div>
      <div className="flex items-center gap-1.5">
        {post.isUrgent && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-destructive text-destructive-foreground uppercase">Urgent</span>}
        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-destructive/10 text-destructive uppercase tracking-wider">News</span>
      </div>
    </div>
    {post.text && <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">{post.text}</p>}
    {post.newsSource && <p className="px-4 pb-2 text-[11px] text-muted-foreground">Source: {post.newsSource}</p>}
    <div className="flex items-center gap-1 px-3 py-3 border-t border-border">
      <button onClick={onLike} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors">
        <Heart size={18} className={liked ? "text-red-500" : "text-muted-foreground"} fill={liked ? "currentColor" : "none"} />
        <span className="text-xs text-muted-foreground">{post.likes + (liked ? 1 : 0)}</span>
      </button>
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors">
        <MessageCircle size={18} className="text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{post.comments}</span>
      </button>
      <button className="p-1.5 rounded-full hover:bg-secondary transition-colors"><Share2 size={18} className="text-muted-foreground" /></button>
      <div className="flex-1" />
      <button onClick={onSave} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
        <Bookmark size={18} className={saved ? "text-primary" : "text-muted-foreground"} fill={saved ? "currentColor" : "none"} />
      </button>
    </div>
  </article>
);

// ─── Community Update Card ───
const CommunityUpdateCard = ({ post, liked, saved, onLike, onSave }: {
  post: typeof feedPosts[0]; liked: boolean; saved: boolean; onLike: () => void; onSave: () => void;
}) => (
  <article className="bg-card rounded-2xl border-2 border-primary/20 overflow-hidden shadow-card animate-slide-up">
    <div className="flex items-center gap-3 px-4 pt-4 pb-2">
      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
        <Megaphone size={18} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{post.author}</p>
        <p className="text-xs text-muted-foreground">{post.location} · {post.time}</p>
      </div>
      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-primary/10 text-primary uppercase tracking-wider">Update</span>
    </div>
    {post.text && <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">{post.text}</p>}
    <div className="flex items-center gap-1 px-3 py-3 border-t border-border">
      <button onClick={onLike} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors">
        <Heart size={18} className={liked ? "text-red-500" : "text-muted-foreground"} fill={liked ? "currentColor" : "none"} />
        <span className="text-xs text-muted-foreground">{post.likes + (liked ? 1 : 0)}</span>
      </button>
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors">
        <MessageCircle size={18} className="text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{post.comments}</span>
      </button>
      <button className="p-1.5 rounded-full hover:bg-secondary transition-colors"><Share2 size={18} className="text-muted-foreground" /></button>
      <div className="flex-1" />
      <button onClick={onSave} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
        <Bookmark size={18} className={saved ? "text-primary" : "text-muted-foreground"} fill={saved ? "currentColor" : "none"} />
      </button>
    </div>
  </article>
);

// ─── Suggest a Topic Card ───
const SuggestTopicCard = () => {
  const [topic, setTopic] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <article className="bg-card rounded-2xl border border-dashed border-primary/30 overflow-hidden shadow-card animate-slide-up">
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center">
            <Megaphone size={14} className="text-primary-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground">Suggest a Topic</p>
        </div>
        <p className="text-xs text-muted-foreground mb-3">What issues matter to your community?</p>
      </div>
      {submitted ? (
        <div className="px-4 pb-4">
          <div className="bg-primary/10 rounded-xl p-3 text-center">
            <p className="text-sm font-semibold text-primary">Thanks for your voice! ✊🏾</p>
          </div>
        </div>
      ) : (
        <div className="px-4 pb-4 flex gap-2">
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Youth mental health..." className="flex-1 bg-secondary rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30" />
          <button onClick={() => { if (topic.trim()) setSubmitted(true); }} disabled={!topic.trim()} className="p-2.5 rounded-full gradient-gold text-primary-foreground disabled:opacity-40">
            <Send size={16} />
          </button>
        </div>
      )}
    </article>
  );
};

// ─── DB Post Card ───
const DbPostCard = ({ post, onLike, onComment }: {
  post: import("@/hooks/usePosts").Post;
  onLike: () => void;
  onComment: () => void;
}) => {
  const [saved, setSaved] = useState(false);

  return (
    <article className="bg-card rounded-2xl border border-border overflow-hidden shadow-card animate-slide-up">
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        {post.profile?.avatar_url ? (
          <img src={post.profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-border" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <Users size={18} className="text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{post.profile?.display_name || "User"}</p>
          <p className="text-xs text-muted-foreground">
            {post.profile?.city || "Earth"} · {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      {post.content && <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">{post.content}</p>}
      {post.image_url && (
        <img src={post.image_url} alt="" className="w-full aspect-[4/3] object-cover" loading="lazy" />
      )}
      <div className="flex items-center gap-1 px-3 py-3 border-t border-border">
        <button onClick={onLike} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors">
          <Heart size={18} className={post.user_liked ? "text-red-500" : "text-muted-foreground"} fill={post.user_liked ? "currentColor" : "none"} />
          <span className="text-xs text-muted-foreground">{post.likes_count}</span>
        </button>
        <button onClick={onComment} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors">
          <MessageCircle size={18} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{post.comments_count}</span>
        </button>
        <button onClick={async () => {
          const text = post.content || "Check out this post on AfroHub!";
          if (navigator.share) { try { await navigator.share({ title: "AfroHub Post", text }); } catch {} }
          else { await navigator.clipboard.writeText(text); }
        }} className="p-1.5 rounded-full hover:bg-secondary transition-colors"><Share2 size={18} className="text-muted-foreground" /></button>
        <div className="flex-1" />
        <button onClick={() => setSaved(!saved)} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
          <Bookmark size={18} className={saved ? "text-primary" : "text-muted-foreground"} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
    </article>
  );
};

// ─── Main Feed Screen ───
const FeedScreen = ({ selectedCity, onCityChange }: FeedScreenProps) => {
  useScreenView("feed", { city: selectedCity.id });
  const [activeFeedTab, setActiveFeedTab] = useState<FeedTab>("all");
  const [activeChip, setActiveChip] = useState("For You");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());
  const [fullScreenReelIndex, setFullScreenReelIndex] = useState<number | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [commentingPost, setCommentingPost] = useState<string | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();

  const { posts: dbPosts, toggleLike: dbToggleLike, addComment, fetchComments, refetch: refetchPosts } = usePosts(selectedCity.id);

  const nwePosts = feedPosts.filter((p) => p.city === "_global");
  const cityPosts = feedPosts.filter((p) => p.city === selectedCity.id);
  const filterFn = chipTagMap[activeChip] || (() => true);
  const filteredCity = activeChip === "For You" ? cityPosts : cityPosts.filter(filterFn);
  const allPosts = [...nwePosts, ...filteredCity];

  const getFilteredPosts = () => {
    switch (activeFeedTab) {
      case "reels": return [];
      case "posts": return allPosts.filter(p => !p.feedCategory);
      case "local-news": return allPosts.filter(p => p.feedCategory === "local-news");
      case "community": return allPosts.filter(p => p.feedCategory === "community-update");
      default: return allPosts;
    }
  };

  const posts = getFilteredPosts();

  const toggleLike = (id: number) => {
    setLikedPosts(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };
  const toggleSave = (id: number) => {
    setSavedPosts(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  const openComments = async (postId: string) => {
    setCommentingPost(postId);
    const data = await fetchComments(postId);
    setComments(data);
  };

  const buildFeed = () => {
    if (activeFeedTab === "reels") return [];
    const result: ({ type: "post"; data: typeof posts[0] } | { type: "reel"; data: typeof reelItems[0] } | { type: "suggest-topic" })[] = [];
    let reelIdx = 0;
    const showReels = activeFeedTab === "all";

    posts.forEach((post, i) => {
      if (i === 0 && post.isUrgent) { result.push({ type: "post", data: post }); return; }
      result.push({ type: "post", data: post });
      if (showReels && (i + 1) % 3 === 0 && reelIdx < reelItems.length) {
        result.push({ type: "reel", data: reelItems[reelIdx] });
        reelIdx++;
      }
    });

    if (activeFeedTab === "community" && result.length > 3) result.splice(3, 0, { type: "suggest-topic" });
    else if (result.length > 5) result.splice(5, 0, { type: "suggest-topic" });

    return result;
  };

  const feedItems = buildFeed();

  const renderPostCard = (post: typeof feedPosts[0]) => {
    const isLiked = likedPosts.has(post.id);
    const isSaved = savedPosts.has(post.id);

    if (post.feedCategory === "local-news") {
      return <NewsPostCard key={post.id} post={post} liked={isLiked} saved={isSaved} onLike={() => toggleLike(post.id)} onSave={() => toggleSave(post.id)} />;
    }
    if (post.feedCategory === "community-update") {
      return <CommunityUpdateCard key={post.id} post={post} liked={isLiked} saved={isSaved} onLike={() => toggleLike(post.id)} onSave={() => toggleSave(post.id)} />;
    }

    return (
      <article key={post.id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-card animate-slide-up">
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
        {post.text && <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">{post.text}</p>}
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
          <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors">
            <Heart size={18} className={likedPosts.has(post.id) ? "text-red-500" : "text-muted-foreground"} fill={likedPosts.has(post.id) ? "currentColor" : "none"} />
            <span className="text-xs text-muted-foreground">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors">
            <MessageCircle size={18} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{post.comments}</span>
          </button>
          <button className="p-1.5 rounded-full hover:bg-secondary transition-colors"><Share2 size={18} className="text-muted-foreground" /></button>
          <div className="flex-1" />
          <button onClick={() => toggleSave(post.id)} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
            <Bookmark size={18} className={savedPosts.has(post.id) ? "text-primary" : "text-muted-foreground"} fill={savedPosts.has(post.id) ? "currentColor" : "none"} />
          </button>
        </div>
      </article>
    );
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
            <NotificationBell onClick={() => setShowNotifications(true)} />
          </div>
        </div>
      </header>
      <NotificationCenter open={showNotifications} onClose={() => setShowNotifications(false)} />

      {/* Feed Type Tabs */}
      <div className="sticky top-[57px] z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex max-w-lg mx-auto">
          {feedTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFeedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFeedTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-all relative ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                {isActive && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 gradient-gold rounded-full" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stories */}
      {(activeFeedTab === "all" || activeFeedTab === "posts") && <FeedStories />}

      {/* Sub-chips */}
      {(activeFeedTab === "all" || activeFeedTab === "posts") && (
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hide max-w-lg mx-auto">
          <div className="flex gap-2 w-max">
            {chips.map((chip) => (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeChip === chip ? "gradient-gold text-primary-foreground shadow-gold" : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Learn tab */}
      {activeFeedTab === "learn" && <CultureLearnScreen />}

      {/* Reels-only view */}
      {activeFeedTab === "reels" && (
        <div className="px-4 space-y-4 max-w-lg mx-auto pt-3">
          {reelItems.map((reel, idx) => (
            <ReelCard key={reel.id} reel={reel} onOpenFullScreen={() => setFullScreenReelIndex(idx)} />
          ))}
        </div>
      )}

      {/* Feed */}
      {activeFeedTab !== "reels" && activeFeedTab !== "learn" && (
        <div className="px-4 space-y-4 max-w-lg mx-auto">
          {activeFeedTab === "local-news" && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 flex items-start gap-3 animate-slide-up">
              <AlertTriangle size={20} className="text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-destructive">Crisis Updates</p>
                <p className="text-xs text-muted-foreground mt-1">Stay informed about urgent situations affecting the African diaspora worldwide.</p>
              </div>
            </div>
          )}

          {/* DB posts from real users */}
          {dbPosts.map((dbPost) => (
            <DbPostCard
              key={dbPost.id}
              post={dbPost}
              onLike={() => dbToggleLike(dbPost.id)}
              onComment={() => openComments(dbPost.id)}
            />
          ))}

          {feedItems.length === 0 && dbPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-sm">No posts match this filter yet</p>
              <button onClick={() => { setActiveChip("For You"); setActiveFeedTab("all"); }} className="mt-3 text-sm text-primary font-semibold">Show all posts</button>
            </div>
          ) : feedItems.map((item, idx) => {
            if (item.type === "suggest-topic") return <SuggestTopicCard key="suggest-topic" />;
            if (item.type === "reel") {
              const reelIndex = reelItems.findIndex(r => r.id === item.data.id);
              return <ReelCard key={item.data.id} reel={item.data} onOpenFullScreen={() => setFullScreenReelIndex(reelIndex)} />;
            }
            return renderPostCard(item.data);
          })}
        </div>
      )}

      {/* FAB to create post */}
      {user && activeFeedTab !== "learn" && (
        <button
          onClick={() => setShowCreatePost(true)}
          className="fixed bottom-24 right-4 z-30 w-14 h-14 rounded-full gradient-gold shadow-gold flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        >
          <PenSquare size={22} className="text-primary-foreground" />
        </button>
      )}

      {showCreatePost && (
        <CreatePostSheet
          cityId={selectedCity.id}
          cityName={selectedCity.name}
          onClose={() => setShowCreatePost(false)}
          onPostCreated={refetchPosts}
        />
      )}

      {commentingPost && (
        <CommentSheet
          postId={commentingPost}
          comments={comments}
          onClose={() => setCommentingPost(null)}
          onSubmit={async (content) => {
            await addComment(commentingPost, content);
            const updated = await fetchComments(commentingPost);
            setComments(updated);
          }}
        />
      )}

      {fullScreenReelIndex !== null && (
        <FullScreenReelViewer reels={reelItems} startIndex={fullScreenReelIndex} onClose={() => setFullScreenReelIndex(null)} />
      )}
    </div>
  );
};

export default FeedScreen;
