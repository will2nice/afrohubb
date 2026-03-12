
-- Community Groups
CREATE TABLE public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  icon_emoji text NOT NULL DEFAULT '🌍',
  cover_url text,
  category text NOT NULL DEFAULT 'general',
  member_count integer NOT NULL DEFAULT 0,
  creator_id uuid NOT NULL,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_groups_category ON public.groups(category);
CREATE INDEX idx_groups_featured ON public.groups(is_featured) WHERE is_featured = true;

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view groups" ON public.groups FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated can create groups" ON public.groups FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creator can update group" ON public.groups FOR UPDATE TO authenticated USING (auth.uid() = creator_id);
CREATE POLICY "Creator can delete group" ON public.groups FOR DELETE TO authenticated USING (auth.uid() = creator_id);

-- Group Members
CREATE TABLE public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member',
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

CREATE INDEX idx_group_members_user ON public.group_members(user_id);
CREATE INDEX idx_group_members_group ON public.group_members(group_id);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view members" ON public.group_members FOR SELECT TO public USING (true);
CREATE POLICY "Users can join groups" ON public.group_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave groups" ON public.group_members FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage members" ON public.group_members FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Group Posts (discussion feed)
CREATE TABLE public.group_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  image_url text,
  likes_count integer NOT NULL DEFAULT 0,
  comments_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_group_posts_group ON public.group_posts(group_id, created_at DESC);

ALTER TABLE public.group_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view group posts" ON public.group_posts FOR SELECT TO public USING (true);
CREATE POLICY "Members can post" ON public.group_posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM public.group_members WHERE group_id = group_posts.group_id AND user_id = auth.uid()
  ));
CREATE POLICY "Authors can delete own posts" ON public.group_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trigger to update member_count
CREATE OR REPLACE FUNCTION public.update_group_member_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.groups SET member_count = member_count - 1 WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER on_group_member_change
  AFTER INSERT OR DELETE ON public.group_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_group_member_count();

-- Seed default groups
INSERT INTO public.groups (name, slug, description, icon_emoji, category, creator_id, is_featured) VALUES
  ('AfroTech', 'afrotech', 'Technology, startups & innovation in the African diaspora', '💻', 'tech', '00000000-0000-0000-0000-000000000000', true),
  ('AfroBusiness', 'afrobusiness', 'Entrepreneurship, finance & business networking', '💼', 'business', '00000000-0000-0000-0000-000000000000', true),
  ('AfroMusic', 'afromusic', 'Afrobeats, Amapiano, Highlife & all genres of African music', '🎵', 'music', '00000000-0000-0000-0000-000000000000', true),
  ('AfroStudents', 'afrostudents', 'Student life, scholarships & academic opportunities', '📚', 'education', '00000000-0000-0000-0000-000000000000', true),
  ('AfroFitness', 'afrofitness', 'Health, fitness & wellness in the community', '🏋️', 'wellness', '00000000-0000-0000-0000-000000000000', true),
  ('AfroTravel', 'afrotravel', 'Travel tips, destinations & diaspora adventures', '✈️', 'travel', '00000000-0000-0000-0000-000000000000', true),
  ('AfroFood', 'afrofood', 'Recipes, restaurants & food culture', '🍛', 'food', '00000000-0000-0000-0000-000000000000', true),
  ('AfroFashion', 'afrofashion', 'African fashion, streetwear & style inspiration', '👗', 'fashion', '00000000-0000-0000-0000-000000000000', true);
