CREATE TABLE IF NOT EXISTS public.sponsoring_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.sponsoring_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sponsoring photos are publicly viewable"
ON public.sponsoring_photos FOR SELECT
USING (true);

CREATE POLICY "admin_write_sponsoring"
ON public.sponsoring_photos FOR ALL
TO authenticated
USING (auth.email() = 'jean-paul@bourquinelectricite.ch')
WITH CHECK (auth.email() = 'jean-paul@bourquinelectricite.ch');

CREATE INDEX IF NOT EXISTS sponsoring_photos_category_sort_idx
ON public.sponsoring_photos (category, sort_order);