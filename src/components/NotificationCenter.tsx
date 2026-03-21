import { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  MessageSquare,
  Eye,
  MapPin,
  Calendar,
  Users,
  Ticket,
  Settings,
  ArrowLeft,
  X,
  Smartphone,
} from "lucide-react";
import { useNotifications, useNotificationPreferences, type Notification } from "@/hooks/useNotifications";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Switch } from "@/components/ui/switch";
import { formatDistanceToNow } from "date-fns";

const typeIcons: Record<string, typeof Bell> = {
  message: MessageSquare,
  profile_view: Eye,
  nearby_event: MapPin,
  event_invite: Calendar,
  group_activity: Users,
  ticket_alert: Ticket,
  general: Bell,
};

const typeColors: Record<string, string> = {
  message: "bg-primary/20 text-primary",
  profile_view: "bg-accent/20 text-accent",
  nearby_event: "bg-primary/20 text-primary",
  event_invite: "bg-accent/20 text-accent",
  group_activity: "bg-primary/20 text-primary",
  ticket_alert: "bg-destructive/20 text-destructive",
  general: "bg-muted text-muted-foreground",
};

const NotificationBell = ({ onClick }: { onClick: () => void }) => {
  const { unreadCount } = useNotifications();

  return (
    <button onClick={onClick} className="relative p-2 rounded-full hover:bg-secondary transition-colors">
      <Bell className="w-5 h-5 text-foreground" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};

const NotificationItem = ({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: (id: string) => void;
}) => {
  const Icon = typeIcons[notification.type] || Bell;
  const colorClass = typeColors[notification.type] || typeColors.general;

  return (
    <button
      onClick={() => !notification.is_read && onRead(notification.id)}
      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
        notification.is_read ? "opacity-60" : "bg-secondary/30"
      } hover:bg-secondary/50`}
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{notification.title}</p>
        {notification.body && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{notification.body}</p>
        )}
        <p className="text-[10px] text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
      </div>
      {!notification.is_read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
    </button>
  );
};

const PreferencesPanel = ({ onBack }: { onBack: () => void }) => {
  const { preferences, loading, updatePreferences } = useNotificationPreferences();
  const { isSupported, isSubscribed, permission, loading: pushLoading, subscribe, unsubscribe } = usePushNotifications();

  if (loading || !preferences) {
    return (
      <div className="p-6 text-center text-muted-foreground text-sm">Loading preferences...</div>
    );
  }

  const toggles: { key: keyof typeof preferences; label: string; desc: string }[] = [
    { key: "messages", label: "Messages", desc: "When someone sends you a message" },
    { key: "profile_views", label: "Profile Views", desc: "When someone views your profile" },
    { key: "nearby_events", label: "Nearby Events", desc: "New events near your location" },
    { key: "event_invites", label: "Event Invites", desc: "When someone invites you to an event" },
    { key: "group_activity", label: "Group Activity", desc: "Updates from groups you've joined" },
    { key: "ticket_alerts", label: "Ticket Alerts", desc: "Tickets selling out or price changes" },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={onBack} className="p-1 hover:bg-secondary rounded-full">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h3 className="text-base font-semibold text-foreground">Notification Settings</h3>
      </div>

      {/* Push notification toggle */}
      {isSupported && (
        <div className="px-4 py-3.5 border-b border-border bg-secondary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Browser Push</p>
                <p className="text-xs text-muted-foreground">
                  {permission === "denied"
                    ? "Blocked in browser settings"
                    : "Get alerts even when the app is closed"}
                </p>
              </div>
            </div>
            <Switch
              checked={isSubscribed}
              disabled={pushLoading || permission === "denied"}
              onCheckedChange={(checked) => (checked ? subscribe() : unsubscribe())}
            />
          </div>
        </div>
      )}

      <div className="divide-y divide-border">
        {toggles.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <Switch
              checked={preferences[key] as boolean}
              onCheckedChange={(checked) => updatePreferences.mutate({ [key]: checked })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const NotificationCenter = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { notifications, loading, markAsRead, markAllAsRead, clearAll, unreadCount } =
    useNotifications();
  const [showPrefs, setShowPrefs] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background animate-in slide-in-from-right-full duration-200">
      {showPrefs ? (
        <PreferencesPanel onBack={() => setShowPrefs(false)} />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">Notifications</h2>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead.mutate()}
                  className="p-2 hover:bg-secondary rounded-full"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={() => clearAll.mutate()}
                  className="p-2 hover:bg-secondary rounded-full"
                  title="Clear all"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
              <button
                onClick={() => setShowPrefs(true)}
                className="p-2 hover:bg-secondary rounded-full"
                title="Settings"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full">
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-muted-foreground text-sm">Loading…</div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Bell className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium mb-1">No notifications yet</p>
                <p className="text-xs text-muted-foreground">
                  We'll let you know about new messages, events, and activity.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    onRead={(id) => markAsRead.mutate(id)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export { NotificationBell };
export default NotificationCenter;
