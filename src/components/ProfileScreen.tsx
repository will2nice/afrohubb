import { useState } from "react";
import { Settings, ChevronRight, Shield, Edit3, Heart, Calendar, Users, Crown, LogOut, X, Camera, Image, MapPin, Heart as HeartIcon, MessageCircle, Grid3X3, Bookmark, Handshake, Trophy, Briefcase } from "lucide-react";
import profileMan1 from "@/assets/profile-man-1.jpg";
import eventConcert from "@/assets/event-concert.jpg";
import eventBrunch from "@/assets/event-brunch.jpg";
import eventParty from "@/assets/event-party.jpg";
import eventAfricanArt from "@/assets/event-african-art.jpg";
import eventFootball from "@/assets/event-football.jpg";
import eventGrime from "@/assets/event-grime.jpg";
import reel1 from "@/assets/reel-1.jpg";
import reel2 from "@/assets/reel-2.jpg";
import reel3 from "@/assets/reel-3.jpg";

const stats = [
  { label: "Posts", value: "24" },
  { label: "Followers", value: "1.2K" },
  { label: "Following", value: "348" },
];

const menuItems = [
  { icon: Edit3, label: "Edit Profile", desc: "Photos, bio, prompts" },
  { icon: Heart, label: "Preferences", desc: "Dating, matching, filters" },
  { icon: Shield, label: "Safety & Privacy", desc: "Blocking, visibility" },
  { icon: Crown, label: "AfroHub Plus", desc: "Premium features", gold: true },
  { icon: Settings, label: "Settings", desc: "Account, notifications" },
  { icon: LogOut, label: "Log Out", desc: "", danger: true },
];

const interests = ["Afrobeats", "Tech", "Soccer", "Travel", "Fashion", "Cooking", "Entrepreneurship"];

interface FeedPost {
  id: number;
  photo: string;
  caption: string;
  location: string;
  likes: number;
  comments: number;
  timeAgo: string;
}

const modeFeedPosts: Record<string, FeedPost[]> = {
  dating: [
    { id: 1, photo: eventConcert, caption: "Burna Boy went crazy last night 🔥🎤 Best concert I've been to this year no cap", location: "Houston, TX", likes: 247, comments: 34, timeAgo: "2h" },
    { id: 2, photo: eventBrunch, caption: "Sunday brunch with the crew. Jollof rice pancakes hit different 🥞🇳🇬", location: "Austin, TX", likes: 189, comments: 22, timeAgo: "8h" },
    { id: 3, photo: reel1, caption: "Morning runs in the city. Grateful for this life fr 🏃‍♂️✨", location: "Dallas, TX", likes: 312, comments: 18, timeAgo: "1d" },
    { id: 4, photo: eventAfricanArt, caption: "Hit up the African Art Museum today. The diaspora is so rich with culture 🎨🌍", location: "Houston, TX", likes: 421, comments: 56, timeAgo: "2d" },
    { id: 5, photo: eventParty, caption: "Saturday night vibes. This DJ had the whole room moving 💃🕺", location: "Austin, TX", likes: 156, comments: 12, timeAgo: "3d" },
    { id: 6, photo: reel2, caption: "Made my grandma's egusi soup recipe today. Took me right back home 🍲❤️", location: "Houston, TX", likes: 534, comments: 89, timeAgo: "5d" },
    { id: 7, photo: reel3, caption: "New fits just dropped. Ankara meets streetwear 🪡🔥", location: "NYC", likes: 445, comments: 67, timeAgo: "1w" },
  ],
  community: [
    { id: 1, photo: eventFootball, caption: "Pickup soccer with the boys. We don't lose 😤⚽ Who's pulling up next weekend?", location: "San Antonio, TX", likes: 278, comments: 41, timeAgo: "3h" },
    { id: 2, photo: reel1, caption: "5AM gym crew. Iron sharpens iron 💪🏾 Brotherhood over everything", location: "Dallas, TX", likes: 198, comments: 27, timeAgo: "6h" },
    { id: 3, photo: eventGrime, caption: "Game night got intense 🎮😂 Smash Bros tournament at the crib — I went undefeated", location: "Houston, TX", likes: 342, comments: 53, timeAgo: "1d" },
    { id: 4, photo: eventBrunch, caption: "Sunday cookout with the squad. Suya on the grill, football on the screen 🥩🏈", location: "Austin, TX", likes: 467, comments: 72, timeAgo: "2d" },
    { id: 5, photo: reel2, caption: "Hiking with the crew. Views from the top hit different when you earn it 🏔️🤝", location: "Colorado Springs, CO", likes: 389, comments: 38, timeAgo: "4d" },
    { id: 6, photo: eventParty, caption: "Basketball league finals tonight. We brought the trophy home 🏆🔥", location: "Houston, TX", likes: 521, comments: 64, timeAgo: "5d" },
    { id: 7, photo: reel3, caption: "Volunteer day at the community center. Giving back is the move 🙏🏾💯", location: "Dallas, TX", likes: 612, comments: 91, timeAgo: "1w" },
  ],
  networking: [
    { id: 1, photo: eventAfricanArt, caption: "Spoke on a panel about Black tech founders today. Representation matters in every room 🎤💼", location: "Houston, TX", likes: 534, comments: 78, timeAgo: "4h" },
    { id: 2, photo: reel1, caption: "Coffee meeting with my mentor. The game changes when you have guidance 🏾☕📈", location: "Dallas, TX", likes: 287, comments: 45, timeAgo: "1d" },
    { id: 3, photo: eventConcert, caption: "AfroTech conference was insane. Made connections that'll change the trajectory 🚀🌍", location: "Austin, TX", likes: 678, comments: 112, timeAgo: "2d" },
    { id: 4, photo: eventBrunch, caption: "Investor lunch downtown. Pitched my startup and got follow-up meetings 🤝💰", location: "Houston, TX", likes: 423, comments: 56, timeAgo: "3d" },
    { id: 5, photo: reel2, caption: "Late nights building. The grind doesn't stop. New product launch coming soon 🖥️🔥", location: "NYC", likes: 356, comments: 34, timeAgo: "4d" },
    { id: 6, photo: eventGrime, caption: "Workshop on financial literacy for the diaspora. Knowledge is the real currency 📚💡", location: "Atlanta, GA", likes: 489, comments: 67, timeAgo: "5d" },
    { id: 7, photo: reel3, caption: "LinkedIn said 500+ connections but these real ones started right here 🤞🏾🔗", location: "Houston, TX", likes: 567, comments: 83, timeAgo: "1w" },
  ],
};

