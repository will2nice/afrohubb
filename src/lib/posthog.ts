import posthog from "posthog-js";

const POSTHOG_KEY = "phc_eALpOHgSB1VVg2Yyj8RjZNzr0n584Iezrqm8TxyWDMv";
const POSTHOG_HOST = "https://us.i.posthog.com";

export const initPostHog = () => {
  if (typeof window === "undefined") return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: { password: true },
    },
  });
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  posthog.identify(userId, properties);
};

export const resetUser = () => {
  posthog.reset();
};

// ─── Auth events ───
export const trackSignUp = (method: string) =>
  posthog.capture("user_signed_up", { method });

export const trackLogin = (method: string) =>
  posthog.capture("user_logged_in", { method });

// ─── Screen views ───
export const trackScreenView = (screen: string, properties?: Record<string, any>) =>
  posthog.capture("screen_viewed", { screen, ...properties });

// ─── Feature usage ───
export const trackEvent = (name: string, properties?: Record<string, any>) =>
  posthog.capture(name, properties);

// ─── Ticket funnel ───
export const trackCheckoutStarted = (eventId: string, price: number) =>
  posthog.capture("ticket_checkout_started", { event_id: eventId, price });

export const trackPurchaseCompleted = (eventId: string, price: number, orderId: string) =>
  posthog.capture("ticket_purchase_completed", { event_id: eventId, price, order_id: orderId });

// ─── Retention helpers ───
export const trackSessionStart = () =>
  posthog.capture("session_start", { timestamp: new Date().toISOString() });

export { posthog };
