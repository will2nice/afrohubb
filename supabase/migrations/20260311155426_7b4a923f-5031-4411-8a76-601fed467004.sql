
-- Analytics events table for server-side tracking
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  event_name text NOT NULL,
  properties jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_events_name ON public.analytics_events(event_name);
CREATE INDEX idx_analytics_events_created ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_events_user ON public.analytics_events(user_id);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can insert their own events
CREATE POLICY "Users can insert own events" ON public.analytics_events
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Only admins can read all events
CREATE POLICY "Admins can read all events" ON public.analytics_events
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- DB function: get daily active users for last N days
CREATE OR REPLACE FUNCTION public.get_dau(days_back integer DEFAULT 30)
RETURNS TABLE(day date, count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT date_trunc('day', created_at)::date AS day, COUNT(DISTINCT user_id) AS count
  FROM public.analytics_events
  WHERE created_at >= now() - (days_back || ' days')::interval
  GROUP BY day
  ORDER BY day;
$$;

-- DB function: get event counts by name
CREATE OR REPLACE FUNCTION public.get_event_counts(days_back integer DEFAULT 30)
RETURNS TABLE(event_name text, count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT event_name, COUNT(*) AS count
  FROM public.analytics_events
  WHERE created_at >= now() - (days_back || ' days')::interval
  GROUP BY event_name
  ORDER BY count DESC;
$$;

-- DB function: retention (D1, D7, D30)
CREATE OR REPLACE FUNCTION public.get_retention()
RETURNS TABLE(period text, retention_pct numeric)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH signups AS (
    SELECT DISTINCT user_id, MIN(created_at) AS signup_date
    FROM public.analytics_events WHERE event_name = 'user_signup'
    GROUP BY user_id
  ),
  retained AS (
    SELECT s.user_id, s.signup_date,
      EXISTS(SELECT 1 FROM analytics_events e WHERE e.user_id = s.user_id AND e.created_at >= s.signup_date + interval '1 day' AND e.created_at < s.signup_date + interval '2 days') AS d1,
      EXISTS(SELECT 1 FROM analytics_events e WHERE e.user_id = s.user_id AND e.created_at >= s.signup_date + interval '7 days' AND e.created_at < s.signup_date + interval '8 days') AS d7,
      EXISTS(SELECT 1 FROM analytics_events e WHERE e.user_id = s.user_id AND e.created_at >= s.signup_date + interval '30 days' AND e.created_at < s.signup_date + interval '31 days') AS d30
    FROM signups s
  )
  SELECT 'D1' AS period, ROUND(100.0 * COUNT(*) FILTER (WHERE d1) / NULLIF(COUNT(*), 0), 1) AS retention_pct FROM retained
  UNION ALL
  SELECT 'D7', ROUND(100.0 * COUNT(*) FILTER (WHERE d7) / NULLIF(COUNT(*), 0), 1) FROM retained
  UNION ALL
  SELECT 'D30', ROUND(100.0 * COUNT(*) FILTER (WHERE d30) / NULLIF(COUNT(*), 0), 1) FROM retained;
$$;

-- DB function: top cities
CREATE OR REPLACE FUNCTION public.get_top_cities(lim integer DEFAULT 10)
RETURNS TABLE(city text, user_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT city, COUNT(*) AS user_count
  FROM public.profiles
  WHERE city IS NOT NULL AND city != ''
  GROUP BY city
  ORDER BY user_count DESC
  LIMIT lim;
$$;
