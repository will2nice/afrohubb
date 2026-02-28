import { useState } from "react";
import { Search, Users, BadgeCheck } from "lucide-react";
import profileWoman1 from "@/assets/profile-woman-1.jpg";
import profileWoman2 from "@/assets/profile-woman-2.jpg";
import profileMan1 from "@/assets/profile-man-1.jpg";
import profileMan2 from "@/assets/profile-man-2.jpg";
import matchWoman1 from "@/assets/match-woman-1.jpg";
import matchWoman2 from "@/assets/match-woman-2.jpg";
import matchWoman3 from "@/assets/match-woman-3.jpg";
import matchMan1 from "@/assets/match-man-1.jpg";
import founderWilly from "@/assets/founder-willy.jpg";
import founderTom from "@/assets/founder-tom.jpg";
import DMChatScreen, { type ChatContact } from "@/components/DMChatScreen";

interface ChatItem {
  id: number;
  name: string;
  avatar: string | null;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  age?: number;
  vibe?: string;
  tab: "matches" | "events" | "requests" | "founders";
  isFounder?: boolean;
}

const founderChats: ChatItem[] = [
  { id: 100, name: "Willy", avatar: founderWilly, lastMessage: "Welcome to AfroHub! 🌍 I'm one of the founders — so glad you're here. Let's build this community together!", time: "Now", unread: 1, online: true, age: 28, vibe: "👑 Founder", tab: "founders", isFounder: true },
  { id: 101, name: "Tom", avatar: founderTom, lastMessage: "Hey! Welcome to the fam 🤝 I'm Tom, co-founder. Hit me up if you ever need anything!", time: "Now", unread: 1, online: true, age: 27, vibe: "👑 Founder", tab: "founders", isFounder: true },
];

const allChats: ChatItem[] = [
  // Matches
  { id: 1, name: "Amara", avatar: matchWoman1, lastMessage: "That sounds amazing! What time?", time: "2m", unread: 2, online: true, age: 24, vibe: "🎶 Vibes", tab: "matches" },
  { id: 2, name: "Kofi", avatar: profileMan1, lastMessage: "See you at the event 🎉", time: "1h", unread: 0, online: false, age: 27, vibe: "🏀 Sports", tab: "matches" },
  { id: 8, name: "Fatou", avatar: matchWoman2, lastMessage: "I love that playlist you shared 🎧", time: "3h", unread: 1, online: true, age: 28, vibe: "🎧 Music", tab: "matches" },
  { id: 9, name: "Zara", avatar: matchWoman3, lastMessage: "Are you going to Afro Nation?", time: "5h", unread: 0, online: false, age: 21, vibe: "🌟 Explorer", tab: "matches" },
  { id: 10, name: "Marcus", avatar: matchMan1, lastMessage: "Let's link at the brunch!", time: "1d", unread: 0, online: true, age: 26, vibe: "🔥 Hustle", tab: "matches" },
  // Event Chats
  { id: 3, name: "Afrobeats Night", avatar: null, lastMessage: "DJ set starts at 10!", time: "3h", unread: 5, online: false, tab: "events" },
  { id: 6, name: "Burna Boy Concert", avatar: null, lastMessage: "Section B squad, where you at? 🔥", time: "2h", unread: 12, online: false, tab: "events" },
  { id: 7, name: "Diaspora Brunch", avatar: null, lastMessage: "Table for 8 reserved ✅", time: "6h", unread: 3, online: false, tab: "events" },
  { id: 11, name: "Colors Festival", avatar: null, lastMessage: "VIP wristbands are ready!", time: "1d", unread: 0, online: false, tab: "events" },
  // Groups
  { id: 4, name: "Austin Diaspora", avatar: null, lastMessage: "Welcome to the new members!", time: "1d", unread: 0, online: false, tab: "events" },
  { id: 5, name: "Tech & Culture", avatar: null, lastMessage: "Check out this article on...", time: "2d", unread: 0, online: false, tab: "events" },
  // Requests
  { id: 12, name: "Nneka", avatar: profileWoman2, lastMessage: "Hey! I saw your profile, you seem cool 😊", time: "4h", unread: 1, online: true, age: 23, vibe: "💃 Dance", tab: "requests" },
  { id: 13, name: "Tunde", avatar: profileMan2, lastMessage: "We matched! How's it going?", time: "1d", unread: 1, online: false, age: 28, vibe: "💪 Fitness", tab: "requests" },
];

