import posthog from "posthog-js";

const POSTHOG_KEY = "phc_eALpOHgSB1VVg2Yyj8RjZNzr0n584Iezrqm8TxyWDMv";
const POSTHOG_HOST = "https://us.i.posthog.com";

let initialized = false;

export const ensurePostHog = () => {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
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
  ensurePostHog();
  posthog.identify(userId, properties);
};

export const resetUser = () => {
  ensurePostHog();
  posthog.reset();
};

export const trackSignUp = (method: string) => {
  ensurePostHog();
  posthog.capture("user_signed_up", { method });
};

export const trackLogin = (method: string) => {
  ensurePostHog();
  posthog.capture("user_logged_in", { method });
};

export const trackScreenView = (screen: string, properties?: Record<string, any>) => {
  ensurePostHog();
  posthog.capture("screen_viewed", { screen, ...properties });
};

export const trackEvent = (name: string, properties?: Record<string, any>) => {
  ensurePostHog();
  posthog.capture(name, properties);
};

export const trackCheckoutStarted = (eventId: string, price: number) => {
  ensurePostHog();
  posthog.capture("ticket_checkout_started", { event_id: eventId, price });
};

export const trackPurchaseCompleted = (eventId: string, price: number, orderId: string) => {
  ensurePostHog();
  posthog.capture("ticket_purchase_completed", { event_id: eventId, price, order_id: orderId });
};

export const trackSessionStart = () => {
  ensurePostHog();
  posthog.capture("session_start", { timestamp: new Date().toISOString() });
};

export { posthog };
