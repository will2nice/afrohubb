import { useMemo } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useEvents, type DbEvent } from "@/hooks/useEvents";
import { isThisWeek, isWeekend, isFriday, isToday, isTomorrow, parseISO, differenceInDays } from "date-fns";

/** Map user interests to event categories/keywords for scoring */
const INTEREST_CATEGORY_MAP: Record<string, string[]> = {
  "Afrobeats": ["nightlife", "party", "afrobeats", "amapiano", "music"],
  "Amapiano": ["nightlife", "party", "amapiano", "music"],
  "Nightlife": ["nightlife", "party", "club"],
  "Festivals": ["festival", "outdoor", "afro nation"],
  "Brunch": ["brunch", "day party", "food"],
  "Networking": ["networking", "professional", "business"],
  "Music": ["music", "concert", "live"],
  "Art & Culture": ["art", "culture", "exhibition", "gallery"],
  "Fashion": ["fashion", "style", "design"],
  "Sports": ["sports", "football", "basketball"],
  "Food & Drink": ["food", "restaurant", "brunch", "dining"],
  "Tech": ["tech", "startup", "hackathon"],
  "Wellness": ["wellness", "yoga", "fitness"],
  "Dance": ["dance", "afrobeats", "party", "nightlife"],
};

function scoreEvent(event: DbEvent, interests: string[]): number {
  let score = 0;
  const title = event.title.toLowerCase();
  const desc = (event.description || "").toLowerCase();
  const cat = event.category.toLowerCase();
  const combined = `${title} ${desc} ${cat}`;

  // Interest match scoring
  for (const interest of interests) {
    const keywords = INTEREST_CATEGORY_MAP[interest] || [interest.toLowerCase()];
    for (const kw of keywords) {
      if (combined.includes(kw)) {
        score += 10;
        break; // one match per interest is enough
      }
    }
  }

  // Temporal scoring — events happening sooner get a boost
  try {
    const eventDate = parseISO(event.date);
    const daysAway = differenceInDays(eventDate, new Date());
    if (daysAway < 0) return -100; // past events sink
    if (isToday(eventDate)) score += 25;
    else if (isTomorrow(eventDate)) score += 20;
    else if (daysAway <= 3) score += 15;
    else if (daysAway <= 7) score += 10;
    else if (daysAway <= 14) score += 5;
  } catch {
    // ignore parse errors
  }

  return score;
}

export function getWeekendEvents(events: DbEvent[]): DbEvent[] {
  const now = new Date();
  const today = now.getDay(); // 0=Sun, 5=Fri, 6=Sat

  return events.filter((e) => {
    try {
      const d = parseISO(e.date);
      const daysAway = differenceInDays(d, now);
      if (daysAway < 0) return false;

      // If it's Mon-Thu, show upcoming Fri-Sun
      // If it's Fri-Sun, show today through Sun
      const dayOfWeek = d.getDay();
      const isFriSatSun = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;

      if (today >= 1 && today <= 4) {
        // Mon-Thu: show this coming weekend (within 7 days)
        return isFriSatSun && daysAway <= 7;
      } else {
        // Fri-Sun: show remaining weekend events
        return isFriSatSun && daysAway <= 2;
      }
    } catch {
      return false;
    }
  });
}

export const usePersonalizedFeed = (cityId?: string) => {
  const { profile } = useProfile();
  const { events, loading } = useEvents(cityId);
  const interests = profile?.interests || [];

  const personalizedEvents = useMemo(() => {
    if (!events.length) return [];

    const now = new Date();
    // Filter to future events only
    const futureEvents = events.filter((e) => {
      try {
        return parseISO(e.date) >= now;
      } catch {
        return true;
      }
    });

    if (!interests.length) {
      // No interests: sort by date (soonest first)
      return futureEvents.slice(0, 10);
    }

    // Score and sort
    return futureEvents
      .map((e) => ({ event: e, score: scoreEvent(e, interests) }))
      .filter((e) => e.score > -50)
      .sort((a, b) => b.score - a.score)
      .map((e) => e.event)
      .slice(0, 10);
  }, [events, interests]);

  const weekendEvents = useMemo(() => getWeekendEvents(events), [events]);

  const forYouEvents = useMemo(() => {
    if (!interests.length) return personalizedEvents.slice(0, 4);
    return personalizedEvents.slice(0, 6);
  }, [personalizedEvents, interests]);

  return {
    forYouEvents,
    weekendEvents,
    allPersonalized: personalizedEvents,
    interests,
    loading,
    hasInterests: interests.length > 0,
  };
};
