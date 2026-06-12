
-- 1. Fix jobs admin_write policy: scope to authenticated instead of public
DROP POLICY IF EXISTS admin_write_jobs ON public.jobs;
CREATE POLICY admin_write_jobs ON public.jobs
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. Lock down SECURITY DEFINER functions
-- Trigger-only functions: revoke EXECUTE from everyone (triggers run as table owner)
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.assign_first_admin() FROM PUBLIC, anon, authenticated;

-- has_role is referenced by RLS policies; restrict to authenticated only
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
