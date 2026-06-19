
CREATE TABLE public.sponsoring_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.sponsoring_categories TO anon, authenticated;
GRANT ALL ON public.sponsoring_categories TO service_role;

ALTER TABLE public.sponsoring_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sponsoring categories are viewable by everyone"
  ON public.sponsoring_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins manage sponsoring categories"
  ON public.sponsoring_categories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.sponsoring_categories (name, sort_order) VALUES
  ('Équitation', 0),
  ('Basketball', 10),
  ('Course à pied', 20),
  ('Football', 30)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.sponsoring_categories (name, sort_order)
SELECT DISTINCT category, 100
FROM public.sponsoring_entries
WHERE category IS NOT NULL
  AND category NOT IN (SELECT name FROM public.sponsoring_categories)
ON CONFLICT (name) DO NOTHING;
