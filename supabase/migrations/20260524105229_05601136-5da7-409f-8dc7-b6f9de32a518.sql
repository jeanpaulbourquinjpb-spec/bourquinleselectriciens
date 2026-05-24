
-- Projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_all" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Projects are publicly viewable" ON public.projects;

CREATE POLICY "Projects are publicly viewable"
ON public.projects
FOR SELECT
TO public
USING (true);

CREATE POLICY "admin_all"
ON public.projects
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Storage policies for project-photos bucket
DROP POLICY IF EXISTS "admin_upload" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload project photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update project photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete project photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view project photos" ON storage.objects;

CREATE POLICY "Public can view project photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'project-photos');

CREATE POLICY "admin_upload"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'project-photos')
WITH CHECK (bucket_id = 'project-photos');
