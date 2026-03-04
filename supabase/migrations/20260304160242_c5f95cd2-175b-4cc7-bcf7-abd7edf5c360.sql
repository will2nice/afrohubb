
-- Function to create or join an event group chat
CREATE OR REPLACE FUNCTION public.join_event_chat(p_event_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conv_id uuid;
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check if a group conversation already exists for this event
  SELECT id INTO v_conv_id
  FROM conversations
  WHERE event_id = p_event_id AND type = 'event_group'
  LIMIT 1;

  -- If not, create one
  IF v_conv_id IS NULL THEN
    INSERT INTO conversations (type, event_id, title)
    VALUES ('event_group', p_event_id, NULL)
    RETURNING id INTO v_conv_id;
  END IF;

  -- Add user as member if not already
  INSERT INTO conversation_members (conversation_id, user_id)
  VALUES (v_conv_id, v_user_id)
  ON CONFLICT DO NOTHING;

  RETURN v_conv_id;
END;
$$;

-- Trigger function: auto-join event chat on RSVP
CREATE OR REPLACE FUNCTION public.auto_join_event_chat()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conv_id uuid;
BEGIN
  -- Check if a group conversation exists for this event
  SELECT id INTO v_conv_id
  FROM conversations
  WHERE event_id = NEW.event_id AND type = 'event_group'
  LIMIT 1;

  -- Create if not exists
  IF v_conv_id IS NULL THEN
    INSERT INTO conversations (type, event_id, title)
    VALUES ('event_group', NEW.event_id, NULL)
    RETURNING id INTO v_conv_id;
  END IF;

  -- Add user as member
  INSERT INTO conversation_members (conversation_id, user_id)
  VALUES (v_conv_id, NEW.user_id)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

-- Create trigger on event_rsvps
CREATE TRIGGER on_rsvp_join_event_chat
  AFTER INSERT ON public.event_rsvps
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_join_event_chat();

-- Add unique constraint on conversation_members to support ON CONFLICT
ALTER TABLE public.conversation_members
  ADD CONSTRAINT conversation_members_conversation_user_unique
  UNIQUE (conversation_id, user_id);

-- RLS: allow members to view event_group conversations (already covered by existing policy)
-- But we need to allow the security definer functions to insert without RLS issues
-- The functions are SECURITY DEFINER so they bypass RLS already

-- Allow authenticated users to view event_group conversations they're members of
-- (existing policy already handles this via conversation_members check)
