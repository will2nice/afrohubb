import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Image, Smile, MoreVertical, Loader2 } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface DMChatScreenProps {
  conversationId: string;
  contactName: string;
  contactPhoto: string;
  contactAge?: number;
  contactVibe?: string;
  isOnline?: boolean;
  eventContext?: string;
  onBack: () => void;
}

// Keep legacy export for other components that may import it
export interface ChatContact {
  id: number;
  name: string;
  age: number;
  photo: string;
  vibe: string;
  online?: boolean;
}

const quickReplies = [
  "Hey! How's it going? 👋",
  "Want to link up at an event?",
  "What's your vibe? 🔥",
  "Nice to meet you! 😊",
];

const DMChatScreen = ({
  conversationId,
  contactName,
  contactPhoto,
  contactAge,
  contactVibe,
  isOnline,
  eventContext,
  onBack,
}: DMChatScreenProps) => {
  const [input, setInput] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, loadingMessages, sendMessage } = useMessages(conversationId);
  const { user } = useAuth();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) setShowQuickReplies(false);
  }, [messages.length]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    sendMessage.mutate({ conversationId, content: text.trim() });
    setInput("");
    setShowQuickReplies(false);
  };

  const formatMsgTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "h:mm a");
    } catch {
      return "";
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background flex flex-col">
      {/* Header */}
      <header className="glass border-b border-border px-3 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <div className="relative">
          {contactPhoto ? (
            <img src={contactPhoto} alt={contactName} className="w-10 h-10 rounded-full object-cover ring-2 ring-border" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center ring-2 ring-border">
              <span className="text-sm font-bold text-muted-foreground">{contactName.charAt(0)}</span>
            </div>
          )}
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-card" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-foreground text-sm">
            {contactName}{contactAge ? `, ${contactAge}` : ""}
          </h2>
          <span className="text-[11px] text-muted-foreground">
            {isOnline ? "Online" : ""}{contactVibe ? ` · ${contactVibe}` : ""}
          </span>
        </div>
        <button className="p-2 rounded-full hover:bg-secondary transition-colors">
          <MoreVertical size={18} className="text-muted-foreground" />
        </button>
      </header>

      {/* Event context banner */}
      {eventContext && (
        <div className="px-4 py-2 bg-secondary/50 border-b border-border">
          <p className="text-[11px] text-muted-foreground text-center">
            🎫 Connected via <span className="text-primary font-semibold">{eventContext}</span>
          </p>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loadingMessages ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="text-primary animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full gradient-gold mx-auto flex items-center justify-center mb-3">
              <span className="text-2xl">👋</span>
            </div>
            <p className="text-foreground font-semibold text-sm">Start a conversation</p>
            <p className="text-muted-foreground text-xs mt-1">Say hi to {contactName}!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const fromMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${fromMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] ${fromMe ? "order-2" : "order-1"}`}>
                  {!fromMe && contactPhoto && (
                    <img src={contactPhoto} alt="" className="w-6 h-6 rounded-full object-cover mb-1" />
                  )}
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      fromMe
                        ? "gradient-gold text-primary-foreground rounded-br-md"
                        : "bg-secondary text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${fromMe ? "justify-end" : "justify-start"}`}>
                    <p className="text-[10px] text-muted-foreground">{formatMsgTime(msg.created_at)}</p>
                    {fromMe && <span className="text-[10px] text-primary">✓✓</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick replies */}
      {showQuickReplies && messages.length === 0 && (
        <div className="px-4 pb-2">
          <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider font-semibold">Quick replies</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleSend(reply)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full bg-secondary text-xs text-foreground border border-border hover:bg-muted transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="glass border-t border-border px-3 py-3 safe-bottom">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <Image size={20} className="text-muted-foreground" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder="Type a message..."
              className="w-full px-4 py-2.5 rounded-full bg-secondary text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all pr-10"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1">
              <Smile size={18} className="text-muted-foreground" />
            </button>
          </div>
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || sendMessage.isPending}
            className={`p-2.5 rounded-full transition-all ${
              input.trim() ? "gradient-gold shadow-gold" : "bg-secondary"
            }`}
          >
            <Send size={18} className={input.trim() ? "text-primary-foreground" : "text-muted-foreground"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DMChatScreen;
