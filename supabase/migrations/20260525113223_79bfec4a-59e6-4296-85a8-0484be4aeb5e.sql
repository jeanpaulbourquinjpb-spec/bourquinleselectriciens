
-- public.projects
DROP POLICY IF EXISTS admin_write ON public.projects;
CREATE POLICY admin_write ON public.projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- public.project_photos
DROP POLICY IF EXISTS admin_write_photos ON public.project_photos;
CREATE POLICY admin_write_photos ON public.project_photos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- public.sponsoring_entries
DROP POLICY IF EXISTS admin_write_sponsoring_entries ON public.sponsoring_entries;
CREATE POLICY admin_write_sponsoring_entries ON public.sponsoring_entries FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- public.sponsoring_photos
DROP POLICY IF EXISTS admin_write_sponsoring_photos ON public.sponsoring_photos;
CREATE POLICY admin_write_sponsoring_photos ON public.sponsoring_photos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- public.partners
DROP POLICY IF EXISTS admin_write_partners ON public.partners;
CREATE POLICY admin_write_partners ON public.partners FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- storage.objects
DROP POLICY IF EXISTS admin_write_objects ON storage.objects;
CREATE POLICY admin_write_objects ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'project-photos' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'project-photos' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Sponsoring photos bucket admin delete" ON storage.objects;
DROP POLICY IF EXISTS "Sponsoring photos bucket admin update" ON storage.objects;
DROP POLICY IF EXISTS "Sponsoring photos bucket admin write" ON storage.objects;
CREATE POLICY "Sponsoring photos bucket admin all" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'sponsoring-photos' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'sponsoring-photos' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admin can delete partner logos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update partner logos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload partner logos" ON storage.objects;
CREATE POLICY "Admin can manage partner logos" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'partner-logos' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'partner-logos' AND public.has_role(auth.uid(), 'admin'));
