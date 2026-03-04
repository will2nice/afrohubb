
-- Like requests table for the like → request → accept flow
CREATE TABLE public.like_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(sender_id, receiver_id)
);

-- Enable RLS
ALTER TABLE public.like_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own sent/received requests
CREATE POLICY "Users can view own requests"
  ON public.like_requests FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can send requests
CREATE POLICY "Users can send requests"
  ON public.like_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Users can update requests they received (accept/reject)
CREATE POLICY "Receivers can update requests"
  ON public.like_requests FOR UPDATE TO authenticated
  USING (auth.uid() = receiver_id);

-- Users can delete their own sent requests
CREATE POLICY "Senders can delete requests"
  ON public.like_requests FOR DELETE TO authenticated
  USING (auth.uid() = sender_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.like_requests;
