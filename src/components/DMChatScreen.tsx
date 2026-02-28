import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Image, Smile, MoreVertical } from "lucide-react";
import { type Attendee } from "@/data/eventAttendees";

export interface ChatContact {
  id: number;
  name: string;
  age: number;
  photo: string;
  vibe: string;
  online?: boolean;
}

interface DMChatScreenProps {
  contact: ChatContact;
  eventContext?: string;
  onBack: () => void;
}

interface Message {
  id: number;
  text: string;
  fromMe: boolean;
  time: string;
}

const getInitialMessages = (contact: ChatContact, eventContext?: string): Message[] => {
  if (eventContext) {
    return [
      { id: 1, text: `Hey ${contact.name}! 👋 I saw you're going to ${eventContext} too!`, fromMe: true, time: "Just now" },
    ];
  }
  return [];
};

const quickReplies = [
  "Hey! Are you going? 🎉",
  "Want to link up at the event?",
  "What's your vibe for tonight? 🔥",
  "Have you been to this venue before?",
];

const TypingIndicator = ({ photo }: { photo: string }) => (
  <div className="flex justify-start">
    <div className="max-w-[80%]">
      <img src={photo} alt="" className="w-6 h-6 rounded-full object-cover mb-1" />
      <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-secondary inline-flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  </div>
);

const DMChatScreen = ({ contact, eventContext, onBack }: DMChatScreenProps) => {
  const [messages, setMessages] = useState<Message[]>(() => getInitialMessages(contact, eventContext));
  const [input, setInput] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(messages.length <= 1);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  // Simulate typing then reply after sending
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].fromMe) {
      // Show typing after a short pause
      const typingTimer = setTimeout(() => {
        setIsTyping(true);
      }, 800);

      const replyTimer = setTimeout(() => {
        setIsTyping(false);
        const replies = [
          `Yesss! Can't wait! 🔥`,
          `Omg let's definitely link up! What section are you in?`,
          `For sure! I'll be there with a couple friends too 🙌`,
          `That sounds fun! DM me your IG so we can coordinate 📱`,
          `Haha I love that energy! See you there ✨`,
        ];
        const reply = replies[messages.length % replies.length];
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, text: reply, fromMe: false, time: "Just now" },
        ]);
      }, 2500 + Math.random() * 1500);

      return () => {
        clearTimeout(typingTimer);
        clearTimeout(replyTimer);
      };
    }
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, text: text.trim(), fromMe: true, time: "Just now" },
    ]);
    setInput("");
    setShowQuickReplies(false);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background flex flex-col">
      {/* Header */}
      <header className="glass border-b border-border px-3 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <div className="relative">
          <img src={contact.photo} alt={contact.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-border" />
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-card" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-foreground text-sm">{contact.name}, {contact.age}</h2>
          <span className="text-[11px] text-muted-foreground">
            {isTyping ? (
              <span className="text-primary font-medium">typing...</span>
            ) : (
              <>Online · {contact.vibe}</>
            )}
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
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full gradient-gold mx-auto flex items-center justify-center mb-3">
              <span className="text-2xl">👋</span>
            </div>
            <p className="text-foreground font-semibold text-sm">Start a conversation</p>
            <p className="text-muted-foreground text-xs mt-1">Say hi to {contact.name}!</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${msg.fromMe ? "order-2" : "order-1"}`}>
              {!msg.fromMe && (
                <img src={contact.photo} alt="" className="w-6 h-6 rounded-full object-cover mb-1" />
              )}
              <div
                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.fromMe
                    ? "gradient-gold text-primary-foreground rounded-br-md"
                    : "bg-secondary text-foreground rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
              <div className={`flex items-center gap-1 mt-1 ${msg.fromMe ? "justify-end" : "justify-start"}`}>
                <p className="text-[10px] text-muted-foreground">{msg.time}</p>
                {msg.fromMe && (
                  <span className="text-[10px] text-primary">✓✓</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator photo={contact.photo} />}
      </div>

      {/* Quick replies */}
      {showQuickReplies && (
        <div className="px-4 pb-2">
          <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider font-semibold">Quick replies</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => sendMessage(reply)}
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
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Type a message..."
              className="w-full px-4 py-2.5 rounded-full bg-secondary text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all pr-10"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1">
              <Smile size={18} className="text-muted-foreground" />
            </button>
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
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