type MessageTab = "all" | "matches" | "events" | "requests";

const MessagesScreen = () => {
  const [openChat, setOpenChat] = useState<ChatContact | null>(null);
  const [activeTab, setActiveTab] = useState<MessageTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleChatOpen = (chat: ChatItem) => {
    if (!chat.avatar || !chat.age) return;
    setOpenChat({
      id: chat.id,
      name: chat.name,
      age: chat.age,
      photo: chat.avatar,
      vibe: chat.vibe || "",
      online: chat.online,
    });
  };

  if (openChat) {
    return <DMChatScreen contact={openChat} onBack={() => setOpenChat(null)} />;
  }

  const filteredChats = allChats
    .filter(c => activeTab === "all" || c.tab === activeTab)
    .filter(c => searchQuery === "" || c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Founders always show at top (filtered by search only)
  const filteredFounders = founderChats.filter(c => searchQuery === "" || c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Group chats by section for "all" view
  const sections = activeTab === "all"
    ? [
        { label: "Matches", chats: filteredChats.filter(c => c.tab === "matches") },
        { label: "Event Chats", chats: filteredChats.filter(c => c.tab === "events") },
        { label: "Requests", chats: filteredChats.filter(c => c.tab === "requests") },
      ].filter(s => s.chats.length > 0)
    : [{ label: activeTab.charAt(0).toUpperCase() + activeTab.slice(1), chats: filteredChats }];

  const totalUnread = allChats.reduce((sum, c) => sum + c.unread, 0);
  const matchUnread = allChats.filter(c => c.tab === "matches").reduce((sum, c) => sum + c.unread, 0);
  const eventUnread = allChats.filter(c => c.tab === "events").reduce((sum, c) => sum + c.unread, 0);
  const requestUnread = allChats.filter(c => c.tab === "requests").reduce((sum, c) => sum + c.unread, 0);

  const tabs: { id: MessageTab; label: string; count: number }[] = [
    { id: "all", label: "All", count: totalUnread },
    { id: "matches", label: "Matches", count: matchUnread },
    { id: "events", label: "Events", count: eventUnread },
    { id: "requests", label: "Requests", count: requestUnread },
  ];

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display text-xl font-bold text-gradient-gold mb-3">Messages</h1>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 py-3 max-w-lg mx-auto">
        <div className="flex gap-1 bg-secondary rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full gradient-gold text-[9px] font-bold text-primary-foreground">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat list */}
      <div className="max-w-lg mx-auto">
        {/* Founders - pinned at top */}
        {filteredFounders.length > 0 && (
          <div>
            <p className="px-4 py-2 text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1">
              <BadgeCheck size={12} /> From the Founders
            </p>
            {filteredFounders.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleChatOpen(chat)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors bg-primary/5 border-l-2 border-primary"
              >
                <div className="relative">
                  <img src={chat.avatar!} alt={chat.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/40" />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 ring-2 ring-card" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-foreground">{chat.name}</p>
                      <span className="px-1.5 py-0.5 rounded-md bg-primary/15 text-primary text-[9px] font-bold uppercase tracking-wide">Founder</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">{chat.time}</span>
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${chat.unread ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 rounded-full gradient-gold flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary-foreground">{chat.unread}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {sections.map((section) => (
          <div key={section.label}>
            <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.label}
            </p>
            {section.chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleChatOpen(chat)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors"
              >
                <div className="relative">
                  {chat.avatar ? (
                    <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-border" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                      <Users size={20} className="text-muted-foreground" />
                    </div>
                  )}
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full gradient-gold ring-2 ring-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-semibold text-foreground truncate ${chat.unread ? "" : "font-medium"}`}>
                      {chat.name}
                    </p>
                    <span className="text-xs text-muted-foreground ml-2">{chat.time}</span>
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${chat.unread ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 rounded-full gradient-gold flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary-foreground">{chat.unread}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesScreen;
