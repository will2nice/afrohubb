
-- Chat history for city AI concierge
CREATE TABLE public.city_agent_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  city text NOT NULL,
  role text NOT NULL DEFAULT 'user', -- 'user' or 'assistant'
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.city_agent_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages" ON public.city_agent_messages
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON public.city_agent_messages
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages" ON public.city_agent_messages
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_city_agent_messages_user_city ON public.city_agent_messages(user_id, city, created_at);

-- City agent activity log (background tasks)
CREATE TABLE public.city_agent_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city text NOT NULL,
  action text NOT NULL, -- 'event_curated', 'digest_sent', 'event_flagged', 'summary_generated'
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.city_agent_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view logs" ON public.city_agent_logs
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service can insert logs" ON public.city_agent_logs
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
