
-- Add referral fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE DEFAULT substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
  ADD COLUMN IF NOT EXISTS referred_by text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS referral_count integer NOT NULL DEFAULT 0;

-- Backfill existing profiles with unique referral codes
UPDATE public.profiles SET referral_code = substr(replace(gen_random_uuid()::text, '-', ''), 1, 8) WHERE referral_code IS NULL;

-- Referrals tracking table
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL,
  referred_user_id uuid,
  referred_email text,
  status text NOT NULL DEFAULT 'invited',
  channel text DEFAULT 'link',
  created_at timestamptz NOT NULL DEFAULT now(),
  converted_at timestamptz
);

CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_id);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals"
  ON public.referrals FOR SELECT TO authenticated
  USING (auth.uid() = referrer_id);

CREATE POLICY "Users can insert own referrals"
  ON public.referrals FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Users can update own referrals"
  ON public.referrals FOR UPDATE TO authenticated
  USING (auth.uid() = referrer_id);

-- Function to get referral leaderboard
CREATE OR REPLACE FUNCTION public.get_referral_leaderboard(lim integer DEFAULT 20)
RETURNS TABLE(user_id uuid, display_name text, avatar_url text, referral_count integer, is_verified boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id AS user_id, p.display_name, p.avatar_url, p.referral_count, p.is_verified
  FROM public.profiles p
  WHERE p.referral_count > 0
  ORDER BY p.referral_count DESC
  LIMIT lim;
$$;

-- Trigger to increment referral count when a referral converts
CREATE OR REPLACE FUNCTION public.increment_profile_referral_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'converted' AND (OLD.status IS NULL OR OLD.status != 'converted') THEN
    UPDATE public.profiles
    SET referral_count = referral_count + 1
    WHERE id = NEW.referrer_id;
    NEW.converted_at = now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_referral_converted
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_profile_referral_count();
