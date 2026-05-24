INSERT INTO storage.buckets (id, name, public, allowed_mime_types)
VALUES ('project-photos', 'project-photos', true, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE
SET public = true,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

DROP POLICY IF EXISTS "Project photos are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload project photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload project photos" ON storage.objects;

CREATE POLICY "Project photos are publicly accessible"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'project-photos');

CREATE POLICY "Authenticated users can upload project photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-photos'
  AND (
    lower(coalesce(metadata->>'mimetype', '')) IN ('image/jpeg', 'image/png', 'image/webp')
    OR lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp')
  )
);