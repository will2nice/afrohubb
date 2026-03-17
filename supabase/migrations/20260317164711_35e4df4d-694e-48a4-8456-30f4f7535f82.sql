
-- Ticket transfers table
CREATE TABLE public.ticket_transfers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  from_user_id uuid NOT NULL,
  to_email text NOT NULL,
  to_user_id uuid,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  claimed_at timestamp with time zone
);

ALTER TABLE public.ticket_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transfers" ON public.ticket_transfers
  FOR SELECT TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can create transfers for own orders" ON public.ticket_transfers
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Recipients can update transfers" ON public.ticket_transfers
  FOR UPDATE TO authenticated
  USING (auth.uid() = to_user_id);
