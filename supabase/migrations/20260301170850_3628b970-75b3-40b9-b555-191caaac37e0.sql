CREATE TABLE public.places (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'restaurant',
  subcategory text,
  city text NOT NULL,
  address text,
  latitude double precision,
  longitude double precision,
  cuisine_type text,
  description text DEFAULT '',
  image_url text,
  website text,
  phone text,
  price_range text,
  is_halal boolean DEFAULT false,
  is_ramadan_friendly boolean DEFAULT false,
  source text DEFAULT 'curated',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view places" ON public.places FOR SELECT USING (true);
CREATE POLICY "Admins can manage places" ON public.places FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
