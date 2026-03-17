
-- Table types for VIP/bottle service at events
CREATE TABLE public.table_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'VIP Table',
  capacity INTEGER NOT NULL DEFAULT 6,
  price_cents INTEGER NOT NULL DEFAULT 0,
  deposit_cents INTEGER NOT NULL DEFAULT 0,
  quantity_total INTEGER NOT NULL DEFAULT 10,
  quantity_available INTEGER NOT NULL DEFAULT 10,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bottle packages for events
CREATE TABLE public.bottle_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Standard Package',
  description TEXT DEFAULT '',
  price_cents INTEGER NOT NULL DEFAULT 0,
  includes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reservations (table + bottle bookings)
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  table_type_id UUID REFERENCES public.table_types(id) ON DELETE SET NULL,
  bottle_package_id UUID REFERENCES public.bottle_packages(id) ON DELETE SET NULL,
  guest_count INTEGER NOT NULL DEFAULT 1,
  arrival_time TEXT DEFAULT '',
  special_notes TEXT DEFAULT '',
  total_cents INTEGER NOT NULL DEFAULT 0,
  deposit_paid_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'confirmed',
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Check-ins for attendance tracking
CREATE TABLE public.check_ins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  reservation_id UUID REFERENCES public.reservations(id) ON DELETE SET NULL,
  method TEXT NOT NULL DEFAULT 'manual',
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  checked_in_by UUID
);

-- Add QR check-in code to orders
ALTER TABLE public.orders ADD COLUMN check_in_code TEXT DEFAULT substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

-- Add check_in_code to reservations too
ALTER TABLE public.reservations ADD COLUMN check_in_code TEXT DEFAULT substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

-- Enable RLS
ALTER TABLE public.table_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bottle_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

-- table_types: anyone can view, event creators can manage
CREATE POLICY "Anyone can view table types" ON public.table_types FOR SELECT USING (true);
CREATE POLICY "Event creators can manage table types" ON public.table_types FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM events WHERE events.id = table_types.event_id AND events.creator_id = auth.uid()));
CREATE POLICY "Event creators can update table types" ON public.table_types FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = table_types.event_id AND events.creator_id = auth.uid()));
CREATE POLICY "Event creators can delete table types" ON public.table_types FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = table_types.event_id AND events.creator_id = auth.uid()));
CREATE POLICY "Admins can manage all table types" ON public.table_types FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- bottle_packages: anyone can view, event creators can manage
CREATE POLICY "Anyone can view bottle packages" ON public.bottle_packages FOR SELECT USING (true);
CREATE POLICY "Event creators can manage bottle packages" ON public.bottle_packages FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM events WHERE events.id = bottle_packages.event_id AND events.creator_id = auth.uid()));
CREATE POLICY "Event creators can update bottle packages" ON public.bottle_packages FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = bottle_packages.event_id AND events.creator_id = auth.uid()));
CREATE POLICY "Event creators can delete bottle packages" ON public.bottle_packages FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = bottle_packages.event_id AND events.creator_id = auth.uid()));
CREATE POLICY "Admins can manage all bottle packages" ON public.bottle_packages FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- reservations: users see own, event creators see event reservations
CREATE POLICY "Users can view own reservations" ON public.reservations FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Event creators can view event reservations" ON public.reservations FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = reservations.event_id AND events.creator_id = auth.uid()));
CREATE POLICY "Users can create reservations" ON public.reservations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all reservations" ON public.reservations FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- check_ins: event creators and admins can manage
CREATE POLICY "Event creators can view check-ins" ON public.check_ins FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = check_ins.event_id AND events.creator_id = auth.uid()));
CREATE POLICY "Event creators can insert check-ins" ON public.check_ins FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM events WHERE events.id = check_ins.event_id AND events.creator_id = auth.uid()));
CREATE POLICY "Admins can manage all check-ins" ON public.check_ins FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own check-ins" ON public.check_ins FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
