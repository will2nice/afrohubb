CREATE TABLE public.concierge_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  city TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  arrival_date DATE,
  departure_date DATE,
  group_size INTEGER NOT NULL DEFAULT 1,
  interests TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  budget TEXT,
  special_notes TEXT DEFAULT '',
  assigned_agent_id UUID,
  conversation_id UUID REFERENCES public.conversations(id),
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.concierge_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view own concierge requests"
  ON public.concierge_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own requests
CREATE POLICY "Users can create concierge requests"
  ON public.concierge_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins can manage all requests
CREATE POLICY "Admins can manage all concierge requests"
  ON public.concierge_requests FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can update own requests (e.g. cancel)
CREATE POLICY "Users can update own concierge requests"
  ON public.concierge_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);