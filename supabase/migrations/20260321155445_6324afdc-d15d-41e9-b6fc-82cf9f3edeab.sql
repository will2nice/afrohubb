
-- Activities table: user-created hangouts on the map
CREATE TABLE public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'social',
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  location_label text DEFAULT '',
  is_public boolean NOT NULL DEFAULT true,
  max_spots integer DEFAULT NULL,
  starts_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '24 hours'),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active'
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Anyone can see public activities
CREATE POLICY "Anyone can view public activities"
  ON public.activities FOR SELECT TO public
  USING (is_public = true AND status = 'active');

-- Creators can see their own (even private)
CREATE POLICY "Creators can view own activities"
  ON public.activities FOR SELECT TO authenticated
  USING (creator_id = auth.uid());

-- Authenticated users can create
CREATE POLICY "Users can create activities"
  ON public.activities FOR INSERT TO authenticated
  WITH CHECK (creator_id = auth.uid());

-- Creators can update own
CREATE POLICY "Creators can update own activities"
  ON public.activities FOR UPDATE TO authenticated
  USING (creator_id = auth.uid());

-- Creators can delete own
CREATE POLICY "Creators can delete own activities"
  ON public.activities FOR DELETE TO authenticated
  USING (creator_id = auth.uid());

-- Activity participants / join requests
CREATE TABLE public.activity_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'joined',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(activity_id, user_id)
);

ALTER TABLE public.activity_participants ENABLE ROW LEVEL SECURITY;

-- Anyone can see participants of public activities
CREATE POLICY "Anyone can view participants of public activities"
  ON public.activity_participants FOR SELECT TO public
  USING (EXISTS (
    SELECT 1 FROM public.activities a
    WHERE a.id = activity_participants.activity_id AND a.is_public = true
  ));

-- Activity creators can view all participants (including pending requests)
CREATE POLICY "Creators can view all participants"
  ON public.activity_participants FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.activities a
    WHERE a.id = activity_participants.activity_id AND a.creator_id = auth.uid()
  ));

-- Users can see own participation
CREATE POLICY "Users can view own participation"
  ON public.activity_participants FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Users can join/request
CREATE POLICY "Users can join activities"
  ON public.activity_participants FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Activity creators can approve/reject requests
CREATE POLICY "Creators can update participant status"
  ON public.activity_participants FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.activities a
    WHERE a.id = activity_participants.activity_id AND a.creator_id = auth.uid()
  ));

-- Users can leave (delete own participation)
CREATE POLICY "Users can leave activities"
  ON public.activity_participants FOR DELETE TO authenticated
  USING (user_id = auth.uid());
