import { useEffect, useRef } from "react";
import { trackScreenView, trackEvent } from "@/lib/posthog";

/**
 * Track screen views automatically when a component mounts.
 */
export const useScreenView = (screen: string, properties?: Record<string, any>) => {
  const tracked = useRef(false);
  useEffect(() => {
    if (!tracked.current) {
      trackScreenView(screen, properties);
      tracked.current = true;
    }
  }, [screen]);
};

/**
 * Track session duration — fires on unmount with elapsed seconds.
 */
export const useSessionDuration = () => {
  const start = useRef(Date.now());
  useEffect(() => {
    return () => {
      const seconds = Math.round((Date.now() - start.current) / 1000);
      trackEvent("session_duration", { seconds });
    };
  }, []);
};
