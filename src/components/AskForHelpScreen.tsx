import { useState, useEffect } from "react";
import { useScreenView } from "@/hooks/useAnalytics";
import { trackEvent } from "@/lib/posthog";
import { HandHelping, Plus, X, ChevronDown, MapPin, Clock, User, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/hooks/useMessages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface HelpRequest {
  id: string;
  user_id: string;
  category: string;
  title: string;
  description: string;
  city: string;
  status: string;
  created_at: string;
  profile?: { display_name: string; avatar_url: string | null };
}

const CATEGORIES = [
  { id: "job", label: "Job Search", emoji: "💼" },
  { id: "investor", label: "Investors", emoji: "💰" },
  { id: "housing", label: "Housing", emoji: "🏠" },
  { id: "bills", label: "Bills & Finance", emoji: "💳" },
  { id: "legal", label: "Legal Help", emoji: "⚖️" },
  { id: "mentorship", label: "Mentorship", emoji: "🎓" },
  { id: "community", label: "Community", emoji: "🤝" },
  { id: "general", label: "General", emoji: "✨" },
];

interface AskForHelpScreenProps {
  onOpenDM?: (conversationId: string) => void;
}

const AskForHelpScreen = ({ onOpenDM }: AskForHelpScreenProps) => {
  const { user } = useAuth();
  const { startConversation, sendMessage } = useMessages();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [city, setCity] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    let q = supabase
      .from("help_requests")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false });
    if (filterCat) q = q.eq("category", filterCat);
    const { data } = await q;
    if (data) {
      // fetch profiles for each unique user_id
      const userIds = [...new Set(data.map((r) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", userIds);
      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
      setRequests(
        data.map((r) => ({
          ...r,
          profile: profileMap.get(r.user_id) as HelpRequest["profile"],
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [filterCat]);

  // realtime
  useEffect(() => {
    const channel = supabase
      .channel("help_requests_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "help_requests" }, () => {
        fetchRequests();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [filterCat]);

  const handleSubmit = async () => {
    if (!user) { toast.error("Sign in to ask for help"); return; }
    if (!title.trim()) { toast.error("Add a title"); return; }
    if (!description.trim()) { toast.error("Describe what you need"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("help_requests").insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim(),
      category,
      city: city.trim(),
    });
    setSubmitting(false);
    if (error) { toast.error("Failed to post request"); return; }
    toast.success("Help request posted!");
    setTitle(""); setDescription(""); setCategory("general"); setCity(""); setShowForm(false);
  };

  const handleOfferHelp = async (req: HelpRequest) => {
    if (!user) { toast.error("Sign in to offer help"); return; }
    if (req.user_id === user.id) { toast.info("This is your own request"); return; }
    try {
      const convId = await startConversation(req.user_id);
      const cat = catInfo(req.category);
      await sendMessage.mutateAsync({
        conversationId: convId,
        content: `👋 Hey! I saw your help request "${req.title}" (${cat.emoji} ${cat.label}) and I'd like to help!`,
      });
      toast.success("DM started!");
      onOpenDM?.(convId);
    } catch (e) {
      toast.error("Failed to start conversation");
    }
  };

  const timeAgo = (d: string) => {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  const catInfo = (id: string) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-lg border-b border-border px-4 pt-12 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <HandHelping size={22} className="text-primary" /> Ask for Help
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">Your community has your back</p>
          </div>
          <Button
            size="sm"
            className="rounded-full gap-1.5"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Close" : "Ask"}
          </Button>
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="mx-4 mt-4 p-4 rounded-2xl bg-card border border-border space-y-3 animate-in slide-in-from-top-2">
          <p className="text-sm font-semibold text-foreground">What do you need help with?</p>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  category === c.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>

          <Input
            placeholder="Title – e.g. Looking for a web dev mentor"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-secondary border-none"
          />
          <Textarea
            placeholder="Describe what you need, how someone can help, and any relevant details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-secondary border-none min-h-[100px]"
          />
          <Input
            placeholder="City (optional)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-secondary border-none"
          />
          <Button className="w-full rounded-xl" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Posting..." : "Post Help Request"}
          </Button>
        </div>
      )}

      {/* Filter pills */}
      <div className="px-4 mt-4 flex gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilterCat(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            !filterCat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCat(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filterCat === c.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Requests list */}
      <div className="px-4 mt-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16">
            <HandHelping size={40} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No requests yet. Be the first to ask!</p>
          </div>
        ) : (
          requests.map((req) => {
            const cat = catInfo(req.category);
            return (
              <div key={req.id} className="bg-card rounded-2xl border border-border p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                      {req.profile?.avatar_url ? (
                        <img src={req.profile.avatar_url} className="w-full h-full object-cover" />
                      ) : (
                        <User size={14} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {req.profile?.display_name || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <Clock size={10} /> {timeAgo(req.created_at)}
                        {req.city && (
                          <>
                            <span>·</span>
                            <MapPin size={10} /> {req.city}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-secondary-foreground whitespace-nowrap">
                    {cat.emoji} {cat.label}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground">{req.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{req.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-1.5 text-xs mt-1"
                  onClick={() => handleOfferHelp(req)}
                  disabled={req.user_id === user?.id}
                >
                  <MessageCircle size={13} /> {req.user_id === user?.id ? "Your Request" : "Offer Help"}
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AskForHelpScreen;
