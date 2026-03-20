import { useState } from "react";
import { MapPin, TrendingUp, Users, Calendar, ArrowRight, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvents } from "@/hooks/useEvents";
import { usePosts } from "@/hooks/usePosts";
import { useProfile } from "@/hooks/useProfile";
import { useScreenView } from "@/hooks/useAnalytics";
import { trackEvent } from "@/lib/posthog";
import { format } from "date-fns";

interface HomeScreenProps {
  onNavigate: (tab: string) => void;
}

const HomeScreen = ({ onNavigate }: HomeScreenProps) => {
  useScreenView("home");
  const { profile, loading: profileLoading } = useProfile();
  const { events, loading: eventsLoading } = useEvents(profile?.city || undefined);
  const { posts, loading: postsLoading } = usePosts(profile?.city || undefined);

  const nearbyEvents = events.slice(0, 4);
  const trendingPosts = posts?.slice(0, 3) || [];
  const loading = profileLoading || eventsLoading;

  return (
    <div className="pb-24 min-h-screen bg-background">
      {/* Hero Section */}
      <div className="px-5 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          {profile?.display_name ? `Hey ${profile.display_name.split(" ")[0]} 👋` : "Welcome 👋"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Culture. Community. Identity. Your global Afro experience starts here.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Users, label: "Community", action: "discover", color: "text-primary" },
            { icon: Calendar, label: "Events", action: "events", color: "text-accent" },
            { icon: Star, label: "Profile", action: "profile", color: "text-primary" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                trackEvent("home_quick_action", { action: item.action });
                onNavigate(item.action);
              }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-all"
            >
              <item.icon size={22} className={item.color} />
              <span className="text-xs font-medium text-foreground">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Events */}
      <section className="mb-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Nearby Events</h2>
          </div>
          <button
            onClick={() => onNavigate("events")}
            className="text-xs text-primary font-medium flex items-center gap-1"
          >
            See all <ArrowRight size={12} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="min-w-[240px]">
                <Skeleton className="w-full h-32 rounded-xl mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))
          ) : nearbyEvents.length === 0 ? (
            <div className="w-full py-8 text-center">
              <Calendar size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No events nearby yet</p>
              <button
                onClick={() => onNavigate("events")}
                className="text-xs text-primary mt-1"
              >
                Browse all events
              </button>
            </div>
          ) : (
            nearbyEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => {
                  trackEvent("event_viewed", { event_id: event.id, source: "home" });
                  onNavigate("events");
                }}
                className="min-w-[240px] bg-card border border-border rounded-xl overflow-hidden text-left hover:border-primary/40 transition-all"
              >
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-32 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-32 bg-muted flex items-center justify-center">
                    <Calendar size={24} className="text-muted-foreground" />
                  </div>
                )}
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-foreground line-clamp-1">{event.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {format(new Date(event.date), "MMM d")} • {event.city}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </section>

      {/* Trending Posts */}
      <section className="mb-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-accent" />
            <h2 className="text-sm font-semibold text-foreground">Trending</h2>
          </div>
        </div>
        <div className="px-5 space-y-3">
          {postsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 items-start">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-2/3 mb-1.5" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))
          ) : trendingPosts.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground">No posts yet — be the first!</p>
            </div>
          ) : (
            trendingPosts.map((post) => (
              <div
                key={post.id}
                className="flex gap-3 items-start p-3 rounded-xl bg-card border border-border"
              >
                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
                  {post.profile?.avatar_url ? (
                    <img
                      src={post.profile.avatar_url}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-bold">
                      {post.profile?.display_name?.[0] || "?"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">
                    {post.profile?.display_name || "Anonymous"}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {post.content}
                  </p>
                  <div className="flex gap-3 mt-1.5 text-[10px] text-muted-foreground">
                    <span>❤️ {post.likes_count}</span>
                    <span>💬 {post.comments_count}</span>
                  </div>
                </div>
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt=""
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                    loading="lazy"
                  />
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Featured Organizers */}
      <section className="px-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Star size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Featured Organizers</h2>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <p className="text-sm text-muted-foreground">Coming soon — verified organizers near you</p>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
