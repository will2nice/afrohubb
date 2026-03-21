import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useAuth } from "@/contexts/AuthContext";

const PushNotificationPrompt = () => {
  const { user } = useAuth();
  const { isSupported, permission, isSubscribed, loading, subscribe } = usePushNotifications();
  const [dismissed, setDismissed] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user || !isSupported || isSubscribed || permission === "denied" || dismissed) {
      setShow(false);
      return;
    }
    // Show prompt after a short delay so it doesn't feel jarring
    const timer = setTimeout(() => {
      const wasDismissed = localStorage.getItem("push_prompt_dismissed");
      if (!wasDismissed) setShow(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [user, isSupported, isSubscribed, permission, dismissed]);

  const handleEnable = async () => {
    await subscribe();
    setShow(false);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShow(false);
    localStorage.setItem("push_prompt_dismissed", "true");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-card border border-border rounded-2xl shadow-lg p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Stay in the loop 🔔</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Get notified about new messages, events, and community updates — even when you're away.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleEnable}
              disabled={loading}
              className="px-4 py-1.5 text-xs font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Enabling…" : "Enable"}
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-1.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
        <button onClick={handleDismiss} className="p-1 hover:bg-secondary rounded-full shrink-0">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default PushNotificationPrompt;
