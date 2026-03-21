import { useState, useRef } from "react";
import { Settings, ChevronRight, Shield, Edit3, Heart, Calendar, Users, Crown, LogOut, X, Camera, MapPin, Heart as HeartIcon, MessageCircle, Grid3X3, Bookmark, Trophy, Briefcase, Sun, Ticket, BookOpen, Share2, Smartphone, Image, Plus, CalendarCheck, CalendarClock } from "lucide-react";
import InviteFriends from "@/components/InviteFriends";
import TapShareCard from "@/components/TapShareCard";
import { useNavigate } from "react-router-dom";
import PromoterDashboard from "@/components/PromoterDashboard";
import MyTicketsScreen from "@/components/MyTicketsScreen";
import CheckInScreen from "@/components/CheckInScreen";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useEvents } from "@/hooks/useEvents";
import { useToast } from "@/hooks/use-toast";
import { usePosts } from "@/hooks/usePosts";
import SubscriptionModal from "@/components/SubscriptionModal";
import VerifiedBadge from "@/components/VerifiedBadge";
import ProfileCompleteness from "@/components/ProfileCompleteness";
import profileMan1 from "@/assets/profile-man-1.jpg";
import { format, isPast, isFuture } from "date-fns";

const menuItems = [
  { icon: Edit3, label: "Edit Profile", desc: "Photos, bio, prompts" },
  { icon: Ticket, label: "My Tickets", desc: "QR codes, reservations", action: "mytickets" },
  { icon: Ticket, label: "Promoter Dashboard", desc: "Tickets, sales, payouts", action: "promoter" },
  { icon: Users, label: "Check-In", desc: "Scan QR, manage attendance", action: "checkin" },
  { icon: Heart, label: "Preferences", desc: "Matching, filters" },
  { icon: Shield, label: "Safety & Privacy", desc: "Blocking, visibility" },
  { icon: BookOpen, label: "Community Guidelines", desc: "Our community standards", action: "guidelines" },
  { icon: Crown, label: "AfroHub Plus", desc: "Premium features", gold: true, action: "subscription" },
  { icon: Settings, label: "Settings", desc: "Account, notifications" },
  { icon: Sun, label: "Appearance", desc: "Light / Dark mode", action: "theme" },
  { icon: LogOut, label: "Log Out", desc: "", danger: true, action: "logout" },
];

type ProfileTab = "events" | "posts";

