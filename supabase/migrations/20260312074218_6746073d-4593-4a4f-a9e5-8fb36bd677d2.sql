
-- 1. Notify conversation members when a message is sent
CREATE OR REPLACE FUNCTION public.notify_on_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r record;
  sender_name text;
BEGIN
  SELECT display_name INTO sender_name FROM public.profiles WHERE id = NEW.sender_id;
  FOR r IN
    SELECT user_id FROM public.conversation_members
    WHERE conversation_id = NEW.conversation_id AND user_id != NEW.sender_id
  LOOP
    INSERT INTO public.notifications (user_id, type, title, body, data)
    VALUES (
      r.user_id,
      'message',
      'New message from ' || COALESCE(sender_name, 'Someone'),
      LEFT(NEW.content, 100),
      jsonb_build_object('conversation_id', NEW.conversation_id, 'sender_id', NEW.sender_id)
    );
  END LOOP;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_message_notify
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_message();

-- 2. Notify event creator when someone RSVPs
CREATE OR REPLACE FUNCTION public.notify_on_rsvp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_creator_id uuid;
  v_event_title text;
  v_user_name text;
BEGIN
  SELECT creator_id, title INTO v_creator_id, v_event_title
  FROM public.events WHERE id = NEW.event_id;
  
  IF v_creator_id IS NOT NULL AND v_creator_id != NEW.user_id THEN
    SELECT display_name INTO v_user_name FROM public.profiles WHERE id = NEW.user_id;
    INSERT INTO public.notifications (user_id, type, title, body, data)
    VALUES (
      v_creator_id,
      'event_invite',
      COALESCE(v_user_name, 'Someone') || ' is going to your event',
      COALESCE(v_event_title, 'your event'),
      jsonb_build_object('event_id', NEW.event_id, 'user_id', NEW.user_id)
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_rsvp_notify
  AFTER INSERT ON public.event_rsvps
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_rsvp();

-- 3. Notify group members when someone posts in a group
CREATE OR REPLACE FUNCTION public.notify_on_group_post()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r record;
  v_group_name text;
  v_poster_name text;
BEGIN
  SELECT name INTO v_group_name FROM public.groups WHERE id = NEW.group_id;
  SELECT display_name INTO v_poster_name FROM public.profiles WHERE id = NEW.user_id;
  
  FOR r IN
    SELECT user_id FROM public.group_members
    WHERE group_id = NEW.group_id AND user_id != NEW.user_id
    LIMIT 500
  LOOP
    INSERT INTO public.notifications (user_id, type, title, body, data)
    VALUES (
      r.user_id,
      'group_activity',
      'New post in ' || COALESCE(v_group_name, 'a group'),
      COALESCE(v_poster_name, 'Someone') || ': ' || LEFT(NEW.content, 80),
      jsonb_build_object('group_id', NEW.group_id, 'post_id', NEW.id)
    );
  END LOOP;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_group_post_notify
  AFTER INSERT ON public.group_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_group_post();

-- 4. Notify users in the same city when a new event is created
CREATE OR REPLACE FUNCTION public.notify_on_new_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT id FROM public.profiles
    WHERE city = NEW.city AND id != NEW.creator_id
    LIMIT 200
  LOOP
    INSERT INTO public.notifications (user_id, type, title, body, data)
    VALUES (
      r.id,
      'nearby_event',
      '🎉 New event near you: ' || NEW.title,
      COALESCE(NEW.description, ''),
      jsonb_build_object('event_id', NEW.id, 'city', NEW.city)
    );
  END LOOP;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_event_notify
  AFTER INSERT ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_new_event();
