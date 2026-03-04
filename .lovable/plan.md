

## Plan: Enhanced Waitlist Profiles + Event Promoter Roles

### What we're building

**1. Richer Waitlist Profiles** — Add fields to `waitlist_signups` so candidates submit photos, age, city/country, and a short bio. Admins can then filter and review candidates visually.

**2. Event Promoters** — Create an `event_promoters` table that links users to events with a "promoter" role. Promoters can broadcast messages to all attendees of their event.

---

### Database Changes

**Migration 1: Extend `waitlist_signups` table**
- Add columns: `avatar_url` (text, nullable), `age` (integer, nullable), `city` (text, nullable), `country` (text, nullable), `bio` (text, nullable), `instagram_handle` (text, nullable)

**Migration 2: Create `event_promoters` table**
```text
event_promoters
├── id (uuid, PK)
├── event_id (uuid, NOT NULL)
├── user_id (uuid, NOT NULL, references auth.users)
├── role (text, default 'promoter')  -- promoter, host, etc.
├── created_at (timestamptz)
└── UNIQUE(event_id, user_id)
```
- RLS: promoters can view their own rows; admins can manage all rows
- Admins assign promoters from the admin dashboard

**Migration 3: Create `event_broadcasts` table**
```text
event_broadcasts
├── id (uuid, PK)
├── event_id (uuid, NOT NULL)
├── sender_id (uuid, NOT NULL)
├── message (text, NOT NULL)
├── created_at (timestamptz)
```
- RLS: promoters of the event can insert; attendees (via event_rsvps) can read

---

### Frontend Changes

**Waitlist Form (`src/pages/Waitlist.tsx`)**
- Add fields: photo upload, age, city/country selector, bio, Instagram handle
- Upload photo to a new `waitlist-photos` storage bucket (public)
- Save the public URL into `avatar_url`

**Admin Dashboard (`src/pages/AdminDashboard.tsx`)**
- Show candidate photos, age, city, country, bio in each waitlist card
- Add filter chips: by country, by age range
- Add "Approve" button that creates an auth invite or marks them approved
- Add "Assign as Promoter" action on approved users (links to an event picker)

**Event Promoter Features**
- New `useEventPromoters` hook to check if current user is a promoter for an event
- In `EventAttendeesSheet`, if user is a promoter, show a "Broadcast Message" button at the top
- Broadcast UI: text input + send button that inserts into `event_broadcasts`
- Attendees see broadcast messages as a banner/notification at the top of the attendees sheet

**Storage**
- Create `waitlist-photos` bucket (public) for waitlist candidate profile pictures

---

### Technical Details

- Waitlist photo uploads use the same pattern as avatar uploads (Supabase Storage)
- Event promoter check uses a `useEventPromoters(eventId)` hook querying `event_promoters`
- Broadcast messages are separate from DM conversations — they're one-to-many announcements
- Admin dashboard gets a new "Promoters" tab to manage event-promoter assignments