const ProfileScreen = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>("events");
  const [eventFilter, setEventFilter] = useState<"upcoming" | "past">("upcoming");
  const [showTapCard, setShowTapCard] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { profile, updateProfile, uploadAvatar } = useProfile();
  const { events, rsvpEventIds } = useEvents();
  const { posts, createPost } = usePosts();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const postImageRef = useRef<HTMLInputElement>(null);

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

  const handlePostImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await createPost("", file, profile?.city || undefined);
      toast({ title: "Posted! 🔥" });
    } catch (err: any) {
      toast({ title: "Post failed", description: err.message, variant: "destructive" });
    }
  };

  const { theme, toggleTheme } = useTheme();

  const [showSubscription, setShowSubscription] = useState(false);
  const [showPromoter, setShowPromoter] = useState(false);
  const [showMyTickets, setShowMyTickets] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);

  const handleMenuAction = async (action?: string) => {
    if (action === "logout") {
      await signOut();
    } else if (action === "theme") {
      toggleTheme();
    } else if (action === "subscription") {
      setShowSubscription(true);
    } else if (action === "promoter") {
      setShowPromoter(true);
    } else if (action === "mytickets") {
      setShowMyTickets(true);
    } else if (action === "checkin") {
      setShowCheckIn(true);
    } else if (action === "guidelines") {
      navigate("/community-guidelines");
    }
  };

  if (showPromoter) return <PromoterDashboard onBack={() => setShowPromoter(false)} />;
  if (showMyTickets) return <MyTicketsScreen onBack={() => setShowMyTickets(false)} />;
  if (showCheckIn) return <CheckInScreen onBack={() => setShowCheckIn(false)} />;

  const displayName = profile?.display_name || "Your Name";
  const displayCity = profile?.city || "Set your city";
  const displayBio = profile?.bio || "Living my best life 🌍✨";
  const avatarUrl = profile?.avatar_url || profileMan1;

  // Filter events user is attending (RSVP'd)
  const myEvents = events.filter((e) => rsvpEventIds.includes(e.id));
  const upcomingEvents = myEvents.filter((e) => isFuture(new Date(e.date)));
  const pastEvents = myEvents.filter((e) => isPast(new Date(e.date)));
  const filteredEvents = eventFilter === "upcoming" ? upcomingEvents : pastEvents;

  // User's posts
  const myPosts = posts.filter((p) => p.user_id === user?.id);

  // Stats
  const stats = [
    { label: "Events", value: myEvents.length.toString() },
    { label: "Views", value: "5" },
    { label: "Followers", value: "0" },
    { label: "Following", value: "0" },
  ];

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Share2 size={20} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => setShowTapCard(true)} />
          <h1 className="font-display text-lg font-bold text-foreground">{profile?.username || displayName}</h1>
          <button onClick={() => setShowSettings(!showSettings)} className="p-1 rounded-full hover:bg-secondary transition-colors">
            <Settings size={20} className="text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Settings dropdown */}
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
                      className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors ${i > 0 ? "border-t border-border/50" : ""}`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.gold ? "gradient-gold" : "bg-secondary"}`}>
                        <Icon size={18} className={item.gold ? "text-primary-foreground" : item.danger ? "text-destructive" : "text-muted-foreground"} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`text-sm font-medium ${item.gold ? "text-primary" : item.danger ? "text-destructive" : "text-foreground"}`}>{item.label}</p>
                        {item.desc && <p className="text-xs text-muted-foreground">{item.desc}</p>}
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
        {/* Profile hero */}
        <div className="relative">
          {/* Large avatar / cover area */}
          <div className="aspect-[4/3] w-full overflow-hidden bg-secondary">
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full gradient-gold flex items-center justify-center ring-2 ring-background shadow-lg"
          >
            <Camera size={16} className="text-primary-foreground" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </div>

        {/* Name & stats */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-bold text-foreground">{displayName}</h2>
            {profile?.is_verified && <VerifiedBadge size={20} />}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 mt-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-left">
                <span className="text-sm font-bold text-primary">{stat.value}</span>
                <span className="text-sm text-muted-foreground ml-1">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Profile completeness */}
          <div className="mt-3">
            <ProfileCompleteness profile={profile} compact onEditProfile={openEditProfile} />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            <button onClick={openEditProfile} className="flex-1 py-2.5 rounded-xl border border-border bg-secondary text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors">
              Edit Profile
            </button>
            <button onClick={() => setShowSettings(true)} className="flex-1 py-2.5 rounded-xl border border-border bg-secondary text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors">
              Settings
            </button>
          </div>
        </div>

        {/* Tab Switcher: Events / Posts */}
        <div className="border-t border-border">
          <div className="flex">
            <button
              onClick={() => setActiveTab("events")}
              className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors border-b-2 ${
                activeTab === "events" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              }`}
            >
              <Calendar size={20} />
              <span className="text-sm font-semibold">Events</span>
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors border-b-2 ${
                activeTab === "posts" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              }`}
            >
              <Grid3X3 size={20} />
              <span className="text-sm font-semibold">Posts</span>
            </button>
          </div>
        </div>

        {/* ─── EVENTS TAB ─── */}
        {activeTab === "events" && (
          <div>
            {/* Upcoming / Past filter */}
            <div className="flex gap-2 px-4 py-3">
              <button
                onClick={() => setEventFilter("upcoming")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  eventFilter === "upcoming"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                <CalendarClock size={14} />
                Upcoming ({upcomingEvents.length})
              </button>
              <button
                onClick={() => setEventFilter("past")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  eventFilter === "past"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                <CalendarCheck size={14} />
                Attended ({pastEvents.length})
              </button>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="px-4 py-16 text-center">
                <Calendar size={48} className="mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-medium">
                  {eventFilter === "upcoming" ? "No upcoming events" : "No past events"}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {eventFilter === "upcoming" ? "RSVP to events to see them here" : "Events you've attended will show here"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-0.5">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="aspect-square overflow-hidden relative group">
                    {event.image_url ? (
                      <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Calendar size={24} className="text-primary/50" />
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                      <p className="text-white text-[10px] font-bold leading-tight line-clamp-2">{event.title}</p>
                      <p className="text-white/70 text-[9px] mt-0.5">{format(new Date(event.date), "MMM d")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── POSTS TAB ─── */}
        {activeTab === "posts" && (
          <div>
            {/* Upload button */}
            <div className="px-4 py-3">
              <button
                onClick={() => postImageRef.current?.click()}
                className="w-full py-3 rounded-xl border-2 border-dashed border-primary/30 text-primary flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
              >
                <Plus size={18} />
                <span className="text-sm font-semibold">Post a Photo</span>
              </button>
              <input ref={postImageRef} type="file" accept="image/*,video/*" className="hidden" onChange={handlePostImage} />
            </div>

            {myPosts.length === 0 ? (
              <div className="px-4 py-16 text-center">
                <Image size={48} className="mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-medium">No posts yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Share your moments with the community</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-0.5">
                {myPosts.map((post) => (
                  <div key={post.id} className="aspect-square overflow-hidden relative group">
                    {post.image_url ? (
                      <img src={post.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center p-2">
                        <p className="text-xs text-muted-foreground line-clamp-4 text-center">{post.content}</p>
                      </div>
                    )}
                    {/* Overlay with likes/comments */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <div className="flex items-center gap-1 text-white text-xs font-bold">
                        <HeartIcon size={14} fill="white" />
                        {post.likes_count}
                      </div>
                      <div className="flex items-center gap-1 text-white text-xs font-bold">
                        <MessageCircle size={14} fill="white" />
                        {post.comments_count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
      {showTapCard && <TapShareCard onClose={() => setShowTapCard(false)} />}
    </div>
  );
};

export default ProfileScreen;
