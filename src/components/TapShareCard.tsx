import { useState, useEffect, useRef, useCallback } from "react";
import {
  Smartphone,
  QrCode,
  Share2,
  Wifi,
  Check,
  Copy,
  X,
  Nfc,
  ArrowRight,
  Download,
  Image as ImageIcon,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useReferralCode, getReferralBadge } from "@/hooks/useReferrals";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

const TapShareCard = ({ onClose }: { onClose: () => void }) => {
  const { code, link, referralCount } = useReferralCode();
  const { profile } = useProfile();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [nfcStatus, setNfcStatus] = useState<"idle" | "writing" | "success" | "unsupported">("idle");
  const [showQR, setShowQR] = useState(false);
  const [saving, setSaving] = useState(false);
  const badge = getReferralBadge(referralCount);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isNFCSupported = typeof window !== "undefined" && "NDEFReader" in window;

  useEffect(() => {
    if (!isNFCSupported) setNfcStatus("unsupported");
  }, [isNFCSupported]);

  const startNFCWrite = async () => {
    if (!isNFCSupported || !link) return;
    try {
      setNfcStatus("writing");
      const ndef = new (window as any).NDEFReader();
      await ndef.write({ records: [{ recordType: "url", data: link }] });
      setNfcStatus("success");
      toast({ title: "NFC written!", description: "Hold another phone nearby to share." });
      setTimeout(() => setNfcStatus("idle"), 3000);
    } catch {
      setNfcStatus("idle");
      toast({ title: "NFC cancelled", variant: "destructive" });
    }
  };

  const copyLink = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast({ title: "Link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const nativeShare = async () => {
    if (!link) return;
    if (navigator.share) {
      await navigator.share({
        title: "Join AfroHub",
        text: `Join me on AfroHub — the app for the African diaspora! 🌍✊🏾`,
        url: link,
      });
    } else {
      copyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background animate-in slide-in-from-bottom duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-primary" />
          Tap & Share
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full">
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
        {/* Wallet Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 text-primary-foreground shadow-xl">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs opacity-70 uppercase tracking-widest">AfroHub</p>
                <p className="text-lg font-bold mt-0.5">{profile?.display_name || "Member"}</p>
              </div>
              {profile?.avatar_url && (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                />
              )}
            </div>

            {badge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-4">
                {badge.label}
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/15 rounded-xl px-3 py-2">
                <p className="text-[10px] opacity-70 uppercase tracking-wide">Referral Code</p>
                <p className="font-mono font-bold text-sm tracking-wider">{code || "..."}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{referralCount}</p>
                <p className="text-[10px] opacity-70">Referrals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* NFC Tap */}
          <button
            onClick={nfcStatus === "unsupported" ? nativeShare : startNFCWrite}
            className="flex flex-col items-center gap-2 bg-card border border-border rounded-2xl p-4 hover:bg-secondary/50 transition-colors active:scale-95"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              nfcStatus === "writing" ? "bg-primary/20 animate-pulse" :
              nfcStatus === "success" ? "bg-green-500/20" : "gradient-gold"
            }`}>
              {nfcStatus === "success" ? (
                <Check className="w-6 h-6 text-green-500" />
              ) : nfcStatus === "unsupported" ? (
                <Share2 className="w-6 h-6 text-primary-foreground" />
              ) : (
                <Wifi className="w-6 h-6 text-primary-foreground" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {nfcStatus === "unsupported" ? "AirDrop / Share" : 
                 nfcStatus === "writing" ? "Tap now..." :
                 nfcStatus === "success" ? "Shared!" : "Tap to Share"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {nfcStatus === "unsupported" ? "Share via AirDrop" : "NFC phone-to-phone"}
              </p>
            </div>
          </button>

          {/* QR Code */}
          <button
            onClick={() => setShowQR(true)}
            className="flex flex-col items-center gap-2 bg-card border border-border rounded-2xl p-4 hover:bg-secondary/50 transition-colors active:scale-95"
          >
            <div className="w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center">
              <QrCode className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Show QR</p>
              <p className="text-[10px] text-muted-foreground">Others scan to join</p>
            </div>
          </button>
        </div>

        {/* Copy link */}
        <button
          onClick={copyLink}
          className="w-full flex items-center justify-between bg-card border border-border rounded-2xl px-4 py-3.5 hover:bg-secondary/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">{copied ? "Copied!" : "Copy Link"}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">{link || "Loading..."}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* How it works */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h4 className="text-sm font-bold text-foreground mb-3">How it works</h4>
          <div className="space-y-3">
            {[
              { icon: Wifi, title: "Tap (Android)", desc: "Hold phones back-to-back — they'll get your invite link via NFC" },
              { icon: Share2, title: "AirDrop (iPhone)", desc: "Tap 'AirDrop / Share' to send your link to nearby iPhones" },
              { icon: QrCode, title: "QR Code", desc: "Show your QR — anyone can scan with their camera to join" },
            ].map((step) => (
              <div key={step.title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <step.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{step.title}</p>
                  <p className="text-[11px] text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 z-[60] bg-background/95 flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
          <button
            onClick={() => setShowQR(false)}
            className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>

          <div className="text-center mb-6">
            <p className="text-lg font-bold text-foreground">Scan to Join AfroHub</p>
            <p className="text-sm text-muted-foreground mt-1">Point your camera at this code</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-xl">
            <QRCodeSVG
              value={link || "https://diaspora-vibe.lovable.app/waitlist"}
              size={220}
              level="H"
              includeMargin={false}
              fgColor="#1a1a1a"
              bgColor="#ffffff"
            />
          </div>

          <p className="text-xs text-muted-foreground mt-6 text-center max-w-xs">
            {profile?.display_name}'s invite • {referralCount} referrals
          </p>

          <button
            onClick={nativeShare}
            className="mt-6 px-6 py-3 rounded-xl gradient-gold text-primary-foreground font-semibold text-sm flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Link
          </button>
        </div>
      )}
    </div>
  );
};

export default TapShareCard;
