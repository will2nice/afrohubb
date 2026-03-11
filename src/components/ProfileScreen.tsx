import { useState, useRef } from "react";
import { Settings, ChevronRight, Shield, Edit3, Heart, Calendar, Users, Crown, LogOut, X, Camera, Image, MapPin, Heart as HeartIcon, MessageCircle, Grid3X3, Bookmark, Handshake, Trophy, Briefcase, Sun, Moon, Ticket, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PromoterDashboard from "@/components/PromoterDashboard";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import SubscriptionModal from "@/components/SubscriptionModal";
import VerifiedBadge from "@/components/VerifiedBadge";
import ProfileCompleteness from "@/components/ProfileCompleteness";
import profileMan1 from "@/assets/profile-man-1.jpg";

// Dating mode removed - keeping imports for potential future use

// Community mode photos - activities, sports, hangouts
import communityBasketball from "@/assets/community-basketball.jpg";
import communityGamenight from "@/assets/community-gamenight.jpg";
import communityNightout from "@/assets/community-nightout.jpg";
import communitySoccer from "@/assets/community-soccer.jpg";
import communityFifa from "@/assets/community-fifa.jpg";

// Networking mode photos - professional, headshots, conferences
import networkingHeadshot from "@/assets/networking-headshot.jpg";
import networkingCollege from "@/assets/networking-college.jpg";
import networkingConference from "@/assets/networking-conference.jpg";
import networkingPanel from "@/assets/networking-panel.jpg";
import networkingTeam from "@/assets/networking-team.jpg";

const stats = [
  { label: "Posts", value: "24" },
  { label: "Followers", value: "1.2K" },
  { label: "Following", value: "348" },
];

const menuItems = [
  { icon: Edit3, label: "Edit Profile", desc: "Photos, bio, prompts" },
  { icon: Ticket, label: "Promoter Dashboard", desc: "Tickets, sales, payouts", action: "promoter" },
  { icon: Heart, label: "Preferences", desc: "Matching, filters" },
  { icon: Shield, label: "Safety & Privacy", desc: "Blocking, visibility" },
  { icon: BookOpen, label: "Community Guidelines", desc: "Our community standards", action: "guidelines" },
  { icon: Crown, label: "AfroHub Plus", desc: "Premium features", gold: true, action: "subscription" },
  { icon: Settings, label: "Settings", desc: "Account, notifications" },
  { icon: Sun, label: "Appearance", desc: "Light / Dark mode", action: "theme" },
  { icon: LogOut, label: "Log Out", desc: "", danger: true, action: "logout" },
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
  community: [
    { id: 1, photo: communityBasketball, caption: "Pickup game with the boys. We don't lose 😤🏀 Who's pulling up next weekend?", location: "San Antonio, TX", likes: 378, comments: 48, timeAgo: "3h" },
    { id: 2, photo: communityGamenight, caption: "Game night got intense! Football on the screen, wings on the table 🏈🍗", location: "Houston, TX", likes: 298, comments: 37, timeAgo: "6h" },
    { id: 3, photo: communityNightout, caption: "Boys night out. Good vibes, good drinks, good company 🍻🤝", location: "Dallas, TX", likes: 442, comments: 53, timeAgo: "1d" },
    { id: 4, photo: communitySoccer, caption: "Sunday league action. Left the defender in the dust ⚽💨", location: "Austin, TX", likes: 367, comments: 42, timeAgo: "2d" },
    { id: 5, photo: communityFifa, caption: "FIFA tournament at the crib. I went undefeated 🎮😂 No cap", location: "Houston, TX", likes: 289, comments: 64, timeAgo: "4d" },
  ],
  networking: [
    { id: 1, photo: networkingHeadshot, caption: "New headshot just dropped. Ready for what's next 💼📸", location: "Houston, TX", likes: 534, comments: 78, timeAgo: "4h" },
    { id: 2, photo: networkingCollege, caption: "Campus days shaped the vision. Forever grateful for the foundation 🎓📚", location: "Dallas, TX", likes: 287, comments: 45, timeAgo: "1d" },
    { id: 3, photo: networkingConference, caption: "AfroTech conference was insane. Made connections that'll change the trajectory 🚀🤝", location: "Austin, TX", likes: 678, comments: 112, timeAgo: "2d" },
    { id: 4, photo: networkingPanel, caption: "Spoke on a panel about Black tech founders today. Representation matters in every room 🎤💡", location: "Houston, TX", likes: 723, comments: 96, timeAgo: "3d" },
    { id: 5, photo: networkingTeam, caption: "Team meeting energy. Building something special with these brilliant minds 🖥️🔥", location: "Atlanta, GA", likes: 456, comments: 67, timeAgo: "5d" },
  ],
};

type ProfileMode = "community" | "networking";

const modeBios: Record<ProfileMode, string> = {
  community: "Looking for pickup basketball, soccer, and guys to hang with. Brotherhood first 🏀⚽🤝",
  networking: "Entrepreneur & startup founder. Looking to connect with mentors, investors & ambitious minds 💼🚀",
};

const modeInterests: Record<ProfileMode, string[]> = {
  community: ["Basketball", "Soccer", "Gym", "Hiking", "Game Nights", "Pickup Sports", "Brotherhood"],
  networking: ["Startups", "Tech", "Investing", "Mentorship", "Real Estate", "Marketing", "Leadership"],
};

const ProfileScreen = () => {
  // ProfileMode type is defined above the component
  const [showSettings, setShowSettings] = useState(false);
  const [profileMode, setProfileMode] = useState<ProfileMode>("community");
  const [viewMode, setViewMode] = useState<"feed" | "grid">("feed");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { profile, updateProfile, uploadAvatar } = useProfile();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editAge, setEditAge] = useState("");

  const openEditProfile = () => {
    setEditName(profile?.display_name || "");
    setEditBio(profile?.bio || "");
    setEditCity(profile?.city || "");
    setEditAge(profile?.age?.toString() || "");
    setShowEditProfile(true);
  };

  const saveProfile = async () => {
    try {
      await updateProfile.mutateAsync({
        display_name: editName,
        bio: editBio,
        city: editCity,
        age: editAge ? parseInt(editAge) : null,
        profile_mode: profileMode,
      });
      setShowEditProfile(false);
      toast({ title: "Profile updated! ✨" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadAvatar(file);
      toast({ title: "Photo updated! 📸" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    }
  };

  const { theme, toggleTheme } = useTheme();

  const [showSubscription, setShowSubscription] = useState(false);
  const [showPromoter, setShowPromoter] = useState(false);

  const handleMenuAction = async (action?: string) => {
    if (action === "logout") {
      await signOut();
    } else if (action === "theme") {
      toggleTheme();
    } else if (action === "subscription") {
      setShowSubscription(true);
    } else if (action === "promoter") {
      setShowPromoter(true);
    } else if (action === "guidelines") {
      navigate("/community-guidelines");
    }
  };

  if (showPromoter) {
    return <PromoterDashboard onBack={() => setShowPromoter(false)} />;
  }

  const displayName = profile?.display_name || "Your Name";
  const displayCity = profile?.city || "Set your city";
  const displayBio = profile?.bio || modeBios[profileMode];
  const avatarUrl = profile?.avatar_url || profileMan1;

  const profileModes: { key: ProfileMode; icon: React.ReactNode; label: string; desc: string; color: string }[] = [
    { key: "community", icon: <Trophy size={18} />, label: "Community", desc: "Friends, sports, hangouts", color: "from-emerald-500 to-teal-500" },
    { key: "networking", icon: <Briefcase size={18} />, label: "Networking", desc: "Mentors & professionals", color: "from-blue-500 to-indigo-500" },
  ];

  const activeMode = profileModes.find(m => m.key === profileMode)!;

  // modeBios and modeInterests are defined above the component

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
                      onClick={() => { handleMenuAction((item as any).action); setShowSettings(false); }}
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
                src={avatarUrl}
                alt="Your profile"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-primary shadow-gold"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full gradient-gold flex items-center justify-center ring-2 ring-card"
              >
                <Camera size={12} className="text-primary-foreground" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <h2 className="font-display text-xl font-bold text-foreground">{displayName}</h2>
              {profile?.is_verified && <VerifiedBadge size={18} />}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{displayCity}</p>
            <p className="text-sm text-foreground/70 mt-2 text-center max-w-[280px]">{displayBio}</p>

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
            <button onClick={openEditProfile} className="mt-4 px-8 py-2 rounded-full border border-border bg-secondary text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors">
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

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 bg-background/95 overflow-y-auto">
          <div className="max-w-lg mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-gradient-gold">Edit Profile</h2>
              <button onClick={() => setShowEditProfile(false)} className="p-2 rounded-full bg-secondary">
                <X size={20} className="text-foreground" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Display Name</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full py-3 px-4 rounded-xl bg-secondary text-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Bio</label>
                <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3} className="w-full py-3 px-4 rounded-xl bg-secondary text-foreground border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">City</label>
                  <input value={editCity} onChange={e => setEditCity(e.target.value)} placeholder="Houston, TX" className="w-full py-3 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Age</label>
                  <input type="number" value={editAge} onChange={e => setEditAge(e.target.value)} className="w-full py-3 px-4 rounded-xl bg-secondary text-foreground border border-border text-sm focus:outline-none" />
                </div>
              </div>
              <button onClick={saveProfile} disabled={updateProfile.isPending} className="w-full py-3 rounded-xl gradient-gold text-primary-foreground font-bold text-sm disabled:opacity-50">
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
      <SubscriptionModal open={showSubscription} onOpenChange={setShowSubscription} />
    </div>
  );
};

export default ProfileScreen;
