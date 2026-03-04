
-- Migration 1: Extend waitlist_signups with profile fields
ALTER TABLE public.waitlist_signups
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS age integer,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS instagram_handle text;

-- Migration 2: Create event_promoters table
CREATE TABLE IF NOT EXISTS public.event_promoters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'promoter',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE public.event_promoters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Promoters can view own rows" ON public.event_promoters
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all promoters" ON public.event_promoters
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Migration 3: Create event_broadcasts table
CREATE TABLE IF NOT EXISTS public.event_broadcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.event_broadcasts ENABLE ROW LEVEL SECURITY;

-- Promoters of an event can insert broadcasts
CREATE POLICY "Promoters can send broadcasts" ON public.event_broadcasts
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.event_promoters
      WHERE event_promoters.event_id = event_broadcasts.event_id
        AND event_promoters.user_id = auth.uid()
    )
  );

-- Attendees (RSVPd) and promoters can read broadcasts
CREATE POLICY "Attendees and promoters can read broadcasts" ON public.event_broadcasts
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.event_rsvps
      WHERE event_rsvps.event_id = event_broadcasts.event_id
        AND event_rsvps.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.event_promoters
      WHERE event_promoters.event_id = event_broadcasts.event_id
        AND event_promoters.user_id = auth.uid()
    )
  );

-- Storage bucket for waitlist photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('waitlist-photos', 'waitlist-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload to waitlist-photos
CREATE POLICY "Anyone can upload waitlist photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'waitlist-photos');

-- Allow public read access
CREATE POLICY "Public read waitlist photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'waitlist-photos');

-- Enable realtime for broadcasts
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_broadcasts;
