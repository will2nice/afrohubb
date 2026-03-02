
-- Allow admins to update and delete waitlist signups
CREATE POLICY "Admins can manage waitlist" ON public.waitlist_signups
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
