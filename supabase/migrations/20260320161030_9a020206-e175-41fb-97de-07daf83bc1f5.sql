
-- ticket_types: Add missing write policies (SELECT already exists)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ticket_types' AND policyname = 'Event creators can manage ticket types') THEN
    CREATE POLICY "Event creators can manage ticket types"
    ON public.ticket_types FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM events WHERE events.id = ticket_types.event_id AND events.creator_id = auth.uid()));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ticket_types' AND policyname = 'Event creators can update ticket types') THEN
    CREATE POLICY "Event creators can update ticket types"
    ON public.ticket_types FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM events WHERE events.id = ticket_types.event_id AND events.creator_id = auth.uid()));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ticket_types' AND policyname = 'Event creators can delete ticket types') THEN
    CREATE POLICY "Event creators can delete ticket types"
    ON public.ticket_types FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM events WHERE events.id = ticket_types.event_id AND events.creator_id = auth.uid()));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ticket_types' AND policyname = 'Admins can manage all ticket types') THEN
    CREATE POLICY "Admins can manage all ticket types"
    ON public.ticket_types FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Fix remaining tables (help_requests, event_rsvps, events, profiles) - restrict public writes to authenticated
DROP POLICY IF EXISTS "Users can create own help requests" ON public.help_requests;
DROP POLICY IF EXISTS "Users can update own help requests" ON public.help_requests;
DROP POLICY IF EXISTS "Users can delete own help requests" ON public.help_requests;

CREATE POLICY "Users can create own help requests" ON public.help_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own help requests" ON public.help_requests FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own help requests" ON public.help_requests FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own RSVPs" ON public.event_rsvps;
DROP POLICY IF EXISTS "Users can update own RSVPs" ON public.event_rsvps;
CREATE POLICY "Users can delete own RSVPs" ON public.event_rsvps FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own RSVPs" ON public.event_rsvps FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Creators can delete own events" ON public.events;
DROP POLICY IF EXISTS "Creators can update own events" ON public.events;
DROP POLICY IF EXISTS "Admins can update any event" ON public.events;
CREATE POLICY "Creators can delete own events" ON public.events FOR DELETE TO authenticated USING (auth.uid() = creator_id);
CREATE POLICY "Creators can update own events" ON public.events FOR UPDATE TO authenticated USING (auth.uid() = creator_id);
CREATE POLICY "Admins can update any event" ON public.events FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
