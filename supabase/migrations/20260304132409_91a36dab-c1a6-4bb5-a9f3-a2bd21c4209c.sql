
-- Fix infinite recursion in conversation_members SELECT policy
-- The old policy queries conversation_members to check access to conversation_members = recursion
DROP POLICY IF EXISTS "Members can view members" ON public.conversation_members;
CREATE POLICY "Members can view own memberships"
  ON public.conversation_members
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Fix conversations SELECT policy  
-- The old policy had a bug: conversation_members.conversation_id = conversation_members.id (wrong join)
-- and also caused recursion through conversation_members
DROP POLICY IF EXISTS "Members can view conversations" ON public.conversations;
CREATE POLICY "Members can view conversations"
  ON public.conversations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_members cm
      WHERE cm.conversation_id = conversations.id
        AND cm.user_id = auth.uid()
    )
  );

-- Fix messages SELECT policy to avoid recursion through conversation_members
DROP POLICY IF EXISTS "Members can view messages" ON public.messages;
CREATE POLICY "Members can view messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_members cm
      WHERE cm.conversation_id = messages.conversation_id
        AND cm.user_id = auth.uid()
    )
  );

-- Fix messages INSERT policy
DROP POLICY IF EXISTS "Members can send messages" ON public.messages;
CREATE POLICY "Members can send messages"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversation_members cm
      WHERE cm.conversation_id = messages.conversation_id
        AND cm.user_id = auth.uid()
    )
  );
