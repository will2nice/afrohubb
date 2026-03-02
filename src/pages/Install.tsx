import { useState, useEffect } from "react";
import { Download, Share, Smartphone, Check } from "lucide-react";

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        <img src="/icons/icon-192x192.png" alt="AfroHub" className="w-24 h-24 rounded-3xl mx-auto shadow-lg" />

        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold text-gradient-gold">AfroHub</h1>
          <p className="text-muted-foreground text-sm">
            Install AfroHub on your phone for the best experience
          </p>
        </div>

        {installed ? (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Check size={32} className="text-primary" />
            </div>
            <p className="font-semibold text-foreground">App installed!</p>
            <p className="text-xs text-muted-foreground">Open AfroHub from your home screen</p>
          </div>
        ) : isIOS ? (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <Smartphone size={32} className="mx-auto text-primary" />
            <p className="font-semibold text-foreground">Install on iPhone</p>
            <div className="text-left space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
                <p>Tap the <Share size={14} className="inline text-primary" /> <strong className="text-foreground">Share</strong> button at the bottom of Safari</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
                <p>Scroll down and tap <strong className="text-foreground">"Add to Home Screen"</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">3</span>
                <p>Tap <strong className="text-foreground">"Add"</strong> and open AfroHub from your home screen</p>
              </div>
            </div>
          </div>
        ) : deferredPrompt ? (
          <button
            onClick={handleInstall}
            className="w-full py-4 rounded-xl gradient-gold text-primary-foreground font-bold text-base flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
          >
            <Download size={20} />
            Install AfroHub
          </button>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <Smartphone size={32} className="mx-auto text-primary" />
            <p className="font-semibold text-foreground">Install on Android</p>
            <div className="text-left space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
                <p>Tap the <strong className="text-foreground">⋮ menu</strong> in your browser</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
                <p>Tap <strong className="text-foreground">"Install app"</strong> or <strong className="text-foreground">"Add to Home Screen"</strong></p>
              </div>
            </div>
          </div>
        )}

        <a href="/" className="block text-sm text-primary font-semibold hover:underline">
          Continue in browser →
        </a>
      </div>
    </div>
  );
};

export default Install;
