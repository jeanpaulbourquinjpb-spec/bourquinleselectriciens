
DROP POLICY IF EXISTS "Authenticated users can upload project photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update project photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete project photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload project photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update project photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete project photos" ON storage.objects;

CREATE POLICY "Admins can upload project photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'project-photos'
  AND has_role(auth.uid(), 'admin'::app_role)
  AND (lower(storage.extension(name)) = ANY (ARRAY['jpg','jpeg','png','webp']))
);

CREATE POLICY "Admins can update project photos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'project-photos' AND has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'project-photos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete project photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'project-photos' AND has_role(auth.uid(), 'admin'::app_role));
