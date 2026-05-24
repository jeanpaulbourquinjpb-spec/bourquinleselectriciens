import { useEffect, useMemo, useState, useRef } from "react";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2, Trash2, Upload, RefreshCcw, Instagram, Plus, X, GripVertical } from "lucide-react";
import {
  listProjects,
  createProject,
  deleteProject,
  addProjectPhoto,
  deleteProjectPhoto,
  reorderProjects,
  reorderProjectPhotos,
  isCurrentUserAdmin,
  CATEGORIES,
  type ProjectDTO,
  type ProjectPhotoDTO,
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
              <p className="text-xs text-[color:var(--muted-foreground)] mb-4">
                Glissez les projets pour les réordonner. L'ordre est appliqué sur la page publique.
              </p>
              {projectsQuery.isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ProjectsList
                  projects={projectsQuery.data?.projects ?? []}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function ProjectsList({
  projects,
  onDelete,
}: {
  projects: ProjectDTO[];
  onDelete: (id: string) => void;
}) {
  const queryClient = useQueryClient();
  const reorder = useServerFn(reorderProjects);
  const [order, setOrder] = useState<string[]>(projects.map((p) => p.id));
  const [dragId, setDragId] = useState<string | null>(null);

  // sync when server data changes
  useEffect(() => {
    setOrder(projects.map((p) => p.id));
  }, [projects]);

  const byId = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);
  const ordered = order.map((id) => byId.get(id)).filter(Boolean) as ProjectDTO[];

  function onDragStart(id: string) {
    setDragId(id);
  }
  function onDragOver(e: React.DragEvent, overId: string) {
    e.preventDefault();
    if (!dragId || dragId === overId) return;
    setOrder((prev) => {
      const next = [...prev];
      const from = next.indexOf(dragId);
      const to = next.indexOf(overId);
      if (from === -1 || to === -1) return prev;
      next.splice(from, 1);
      next.splice(to, 0, dragId);
      return next;
    });
  }
  async function onDragEnd() {
    const ids = order;
    setDragId(null);
    try {
      await reorder({ data: { ids } });
      toast.success("Ordre des projets enregistré");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {ordered.map((p) => (
        <div
          key={p.id}
          draggable
          onDragStart={() => onDragStart(p.id)}
          onDragOver={(e) => onDragOver(e, p.id)}
          onDragEnd={onDragEnd}
          className={cn(
            "transition-opacity",
            dragId === p.id ? "opacity-50" : "opacity-100",
          )}
        >
          <AdminProjectCard p={p} onDelete={() => onDelete(p.id)} />
        </div>
      ))}
    </div>
  );
}

const ALLOWED: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};
const MAX_SIZE = 10 * 1024 * 1024;

async function uploadToStorage(file: File): Promise<string> {
  if (file.size > MAX_SIZE) {
    throw new Error(`Fichier "${file.name}" trop volumineux (max 10 Mo).`);
  }
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const contentType = file.type || ALLOWED[ext];
  if (!contentType || !Object.values(ALLOWED).includes(contentType) || !(ext in ALLOWED)) {
    throw new Error(`Format non supporté pour "${file.name}". JPG, PNG ou WEBP.`);
  }
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("project-photos")
    .upload(path, file, { contentType, cacheControl: "3600", upsert: false });
  if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from("project-photos").getPublicUrl(path);
  return pub.publicUrl;
}

function AdminProjectCard({ p, onDelete }: { p: ProjectDTO; onDelete: () => void }) {
  const queryClient = useQueryClient();
  const addPhoto = useServerFn(addProjectPhoto);
  const removePhoto = useServerFn(deleteProjectPhoto);
  const reorderPhotos = useServerFn(reorderProjectPhotos);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [photoOrder, setPhotoOrder] = useState<string[]>(p.photos.map((ph) => ph.id));
  const [dragPhoto, setDragPhoto] = useState<string | null>(null);

  useEffect(() => {
    setPhotoOrder(p.photos.map((ph) => ph.id));
  }, [p.photos]);

  const photosById = new Map<string, ProjectPhotoDTO>(p.photos.map((ph) => [ph.id, ph]));
  const orderedPhotos = photoOrder
    .map((id) => photosById.get(id))
    .filter(Boolean) as ProjectPhotoDTO[];

  async function handleAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setBusy(true);
    let ok = 0;
    for (const f of files) {
      try {
        const url = await uploadToStorage(f);
        await addPhoto({ data: { project_id: p.id, url } });
        ok++;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur upload");
      }
    }
    if (ok > 0) toast.success(`${ok} photo(s) ajoutée(s).`);
    if (fileRef.current) fileRef.current.value = "";
    setBusy(false);
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  }

  async function handleRemovePhoto(id: string) {
    if (!confirm("Supprimer cette photo ?")) return;
    try {
      await removePhoto({ data: { id } });
      toast.success("Photo supprimée");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  }

  function onPhotoDragOver(e: React.DragEvent, overId: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!dragPhoto || dragPhoto === overId) return;
    setPhotoOrder((prev) => {
      const next = [...prev];
      const from = next.indexOf(dragPhoto);
      const to = next.indexOf(overId);
      if (from === -1 || to === -1) return prev;
      next.splice(from, 1);
      next.splice(to, 0, dragPhoto);
      return next;
    });
  }

  async function onPhotoDragEnd() {
    const ids = photoOrder;
    setDragPhoto(null);
    if (ids.length < 2) return;
    try {
      await reorderPhotos({ data: { project_id: p.id, photo_ids: ids } });
      toast.success("Ordre des photos enregistré");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  }

  return (
    <div className="card-soft p-4 space-y-3">
      <div className="flex gap-3">
        <div className="shrink-0 cursor-grab text-[color:var(--muted-foreground)] flex items-center">
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="w-20 h-20 shrink-0 bg-[color:var(--surface-muted)] rounded overflow-hidden">
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

      <div>
        <p className="text-[11px] text-[color:var(--muted-foreground)] mb-1">
          Glissez les photos pour changer l'ordre. La première est la couverture.
        </p>
        <div className="flex flex-wrap gap-2">
          {orderedPhotos.map((ph, i) => (
            <div
              key={ph.id}
              draggable
              onDragStart={(e) => {
                e.stopPropagation();
                setDragPhoto(ph.id);
              }}
              onDragOver={(e) => onPhotoDragOver(e, ph.id)}
              onDragEnd={onPhotoDragEnd}
              className={cn(
                "relative group cursor-grab",
                dragPhoto === ph.id && "opacity-50",
              )}
            >
              <img
                src={ph.url}
                alt=""
                className={cn(
                  "w-16 h-16 object-cover rounded border-2",
                  i === 0 ? "border-primary" : "border-transparent",
                )}
              />
              {i === 0 && (
                <span className="absolute -top-1 -left-1 bg-primary text-primary-foreground text-[9px] font-bold px-1 rounded">
                  COUV
                </span>
              )}
              <button
                type="button"
                title="Supprimer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePhoto(ph.id);
                }}
                className="absolute -top-1 -right-1 bg-white border rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-destructive" />
              </button>
            </div>
          ))}
          <label
            className={cn(
              "w-16 h-16 rounded border-2 border-dashed border-[color:var(--border)] flex items-center justify-center cursor-pointer hover:bg-[color:var(--surface-muted)]",
              busy && "opacity-50 cursor-wait",
            )}
          >
            {busy ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleAdd}
              disabled={busy}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function UploadCard({ onCreated }: { onCreated: () => void }) {
  const create = useServerFn(createProject);
  const addPhoto = useServerFn(addProjectPhoto);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Résidentiel");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("Veuillez sélectionner au moins une photo");
      return;
    }
    if (!title.trim()) {
      toast.error("Le titre est requis.");
      return;
    }

    setUploading(true);
    try {
      // Upload first file as cover
      const coverUrl = await uploadToStorage(files[0]);
      const { project } = await create({
        data: {
          title: title.trim(),
          description: description.trim() || null,
          category,
          image_url: coverUrl,
          source_type: "upload",
        },
      });
      // Upload additional photos
      for (let i = 1; i < files.length; i++) {
        try {
          const url = await uploadToStorage(files[i]);
          await addPhoto({ data: { project_id: project.id, url } });
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Erreur photo additionnelle");
        }
      }
      toast.success(`Projet créé avec ${files.length} photo(s).`);
      setTitle("");
      setDescription("");
      setFiles([]);
      if (fileRef.current) fileRef.current.value = "";
      onCreated();
    } catch (e) {
      console.error("Upload error:", e);
      const msg = e instanceof Error ? e.message : "Erreur inconnue";
      toast.error(`Échec de l'upload : ${msg}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-soft p-6 space-y-4 h-fit sticky top-24">
      <h2 className="text-xl">Ajouter un projet</h2>

      <div>
        <Label htmlFor="file">Photos (jpg, png, webp — la première sera la couverture)</Label>
        <Input
          ref={fileRef}
          id="file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />
        {files.length > 0 && (
          <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
            {files.length} fichier(s) sélectionné(s)
          </p>
        )}
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
