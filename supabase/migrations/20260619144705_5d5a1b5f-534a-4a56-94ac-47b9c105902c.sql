CREATE TABLE public.project_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.project_categories TO anon, authenticated;
GRANT ALL ON public.project_categories TO service_role;

ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON public.project_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins manage categories"
  ON public.project_categories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.project_categories (name, sort_order) VALUES
  ('Résidentiel', 10),
  ('Commercial', 20),
  ('Éclairage', 30),
  ('Rénovation', 40),
  ('Grands projets', 50),
  ('Industriel', 60),
  ('Télécom', 70);
