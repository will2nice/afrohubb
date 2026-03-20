import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/posthog";
import { createNotification } from "@/hooks/useNotifications";

/**
 * Track an analytics event to both PostHog and the DB.
 * Falls back silently if DB insert fails.
 */
export const trackAnalyticsEvent = async (
  eventName: string,
  properties: Record<string, any> = {}
) => {
  // PostHog (client-side)
  trackEvent(eventName, properties);

  // DB (server-side persistence)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("analytics_events" as any).insert({
    user_id: user.id,
    event_name: eventName,
    properties,
  });
};

// Convenience wrappers
export const trackUserSignup = (method: string = "email") =>
  trackAnalyticsEvent("user_signup", { method });

export const trackOnboardingStep = (step: number, stepName: string, action: "started" | "completed" | "skipped") =>
  trackAnalyticsEvent("onboarding_step", { step, step_name: stepName, action });

export const trackOnboardingCompleted = (stepsCompleted: number) =>
  trackAnalyticsEvent("onboarding_completed", { steps_completed: stepsCompleted });

export const trackOnboardingDropoff = (lastStep: number, stepName: string) =>
  trackAnalyticsEvent("onboarding_dropoff", { last_step: lastStep, step_name: stepName });

export const trackEventViewed = (eventId: string, eventTitle: string) =>
  trackAnalyticsEvent("event_viewed", { event_id: eventId, title: eventTitle });

export const trackEventSaved = (eventId: string) =>
  trackAnalyticsEvent("event_saved", { event_id: eventId });

export const trackTicketPurchased = (eventId: string, quantity: number, totalCents: number) =>
  trackAnalyticsEvent("event_ticket_purchased", { event_id: eventId, quantity, total_cents: totalCents });

export const trackMessageSent = (conversationId: string) =>
  trackAnalyticsEvent("message_sent", { conversation_id: conversationId });

// Feature usage tracking
export const trackFeatureUsed = (feature: string, properties: Record<string, any> = {}) =>
  trackAnalyticsEvent("feature_used", { feature, ...properties });

export const trackRsvp = (eventId: string, action: "added" | "removed") =>
  trackAnalyticsEvent("event_rsvp", { event_id: eventId, action });

export const trackFilterUsed = (screen: string, filterType: string, filterValue: string) =>
  trackAnalyticsEvent("filter_used", { screen, filter_type: filterType, filter_value: filterValue });

export const trackSearchPerformed = (screen: string, query: string) =>
  trackAnalyticsEvent("search_performed", { screen, query_length: query.length });

export const trackTabSwitched = (screen: string, tab: string) =>
  trackAnalyticsEvent("tab_switched", { screen, tab });

export const trackMapOpened = (city: string) =>
  trackAnalyticsEvent("map_opened", { city });

// Ticket funnel
export const trackTicketFunnelStep = (step: "viewed" | "selected" | "checkout_started" | "checkout_completed" | "checkout_abandoned", eventId: string, properties: Record<string, any> = {}) =>
  trackAnalyticsEvent("ticket_funnel", { step, event_id: eventId, ...properties });

export const trackProfileViewed = async (profileId: string) => {
  trackAnalyticsEvent("profile_viewed", { profile_id: profileId });
  const { data: { user } } = await supabase.auth.getUser();
  if (user && user.id !== profileId) {
    const viewerName = (await supabase.from("profiles").select("display_name").eq("id", user.id).single()).data?.display_name;
    createNotification(
      profileId,
      "profile_view",
      `${viewerName || "Someone"} viewed your profile`,
      "Tap to see who's checking you out",
      { viewer_id: user.id }
    );
  }
};

export const trackProfileCompleted = () =>
  trackAnalyticsEvent("profile_completed", {});
