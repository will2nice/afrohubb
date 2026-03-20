import { useMemo } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useEvents, type DbEvent } from "@/hooks/useEvents";
import { isThisWeek, isWeekend, isFriday, isToday, isTomorrow, parseISO, differenceInDays } from "date-fns";

/** Map user interests to event categories/keywords for scoring */
const INTEREST_CATEGORY_MAP: Record<string, string[]> = {
  "Afrobeats": ["afrobeats", "afro", "amapiano", "nightlife", "party", "music", "dj"],
  "Amapiano": ["amapiano", "afrobeats", "nightlife", "party", "music", "dj"],
  "Parties": ["party", "nightlife", "club", "day party", "brunch", "afrobeats", "dj"],
  "Festivals": ["festival", "outdoor", "afro nation", "carnival", "block party", "concert"],
  "Nightlife": ["nightlife", "party", "club", "lounge", "dj", "after dark"],
  "Brunch": ["brunch", "day party", "food", "bottomless", "rooftop"],
  "Music": ["music", "concert", "live", "show", "gig", "dj"],
  "Dance": ["dance", "afrobeats", "amapiano", "party", "nightlife", "salsa", "kizomba"],
  "Networking": ["networking", "professional", "business", "mixer", "meetup"],
  "Art & Culture": ["art", "culture", "exhibition", "gallery", "museum", "theatre"],
  "Food & Drink": ["food", "restaurant", "brunch", "dining", "supper", "tasting"],
  "Sports": ["sports", "football", "basketball", "run", "tournament", "match"],
  "Fashion": ["fashion", "style", "design", "pop-up", "runway"],
  "Tech": ["tech", "startup", "hackathon", "ai", "innovation"],
  "Travel": ["travel", "trip", "tour", "getaway", "retreat"],
  "Wellness": ["wellness", "yoga", "fitness", "meditation", "healing"],
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

export interface ScoredEvent extends DbEvent {
  matchedInterests: string[];
}

/** Returns which user interests matched this event */
function getMatchedInterests(event: DbEvent, interests: string[]): string[] {
  const combined = `${event.title} ${event.description || ""} ${event.category}`.toLowerCase();
  const matched: string[] = [];
  for (const interest of interests) {
    const keywords = INTEREST_CATEGORY_MAP[interest] || [interest.toLowerCase()];
    if (keywords.some((kw) => combined.includes(kw))) {
      matched.push(interest);
    }
  }
  return matched;
}

export const usePersonalizedFeed = (cityId?: string) => {
  const { profile } = useProfile();
  const { events, loading } = useEvents(cityId);
  const interests = profile?.interests || [];

  const personalizedEvents = useMemo((): ScoredEvent[] => {
    if (!events.length) return [];

    const now = new Date();
    const futureEvents = events.filter((e) => {
      try {
        return parseISO(e.date) >= now;
      } catch {
        return true;
      }
    });

    if (!interests.length) {
      return futureEvents.slice(0, 10).map((e) => ({ ...e, matchedInterests: [] }));
    }

    return futureEvents
      .map((e) => ({
        event: e,
        score: scoreEvent(e, interests),
        matchedInterests: getMatchedInterests(e, interests),
      }))
      .filter((e) => e.score > -50)
      .sort((a, b) => b.score - a.score)
      .map((e) => ({ ...e.event, matchedInterests: e.matchedInterests }))
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
