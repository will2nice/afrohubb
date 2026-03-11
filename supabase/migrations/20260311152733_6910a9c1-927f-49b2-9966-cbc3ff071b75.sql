
-- Add onboarding fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS nationality text DEFAULT '',
  ADD COLUMN IF NOT EXISTS languages text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS looking_for text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS diaspora_roots text DEFAULT '',
  ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;
