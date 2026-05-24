-- Partners table
CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text,
  logo_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners are publicly viewable"
  ON public.partners FOR SELECT
  USING (true);

CREATE POLICY "admin_write_partners"
  ON public.partners FOR ALL
  TO authenticated
  USING (auth.email() = 'jean-paul@bourquinelectricite.ch')
  WITH CHECK (auth.email() = 'jean-paul@bourquinelectricite.ch');

CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('partner-logos', 'partner-logos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Partner logos publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'partner-logos');

CREATE POLICY "Admin can upload partner logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'partner-logos' AND auth.email() = 'jean-paul@bourquinelectricite.ch');

CREATE POLICY "Admin can update partner logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'partner-logos' AND auth.email() = 'jean-paul@bourquinelectricite.ch');

CREATE POLICY "Admin can delete partner logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'partner-logos' AND auth.email() = 'jean-paul@bourquinelectricite.ch');
