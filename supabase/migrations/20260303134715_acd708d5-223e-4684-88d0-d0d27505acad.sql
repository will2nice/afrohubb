
CREATE TABLE public.help_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  category text NOT NULL DEFAULT 'general',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'open',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view open help requests" ON public.help_requests FOR SELECT USING (true);
CREATE POLICY "Users can create own help requests" ON public.help_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own help requests" ON public.help_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own help requests" ON public.help_requests FOR DELETE USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.help_requests;
