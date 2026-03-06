-- Promoter Stripe Connect accounts
CREATE TABLE public.promoter_stripe_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  stripe_account_id text NOT NULL,
  onboarding_complete boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.promoter_stripe_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stripe account" ON public.promoter_stripe_accounts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stripe account" ON public.promoter_stripe_accounts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stripe account" ON public.promoter_stripe_accounts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all stripe accounts" ON public.promoter_stripe_accounts
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Ticket types for events
CREATE TABLE public.ticket_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'General Admission',
  price_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'usd',
  quantity_total integer NOT NULL DEFAULT 100,
  quantity_sold integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ticket types" ON public.ticket_types
  FOR SELECT USING (true);
CREATE POLICY "Event creators can manage ticket types" ON public.ticket_types
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND creator_id = auth.uid())
  );
CREATE POLICY "Event creators can update ticket types" ON public.ticket_types
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND creator_id = auth.uid())
  );
CREATE POLICY "Event creators can delete ticket types" ON public.ticket_types
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND creator_id = auth.uid())
  );
CREATE POLICY "Admins can manage all ticket types" ON public.ticket_types
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  ticket_type_id uuid NOT NULL REFERENCES public.ticket_types(id),
  quantity integer NOT NULL DEFAULT 1,
  total_cents integer NOT NULL,
  application_fee_cents integer NOT NULL DEFAULT 0,
  stripe_session_id text,
  stripe_payment_intent_id text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "System can insert orders" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Promoters can view event orders" ON public.orders
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND creator_id = auth.uid())
  );