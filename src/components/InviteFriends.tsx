import { useState } from "react";
import {
  Copy,
  Check,
  Share2,
  MessageSquare,
  Send,
  Instagram,
  Link,
  Trophy,
  Users,
  ArrowRight,
  X,
  Crown,
  Star,
} from "lucide-react";
import { useReferralCode, useMyReferrals, useTrackInvite, useReferralLeaderboard, getReferralBadge } from "@/hooks/useReferrals";
import { useToast } from "@/hooks/use-toast";
import VerifiedBadge from "@/components/VerifiedBadge";

const InviteFriends = () => {
  const { code, link, referralCount } = useReferralCode();
  const { data: referrals } = useMyReferrals();
  const trackInvite = useTrackInvite();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const invitesSent = referrals?.length || 0;
  const converted = referrals?.filter((r) => r.status === "converted").length || 0;
  const badge = getReferralBadge(referralCount);

  const copyLink = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    trackInvite.mutate({ channel: "copy_link" });
    toast({ title: "Link copied!", description: "Share it with friends to earn rewards." });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareVia = (channel: string) => {
    trackInvite.mutate({ channel });
    const text = encodeURIComponent(`Join me on AfroHub — the app for the African diaspora! 🌍✊🏾 ${link}`);
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}`,
      sms: `sms:?body=${decodeURIComponent(text)}`,
      instagram: link, // will copy for IG
    };
    if (channel === "instagram") {
      navigator.clipboard.writeText(link);
      toast({ title: "Link copied for Instagram!", description: "Paste it in your bio or DMs." });
      return;
    }
    if (channel === "native" && navigator.share) {
      navigator.share({ title: "Join AfroHub", text: `Join me on AfroHub! ${link}`, url: link });
      return;
    }
    window.open(urls[channel], "_blank");
  };

  const shareButtons = [
    { id: "whatsapp", label: "WhatsApp", icon: MessageSquare, color: "bg-green-600" },
    { id: "sms", label: "SMS", icon: Send, color: "bg-blue-600" },
    { id: "instagram", label: "Instagram", icon: Instagram, color: "bg-gradient-to-br from-purple-500 to-pink-500" },
    { id: "native", label: "More", icon: Share2, color: "bg-secondary" },
  ];

  return (
    <div className="px-4 py-5 space-y-4">
      {/* Header card */}
      <div className="bg-card border border-border rounded-2xl p-5 text-center">
        <div className="w-14 h-14 rounded-full gradient-gold flex items-center justify-center mx-auto mb-3">
          <Users className="w-6 h-6 text-primary-foreground" />
        </div>
        <h3 className="font-display text-lg font-bold text-foreground">Invite Friends</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Earn badges, free tickets & VIP access when friends join AfroHub
        </p>

        {/* Badge */}
        {badge && (
          <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full bg-gradient-to-r ${badge.color} text-white text-xs font-bold`}>
            <Crown className="w-3 h-3" />
            {badge.label}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{invitesSent}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Invited</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{converted}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Joined</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-xl font-bold text-primary">{referralCount}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Active</p>
          </div>
        </div>
      </div>

      {/* Referral link */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs text-muted-foreground mb-2 font-medium">Your referral link</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-secondary rounded-xl px-3 py-2.5 overflow-hidden">
            <p className="text-xs text-foreground truncate font-mono">{link || "Loading..."}</p>
          </div>
          <button
            onClick={copyLink}
            className="shrink-0 w-10 h-10 rounded-xl gradient-gold flex items-center justify-center transition-transform active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-primary-foreground" /> : <Copy className="w-4 h-4 text-primary-foreground" />}
          </button>
        </div>
      </div>

      {/* Share buttons */}
      <div className="grid grid-cols-4 gap-3">
        {shareButtons.map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.id}
              onClick={() => shareVia(btn.id)}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-12 h-12 rounded-2xl ${btn.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Rewards tiers */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" />
          Rewards
        </h4>
        <div className="space-y-2.5">
          {[
            { count: 3, label: "Bronze Builder badge", emoji: "🥉" },
            { count: 10, label: "Silver Builder badge + free event ticket", emoji: "🥈" },
            { count: 25, label: "Gold Builder badge + VIP access", emoji: "🏆" },
            { count: 50, label: "Diamond Builder badge + exclusive events", emoji: "💎" },
          ].map((tier) => (
            <div key={tier.count} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${referralCount >= tier.count ? "bg-primary/20" : "bg-secondary"}`}>
                {tier.emoji}
              </div>
              <div className="flex-1">
                <p className={`text-xs font-medium ${referralCount >= tier.count ? "text-primary" : "text-foreground"}`}>
                  {tier.label}
                </p>
                <p className="text-[10px] text-muted-foreground">{tier.count} referrals</p>
              </div>
              {referralCount >= tier.count && <Check className="w-4 h-4 text-primary" />}
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard button */}
      <button
        onClick={() => setShowLeaderboard(true)}
        className="w-full flex items-center justify-between bg-card border border-border rounded-2xl px-4 py-3.5 hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center">
            <Trophy className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">Community Builders</p>
            <p className="text-xs text-muted-foreground">See the leaderboard</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* Leaderboard modal */}
      {showLeaderboard && (
        <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
};

const LeaderboardModal = ({ onClose }: { onClose: () => void }) => {
  const { data: leaders, isLoading } = useReferralLeaderboard();

  const medalEmojis = ["🥇", "🥈", "🥉"];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Top Community Builders
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full">
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-6 text-center text-muted-foreground text-sm">Loading…</div>
        ) : !leaders || leaders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Trophy className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-1">No builders yet</p>
            <p className="text-xs text-muted-foreground">Be the first to invite friends and climb the leaderboard!</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {leaders.map((entry, idx) => {
              const badge = getReferralBadge(entry.referral_count);
              return (
                <div key={entry.user_id} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-8 text-center shrink-0">
                    {idx < 3 ? (
                      <span className="text-lg">{medalEmojis[idx]}</span>
                    ) : (
                      <span className="text-sm font-bold text-muted-foreground">{idx + 1}</span>
                    )}
                  </div>
                  <img
                    src={entry.avatar_url || "/placeholder.svg"}
                    alt={entry.display_name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-foreground truncate">{entry.display_name}</p>
                      {entry.is_verified && <VerifiedBadge size={14} />}
                    </div>
                    {badge && (
                      <p className="text-[10px] text-muted-foreground">{badge.label}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">{entry.referral_count}</p>
                    <p className="text-[10px] text-muted-foreground">referrals</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteFriends;
