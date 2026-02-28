import { Settings, ChevronRight, Shield, Edit3, Heart, Calendar, Users, Crown, LogOut } from "lucide-react";
import profileMan1 from "@/assets/profile-man-1.jpg";

const stats = [
  { label: "Posts", value: "24" },
  { label: "Events", value: "12" },
  { label: "Groups", value: "5" },
];

const menuItems = [
  { icon: Edit3, label: "Edit Profile", desc: "Photos, bio, prompts" },
  { icon: Heart, label: "Preferences", desc: "Dating, matching, filters" },
  { icon: Shield, label: "Safety & Privacy", desc: "Blocking, visibility" },
  { icon: Crown, label: "AfroHub Plus", desc: "Premium features", gold: true },
  { icon: Settings, label: "Settings", desc: "Account, notifications" },
  { icon: LogOut, label: "Log Out", desc: "" },
];

const interests = ["Afrobeats", "Tech", "Soccer", "Travel", "Fashion", "Cooking", "Entrepreneurship"];

const ProfileScreen = () => {
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <h1 className="font-display text-xl font-bold text-gradient-gold">Profile</h1>
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <Settings size={20} className="text-muted-foreground" />
          </button>
        </div>
      </header>

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
            <p className="text-sm text-muted-foreground mt-0.5">Houston, TX · he/him</p>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-5">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="px-4 pb-4">
          <div className="bg-card rounded-2xl border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Interests</p>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="px-4">
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors ${
                    i > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    item.gold ? "gradient-gold" : "bg-secondary"
                  }`}>
                    <Icon size={18} className={item.gold ? "text-primary-foreground" : "text-muted-foreground"} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-medium ${item.gold ? "text-primary" : "text-foreground"}`}>
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

        {/* App version */}
        <p className="text-center text-xs text-muted-foreground mt-6 mb-4">AfroHub v1.0.0</p>
      </div>
    </div>
  );
};

export default ProfileScreen;
