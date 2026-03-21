import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, Send, Sparkles, Crown, Bot } from "lucide-react";
import VoiceInputButton from "@/components/VoiceInputButton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { type City } from "@/data/cityData";
import ReactMarkdown from "react-markdown";

interface Props {
  selectedCity: City;
  onBack: () => void;
}

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/concierge-chat`;

const QUICK_PROMPTS = [
  "What's the best nightlife this weekend?",
  "Find me a speakeasy or hidden bar",
  "Plan a birthday dinner for 6 people",
  "What Afrobeats events are coming up?",
];

const ConciergeScreen = ({ selectedCity, onBack }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText || streaming || !user) return;

    const userMsg: Msg = { role: "user", content: msgText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setStreaming(true);

    let assistantContent = "";

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          message: msgText,
          city: selectedCity.id,
          history: updatedMessages.slice(0, -1), // exclude the current user message
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Failed" }));
        throw new Error(err.error || `Error ${resp.status}`);
      }
      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamComplete = false;

      while (!streamComplete) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamComplete = true;
            await reader.cancel();
            break;
          }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) updateAssistant(content);
          } catch { /* partial */ }
        }
      }
    } catch (err: any) {
      toast({ title: "Chat error", description: err.message, variant: "destructive" });
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && !last.content) return prev.slice(0, -1);
        return prev;
      });
    } finally {
      setStreaming(false);
    }
  }, [input, streaming, user, selectedCity.id, messages, toast]);

  const handleSubmitRequest = async () => {
    if (!user) return;
    try {
      const { error } = await supabase.from("concierge_requests" as any).insert({
        user_id: user.id,
        city: selectedCity.id,
        interests: ["concierge-chat"],
        special_notes: messages.map(m => `${m.role}: ${m.content}`).join("\n").substring(0, 2000),
        status: "pending",
        payment_status: "unpaid",
      } as any);
      if (error) throw error;
      toast({ title: "Request submitted! 🎉", description: "A human concierge will follow up in your messages." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <button onClick={onBack} className="p-1">
          <ArrowLeft size={20} />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-sm">
            {selectedCity.flag} {selectedCity.name} Concierge
          </h2>
          <p className="text-xs text-muted-foreground">AI Agent • Events • Nightlife • Dining</p>
        </div>
        <button
          onClick={handleSubmitRequest}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition"
        >
          <Crown size={14} className="text-primary" />
          <span className="text-xs font-semibold text-primary">Get Human — $25</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 opacity-80">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Your Personal Concierge</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Tell me what you're looking for in {selectedCity.name} — parties, dinners, speakeasies, anything!
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-sm">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted rounded-bl-md"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-1 [&>ul]:mt-1">
                  <ReactMarkdown>{msg.content || "..."}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-3 bg-card">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="flex gap-2"
        >
          <VoiceInputButton
            onTranscript={(text) => setInput((prev) => (prev ? prev + " " + text : text))}
          />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`What are you looking for in ${selectedCity.name}?`}
            className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full shrink-0"
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ConciergeScreen;
