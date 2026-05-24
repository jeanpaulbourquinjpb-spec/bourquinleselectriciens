
CREATE TABLE public.project_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_photos_project ON public.project_photos(project_id, sort_order);

ALTER TABLE public.project_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project photos are publicly viewable"
  ON public.project_photos FOR SELECT
  TO public USING (true);

CREATE POLICY "admin_write_photos"
  ON public.project_photos FOR ALL
  TO authenticated
  USING (auth.email() = 'jean-paul@bourquinelectricite.ch')
  WITH CHECK (auth.email() = 'jean-paul@bourquinelectricite.ch');

-- Backfill: insert existing project image_url as cover photo
INSERT INTO public.project_photos (project_id, url, is_cover, sort_order)
SELECT id, image_url, true, 0
FROM public.projects
WHERE image_url IS NOT NULL AND image_url <> '';
