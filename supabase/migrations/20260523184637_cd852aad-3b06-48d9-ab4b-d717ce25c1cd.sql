
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- First signed-up user becomes admin automatically
CREATE OR REPLACE FUNCTION public.assign_first_admin()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_first_admin();

-- Projects table
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text,
  image_url text NOT NULL,
  instagram_url text,
  source_type text NOT NULL DEFAULT 'upload',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are publicly viewable" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert projects" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update projects" ON public.projects
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete projects" ON public.projects
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for project photos
INSERT INTO storage.buckets (id, name, public) VALUES ('project-photos', 'project-photos', true);

CREATE POLICY "Project photos are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-photos');

CREATE POLICY "Admins can upload project photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update project photos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'project-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete project photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'project-photos' AND public.has_role(auth.uid(), 'admin'));
