import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Users, Gift, Share2, Copy, Check, Sparkles } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface SignupResult {
  referral_code: string;
  position: number;
  referral_count: number;
}

const Waitlist = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SignupResult | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("waitlist_signups")
        .insert({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          referred_by: refCode || null,
        })
        .select("referral_code, position, referral_count")
        .single();

      if (error) {
        if (error.code === "23505") {
          // Unique constraint - already signed up, fetch their info
          const { data: existing } = await supabase
            .from("waitlist_signups")
            .select("referral_code, position, referral_count")
            .eq("email", email.trim().toLowerCase())
            .single();
          if (existing) {
            setResult(existing);
            toast({ title: "Welcome back! 👋", description: "You're already on the list." });
            return;
          }
        }
        throw error;
      }

      setResult(data);
      toast({ title: "You're in! 🎉", description: "Welcome to the waitlist." });
    } catch (err: any) {
      toast({
        title: "Oops",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const referralLink = result
    ? `${window.location.origin}/waitlist?ref=${result.referral_code}`
    : "";

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Join AfroHub",
        text: "Join the AfroHub waitlist — connect with the diaspora community!",
        url: referralLink,
      });
    } else {
      copyLink();
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles size={36} className="text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold text-foreground">You're on the list!</h1>
            <p className="text-muted-foreground text-sm">
              You're <span className="font-bold text-primary">#{result.position}</span> on the waitlist
            </p>
          </div>

          {/* Referral stats */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Gift size={20} className="text-primary" />
              <span className="font-semibold text-foreground">Invite friends, move up</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Each friend who joins with your link moves you up the list. Get 5 referrals for early access.
            </p>

            <div className="bg-secondary rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{result.referral_count}</p>
                <p className="text-xs text-muted-foreground">Referrals</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-primary">#{result.position}</p>
                <p className="text-xs text-muted-foreground">Position</p>
              </div>
            </div>

            {/* Referral link */}
            <div className="bg-secondary rounded-xl p-3 flex items-center gap-2">
              <input
                readOnly
                value={referralLink}
                className="flex-1 bg-transparent text-xs text-foreground truncate outline-none"
              />
              <button
                onClick={copyLink}
                className="shrink-0 p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            <button
              onClick={shareLink}
              className="w-full py-3 rounded-xl gradient-gold text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Share2 size={16} />
              Share your link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Brand */}
        <div className="text-center space-y-3">
          <h1 className="font-display text-4xl font-bold text-gradient-gold">AfroHub</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The diaspora community app is coming soon. Join the waitlist to get early access.
          </p>
          {refCode && (
            <p className="text-xs text-primary font-medium">
              🎉 You were invited by a friend!
            </p>
          )}
        </div>

        {/* Perks */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-xl p-3 text-center space-y-1">
            <Users size={20} className="mx-auto text-primary" />
            <p className="text-xs font-medium text-foreground">Early Access</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center space-y-1">
            <Gift size={20} className="mx-auto text-primary" />
            <p className="text-xs font-medium text-foreground">Referral Rewards</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
          />
          <input
            type="tel"
            placeholder="Phone number (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gradient-gold text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Joining..." : "Join the Waitlist"}
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Already an admin?{" "}
          <a href="/auth" className="text-primary font-semibold hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Waitlist;
