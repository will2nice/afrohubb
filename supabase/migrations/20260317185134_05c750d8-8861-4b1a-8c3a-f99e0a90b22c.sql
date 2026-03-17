
-- Fix conversation_members INSERT policy to prevent unauthorized joins
DROP POLICY IF EXISTS "Authenticated users can join conversations" ON public.conversation_members;

-- Create a secure RPC for DM creation that handles both conversation + membership
CREATE OR REPLACE FUNCTION public.create_dm_conversation(_other_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_conv_id UUID;
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF v_user_id = _other_user_id THEN
    RAISE EXCEPTION 'Cannot create conversation with yourself';
  END IF;

  -- Check if a DM conversation already exists between these two users
  SELECT c.id INTO v_conv_id
  FROM conversations c
  JOIN conversation_members cm1 ON cm1.conversation_id = c.id AND cm1.user_id = v_user_id
  JOIN conversation_members cm2 ON cm2.conversation_id = c.id AND cm2.user_id = _other_user_id
  WHERE c.type = 'dm'
  LIMIT 1;

  IF v_conv_id IS NOT NULL THEN
    RETURN v_conv_id;
  END IF;

  -- Create new DM conversation
  INSERT INTO conversations (type) VALUES ('dm') RETURNING id INTO v_conv_id;

  -- Add both members
  INSERT INTO conversation_members (conversation_id, user_id) VALUES (v_conv_id, v_user_id);
  INSERT INTO conversation_members (conversation_id, user_id) VALUES (v_conv_id, _other_user_id);

  RETURN v_conv_id;
END;
$$;
