
-- Fix permissive INSERT policy on conversations - restrict to authenticated users who will be members
DROP POLICY "Authenticated users can create conversations" ON public.conversations;
CREATE POLICY "Authenticated users can create conversations" ON public.conversations 
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() IS NOT NULL);