const ProfileScreen = () => {
  type ProfileMode = "dating" | "community" | "networking";
  const [showSettings, setShowSettings] = useState(false);
  const [profileMode, setProfileMode] = useState<ProfileMode>("dating");
  const [viewMode, setViewMode] = useState<"feed" | "grid">("feed");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const profileModes: { key: ProfileMode; icon: React.ReactNode; label: string; desc: string; color: string }[] = [
    { key: "dating", icon: <Heart size={18} />, label: "Dating", desc: "Looking for relationships", color: "from-red-500 to-pink-500" },
    { key: "community", icon: <Trophy size={18} />, label: "Community", desc: "Friends, sports, hangouts", color: "from-emerald-500 to-teal-500" },
    { key: "networking", icon: <Briefcase size={18} />, label: "Networking", desc: "Mentors & professionals", color: "from-blue-500 to-indigo-500" },
  ];

  const activeMode = profileModes.find(m => m.key === profileMode)!;

  const modeBios: Record<ProfileMode, string> = {
    dating: "Building startups & community. Living my best diaspora life ✨🌍",
    community: "Looking for pickup basketball, soccer, and guys to hang with. Brotherhood first 🏀⚽🤝",
    networking: "Entrepreneur & startup founder. Looking to connect with mentors, investors & ambitious minds 💼🚀",
  };

  const modeInterests: Record<ProfileMode, string[]> = {
    dating: ["Afrobeats", "Tech", "Soccer", "Travel", "Fashion", "Cooking", "Entrepreneurship"],
    community: ["Basketball", "Soccer", "Gym", "Hiking", "Game Nights", "Pickup Sports", "Brotherhood"],
    networking: ["Startups", "Tech", "Investing", "Mentorship", "Real Estate", "Marketing", "Leadership"],
  };

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <h1 className="font-display text-xl font-bold text-gradient-gold">Profile</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <Settings size={20} className="text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Settings dropdown sheet */}
      {showSettings && (
        <>
          <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50" onClick={() => setShowSettings(false)} />
          <div className="fixed top-0 left-0 right-0 z-50 animate-slide-up">
            <div className="max-w-lg mx-auto mt-14 mx-4">
              <div className="bg-card border border-border rounded-2xl shadow-elevated overflow-hidden mx-4">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <h3 className="font-display font-bold text-foreground text-base">Settings</h3>
                  <button onClick={() => setShowSettings(false)} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
                    <X size={18} className="text-muted-foreground" />
                  </button>
                </div>
                {menuItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors ${
                        i > 0 ? "border-t border-border/50" : ""
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        item.gold ? "gradient-gold" : "bg-secondary"
                      }`}>
                        <Icon size={18} className={item.gold ? "text-primary-foreground" : item.danger ? "text-destructive" : "text-muted-foreground"} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`text-sm font-medium ${item.gold ? "text-primary" : item.danger ? "text-destructive" : "text-foreground"}`}>
                          {item.label}
                        </p>
                        {item.desc && (
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        )}
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="max-w-lg mx-auto">
        {/* Profile card */}
        <div className="px-4 pt-6 pb-4">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={profileMan1}
                alt="Your profile"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-primary shadow-gold"
              />
              <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full gradient-gold flex items-center justify-center ring-2 ring-card">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="hsl(0,0%,5%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <h2 className="font-display text-xl font-bold text-foreground mt-3">Kofi Asante</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Houston, TX · 🇬🇭 Ghana</p>
            <p className="text-sm text-foreground/70 mt-2 text-center max-w-[280px]">{modeBios[profileMode]}</p>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-5">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Edit profile button */}
            <button className="mt-4 px-8 py-2 rounded-full border border-border bg-secondary text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Mode Switcher */}
        <div className="px-4 pb-3">
          <div className="bg-card border border-border rounded-2xl p-1.5 flex gap-1">
            {profileModes.map((mode) => (
              <button
                key={mode.key}
                onClick={() => setProfileMode(mode.key)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${
                  profileMode === mode.key
                    ? `bg-gradient-to-br ${mode.color} text-white shadow-lg`
                    : "text-muted-foreground hover:bg-secondary/50"
                }`}
              >
                {mode.icon}
                <span className="text-[11px] font-bold">{mode.label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">{activeMode.desc}</p>
        </div>

        {/* Interests */}
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {modeInterests[profileMode].map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-foreground"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Feed/Grid toggle */}
        <div className="border-t border-border">
          <div className="flex">
            <button
              onClick={() => setViewMode("feed")}
              className={`flex-1 py-3 flex items-center justify-center transition-colors border-b-2 ${
                viewMode === "feed" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              }`}
            >
              <Bookmark size={20} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex-1 py-3 flex items-center justify-center transition-colors border-b-2 ${
                viewMode === "grid" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              }`}
            >
              <Grid3X3 size={20} />
            </button>
          </div>
        </div>

        {/* ─── GRID VIEW ─── */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-3 gap-0.5">
            {(modeFeedPosts[profileMode] || []).map((post) => (
              <button key={post.id} onClick={() => setViewMode("feed")} className="aspect-square overflow-hidden">
                <img src={post.photo} alt="" className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
              </button>
            ))}
          </div>
        ) : (
          /* ─── FEED VIEW ─── */
          <div className="space-y-0">
            {(modeFeedPosts[profileMode] || []).map((post) => {
              const isLiked = likedPosts.has(post.id);
              return (
                <div key={post.id} className="border-b border-border">
                  {/* Post header */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <img src={profileMan1} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/30" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">Kofi Asante</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={10} />
                        <span>{post.location}</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
                  </div>

                  {/* Photo */}
                  <img
                    src={post.photo}
                    alt=""
                    className="w-full aspect-[4/3] object-cover"
                    onDoubleClick={() => toggleLike(post.id)}
                  />

                  {/* Actions */}
                  <div className="px-4 py-2.5">
                    <div className="flex items-center gap-4">
                      <button onClick={() => toggleLike(post.id)} className="transition-transform hover:scale-110 active:scale-90">
                        <HeartIcon
                          size={24}
                          className={isLiked ? "text-red-500" : "text-foreground"}
                          fill={isLiked ? "currentColor" : "none"}
                        />
                      </button>
                      <button className="transition-transform hover:scale-110">
                        <MessageCircle size={24} className="text-foreground" />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-foreground mt-1.5">
                      {isLiked ? (post.likes + 1).toLocaleString() : post.likes.toLocaleString()} likes
                    </p>
                    <p className="text-sm text-foreground mt-1">
                      <span className="font-semibold">Kofi Asante</span>{" "}
                      {post.caption}
                    </p>
                    <button className="text-xs text-muted-foreground mt-1">
                      View all {post.comments} comments
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* App version */}
        <p className="text-center text-xs text-muted-foreground mt-6 mb-4">AfroHub v1.0.0</p>
      </div>
    </div>
  );
};

export default ProfileScreen;
