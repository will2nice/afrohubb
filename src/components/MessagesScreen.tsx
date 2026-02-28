import { useState } from "react";
import { Search, Users } from "lucide-react";
import profileWoman1 from "@/assets/profile-woman-1.jpg";
import profileMan1 from "@/assets/profile-man-1.jpg";
import profileMan2 from "@/assets/profile-man-2.jpg";
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
}

const sections: { label: string; chats: ChatItem[] }[] = [
  {
    label: "Matches",
    chats: [
      { id: 1, name: "Amara", avatar: profileWoman1, lastMessage: "That sounds amazing! What time?", time: "2m", unread: 2, online: true, age: 24, vibe: "🎶 Vibes" },
      { id: 2, name: "Kofi", avatar: profileMan1, lastMessage: "See you at the event 🎉", time: "1h", unread: 0, online: false, age: 27, vibe: "🏀 Sports" },
    ],
  },
  {
    label: "Event Chats",
    chats: [
      { id: 3, name: "Afrobeats Night", avatar: null, lastMessage: "DJ set starts at 10!", time: "3h", unread: 5, online: false },
    ],
  },
  {
    label: "Groups",
    chats: [
      { id: 4, name: "Austin Diaspora", avatar: null, lastMessage: "Welcome to the new members!", time: "1d", unread: 0, online: false },
      { id: 5, name: "Tech & Culture", avatar: null, lastMessage: "Check out this article on...", time: "2d", unread: 0, online: false },
    ],
  },
];

const MessagesScreen = () => {
  const [openChat, setOpenChat] = useState<ChatContact | null>(null);

  const handleChatOpen = (chat: ChatItem) => {
    if (!chat.avatar || !chat.age) return; // Only open DM for person chats
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

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display text-xl font-bold text-gradient-gold mb-3">Messages</h1>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 py-3 max-w-lg mx-auto">
        <div className="flex gap-1 bg-secondary rounded-xl p-1">
          {["All", "Matches", "Events", "Requests"].map((tab, i) => (
            <button
              key={tab}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                i === 0
                  ? "bg-card text-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Chat list */}
      <div className="max-w-lg mx-auto">
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
