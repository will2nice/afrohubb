import { Newspaper, MapPinned, Heart, MessageCircle, User, BookOpen, GraduationCap, HandHelping, Compass, Globe } from "lucide-react";

type Tab = "feed" | "map" | "match" | "explore" | "messages" | "news" | "culture" | "campus" | "help" | "profile";

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  unreadMessages?: number;
}

const tabs: { id: Tab; label: string; icon: typeof Newspaper }[] = [
  { id: "feed", label: "Feed", icon: Newspaper },
  { id: "map", label: "Map", icon: MapPinned },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "match", label: "Match", icon: Heart },
  { id: "messages", label: "Chat", icon: MessageCircle },
  { id: "news", label: "News", icon: Globe },
  { id: "culture", label: "Learn", icon: BookOpen },
  { id: "campus", label: "Campus", icon: GraduationCap },
  { id: "help", label: "Help", icon: HandHelping },
  { id: "profile", label: "Profile", icon: User },
];

const BottomNav = ({ activeTab, onTabChange, unreadMessages = 0 }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border safe-bottom">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          const showBadge = tab.id === "messages" && unreadMessages > 0;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? "text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {showBadge && (
                  <div className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] rounded-full gradient-gold flex items-center justify-center px-1">
                    <span className="text-[9px] font-bold text-primary-foreground">{unreadMessages > 9 ? "9+" : unreadMessages}</span>
                  </div>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "text-primary" : ""}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full gradient-gold mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
export type { Tab };
