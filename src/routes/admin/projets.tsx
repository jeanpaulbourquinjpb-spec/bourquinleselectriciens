import { useEffect, useState, useRef } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Trash2, Upload, RefreshCcw, Instagram } from "lucide-react";
import {
  listProjects,
  createProject,
  deleteProject,
  isCurrentUserAdmin,
  CATEGORIES,
  type ProjectDTO,
} from "@/lib/projects.functions";
import { scrapeInstagramPosts } from "@/lib/scrape-instagram.functions";

export const Route = createFileRoute("/admin/projets")({
  component: AdminProjetsPage,
  head: () => ({
    meta: [{ title: "Admin — Projets" }, { name: "robots", content: "noindex" }],
  }),
});

function AdminProjetsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const list = useServerFn(listProjects);
  const checkAdmin = useServerFn(isCurrentUserAdmin);
  const remove = useServerFn(deleteProject);
  const scrape = useServerFn(scrapeInstagramPosts);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate({ to: "/login" });
        return;
      }
      setUserEmail(data.session.user.email ?? null);
      try {
        const res = await checkAdmin();
        if (cancelled) return;
        setIsAdmin(res.isAdmin);
        setAuthChecked(true);
      } catch {
        setAuthChecked(true);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate({ to: "/login" });
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [navigate, checkAdmin]);


  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => list(),
    enabled: isAdmin,
  });

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  const [scraping, setScraping] = useState(false);
  async function handleScrape() {
    setScraping(true);
    try {
      const res = await scrape();
      const added = res.results.filter((r) => r.status === "added").length;
      const noImg = res.results.filter((r) => r.status === "no_image").length;
      const err = res.results.filter((r) => r.status === "error").length;
      toast.success(
        `Import Instagram : ${added} ajoutés, ${noImg} sans image (à compléter), ${err} erreurs.`,
      );
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur lors du scraping");
    } finally {
      setScraping(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce projet ?")) return;
    try {
      await remove({ data: { id } });
      toast.success("Projet supprimé");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div>
        <SiteHeader />
        <section className="py-24">
          <div className="container-x max-w-md text-center">
            <h1 className="text-2xl">Accès refusé</h1>
            <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">
              Votre compte ({userEmail}) n'a pas les droits administrateur.
            </p>
            <Button onClick={handleSignOut} className="mt-6">
              Se déconnecter
            </Button>
          </div>
        </section>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div>
      <SiteHeader />
      <section className="py-16">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Administration</p>
              <h1 className="mt-2 text-3xl">Galerie « Nos projets »</h1>
              <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
                Connecté en tant que {userEmail}.{" "}
                <button onClick={handleSignOut} className="underline">
                  Déconnexion
                </button>
                {" · "}
                <Link to="/nos-projets" className="underline">
                  Voir la page publique
                </Link>
              </p>
            </div>
            <Button onClick={handleScrape} disabled={scraping} variant="secondary">
              {scraping ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCcw className="w-4 h-4 mr-2" />}
              Importer les posts Instagram
            </Button>
          </div>

          <div className="mt-10 grid lg:grid-cols-[1fr_2fr] gap-10">
            <UploadCard
              onCreated={() => queryClient.invalidateQueries({ queryKey: ["projects"] })}
            />


            <div>
              <h2 className="text-xl mb-4">
                Projets ({projectsQuery.data?.projects.length ?? 0})
              </h2>
              {projectsQuery.isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {projectsQuery.data?.projects.map((p) => (
                    <AdminProjectCard key={p.id} p={p} onDelete={() => handleDelete(p.id)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function AdminProjectCard({ p, onDelete }: { p: ProjectDTO; onDelete: () => void }) {
  return (
    <div className="card-soft p-4 flex gap-3">
      <div className="w-24 h-24 shrink-0 bg-[color:var(--surface-muted)] rounded overflow-hidden">
        {p.image_url ? (
          <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[color:var(--muted-foreground)]">{p.category ?? "—"}</p>
        <p className="text-sm font-medium truncate">{p.title}</p>
        <div className="flex items-center gap-3 mt-2">
          {p.instagram_url && (
            <a
              href={p.instagram_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs inline-flex items-center gap-1 text-[color:var(--muted-foreground)] hover:text-foreground"
            >
              <Instagram className="w-3 h-3" /> IG
            </a>
          )}
          <button
            onClick={onDelete}
            className="text-xs inline-flex items-center gap-1 text-destructive hover:underline"
          >
            <Trash2 className="w-3 h-3" /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

function UploadCard({ onCreated }: { onCreated: () => void }) {
  const create = useServerFn(createProject);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Résidentiel");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.error("Veuillez sélectionner une photo");
      return;
    }
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("Fichier trop volumineux. Taille maximale : 10 Mo.");
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const allowedTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };
    const contentType = file.type || allowedTypes[ext];
    if (!contentType || !Object.values(allowedTypes).includes(contentType) || !(ext in allowedTypes)) {
      toast.error("Format non supporté. Formats acceptés : JPG, PNG ou WEBP.");
      return;
    }
    if (!title.trim()) {
      toast.error("Le titre est requis.");
      return;
    }

    setUploading(true);
    try {
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("project-photos")
        .upload(path, file, { contentType, cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("project-photos").getPublicUrl(path);
      await create({
        data: {
          title: title.trim(),
          description: description.trim() || null,
          category,
          image_url: pub.publicUrl,
          source_type: "upload",
        },
      });
      toast.success("Photo uploadée avec succès.");
      setTitle("");
      setDescription("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      onCreated();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-soft p-6 space-y-4 h-fit sticky top-24">
      <h2 className="text-xl">Ajouter une photo</h2>

      <div>
        <Label htmlFor="file">Photo (jpg, png, webp)</Label>
        <Input
          ref={fileRef}
          id="file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <div>
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
        />
      </div>

      <div>
        <Label htmlFor="cat">Catégorie</Label>
        <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
          <SelectTrigger id="cat">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="desc">Description (optionnel)</Label>
        <Textarea
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          rows={4}
        />
      </div>

      <Button type="submit" disabled={uploading} className="w-full">
        {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
        Ajouter
      </Button>
    </form>
  );
}
