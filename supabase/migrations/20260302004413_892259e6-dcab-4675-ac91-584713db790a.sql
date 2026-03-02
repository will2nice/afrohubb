
CREATE TABLE public.waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  referral_code text NOT NULL UNIQUE DEFAULT substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
  referred_by text REFERENCES public.waitlist_signups(referral_code),
  referral_count integer NOT NULL DEFAULT 0,
  position serial,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public signup)
CREATE POLICY "Anyone can sign up for waitlist" ON public.waitlist_signups
  FOR INSERT WITH CHECK (true);

-- Anyone can read their own entry by email (for confirmation screen)
CREATE POLICY "Anyone can read waitlist" ON public.waitlist_signups
  FOR SELECT USING (true);

-- Function to increment referral count when someone uses a code
CREATE OR REPLACE FUNCTION public.increment_referral_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.referred_by IS NOT NULL THEN
    UPDATE public.waitlist_signups
    SET referral_count = referral_count + 1
    WHERE referral_code = NEW.referred_by;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_waitlist_signup_referral
  AFTER INSERT ON public.waitlist_signups
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_referral_count();
