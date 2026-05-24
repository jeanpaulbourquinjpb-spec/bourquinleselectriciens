
-- Drop legacy sponsoring_photos and recreate with new model
DROP TABLE IF EXISTS public.sponsoring_photos CASCADE;

-- Sponsoring entries (mirrors projects)
CREATE TABLE public.sponsoring_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sponsoring_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sponsoring entries are publicly viewable"
ON public.sponsoring_entries FOR SELECT
USING (true);

CREATE POLICY "admin_write_sponsoring_entries"
ON public.sponsoring_entries FOR ALL
TO authenticated
USING (auth.email() = 'jean-paul@bourquinelectricite.ch')
WITH CHECK (auth.email() = 'jean-paul@bourquinelectricite.ch');

CREATE TRIGGER sponsoring_entries_updated_at
BEFORE UPDATE ON public.sponsoring_entries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Sponsoring photos (gallery per entry)
CREATE TABLE public.sponsoring_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_id UUID NOT NULL REFERENCES public.sponsoring_entries(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sponsoring_photos_entry ON public.sponsoring_photos(entry_id);

ALTER TABLE public.sponsoring_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sponsoring photos are publicly viewable"
ON public.sponsoring_photos FOR SELECT
USING (true);

CREATE POLICY "admin_write_sponsoring_photos"
ON public.sponsoring_photos FOR ALL
TO authenticated
USING (auth.email() = 'jean-paul@bourquinelectricite.ch')
WITH CHECK (auth.email() = 'jean-paul@bourquinelectricite.ch');

-- Storage bucket for sponsoring photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('sponsoring-photos', 'sponsoring-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Sponsoring photos bucket public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'sponsoring-photos');

CREATE POLICY "Sponsoring photos bucket admin write"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'sponsoring-photos' AND auth.email() = 'jean-paul@bourquinelectricite.ch');

CREATE POLICY "Sponsoring photos bucket admin update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'sponsoring-photos' AND auth.email() = 'jean-paul@bourquinelectricite.ch');

CREATE POLICY "Sponsoring photos bucket admin delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'sponsoring-photos' AND auth.email() = 'jean-paul@bourquinelectricite.ch');
