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

export const trackOnboardingCompleted = (stepsCompleted: number) =>
  trackAnalyticsEvent("onboarding_completed", { steps_completed: stepsCompleted });

export const trackEventViewed = (eventId: string, eventTitle: string) =>
  trackAnalyticsEvent("event_viewed", { event_id: eventId, title: eventTitle });

export const trackEventSaved = (eventId: string) =>
  trackAnalyticsEvent("event_saved", { event_id: eventId });

export const trackTicketPurchased = (eventId: string, quantity: number, totalCents: number) =>
  trackAnalyticsEvent("event_ticket_purchased", { event_id: eventId, quantity, total_cents: totalCents });

export const trackMessageSent = (conversationId: string) =>
  trackAnalyticsEvent("message_sent", { conversation_id: conversationId });

export const trackProfileViewed = (profileId: string) =>
  trackAnalyticsEvent("profile_viewed", { profile_id: profileId });

export const trackProfileCompleted = () =>
  trackAnalyticsEvent("profile_completed", {});
