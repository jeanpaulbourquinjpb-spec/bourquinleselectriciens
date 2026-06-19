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
import {
  Loader2,
  Trash2,
  Upload,
  Instagram,
  Plus,
  X,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Pencil,
  Check,
} from "lucide-react";
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  addProjectPhoto,
  deleteProjectPhoto,
  reorderProjects,
  reorderProjectPhotos,
  isCurrentUserAdmin,
  listProjectCategories,
  createProjectCategory,
  updateProjectCategory,
  deleteProjectCategory,
  type ProjectDTO,
  type ProjectPhotoDTO,
} from "@/lib/projects.functions";
import {
  listSponsoringEntries,
  createSponsoringEntry,
  updateSponsoringEntry,
  deleteSponsoringEntry,
  addSponsoringPhoto,
  deleteSponsoringPhoto,
  reorderSponsoringEntries,
  reorderSponsoringPhotos,
  listSponsoringCategories,
  createSponsoringCategory,
  updateSponsoringCategory,
  deleteSponsoringCategory,
  type SponsoringEntryDTO,
  type SponsoringPhotoDTO,
} from "@/lib/sponsoring.functions";
import { CategorySelectWithManager, type CategoryFns } from "@/components/CategoryManager";

import {
  listPartners,
  createPartner,
  updatePartner,
  deletePartner,
  reorderPartners,
  type PartnerDTO,
} from "@/lib/partners.functions";
import { JobsAdmin } from "@/components/JobsAdmin";
import { DocumentsAdmin } from "@/components/DocumentsAdmin";


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
              <h1 className="mt-2 text-3xl">Gestion du contenu</h1>
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
          </div>

          <AdminTabs
            projects={projectsQuery.data?.projects ?? []}
            projectsLoading={projectsQuery.isLoading}
            onDeleteProject={handleDelete}
            onProjectsChanged={() => queryClient.invalidateQueries({ queryKey: ["projects"] })}
          />
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function AdminTabs({
  projects,
  projectsLoading,
  onDeleteProject,
  onProjectsChanged,
}: {
  projects: ProjectDTO[];
  projectsLoading: boolean;
  onDeleteProject: (id: string) => void;
  onProjectsChanged: () => void;
}) {
  const [tab, setTab] = useState<
    "projets" | "sponsoring" | "partenaires" | "carrieres" | "documents"
  >("projets");
  const [editingProject, setEditingProject] = useState<ProjectDTO | null>(null);

  // Keep editingProject in sync with latest data from server (photos may have changed)
  useEffect(() => {
    if (!editingProject) return;
    const fresh = projects.find((p) => p.id === editingProject.id);
    if (!fresh) {
      setEditingProject(null);
    } else if (fresh !== editingProject) {
      setEditingProject(fresh);
    }
  }, [projects, editingProject]);


  return (
    <div className="mt-8">
      <div className="border-b border-[color:var(--border)] flex gap-2 flex-wrap">
        {([
          ["projets", "Nos Projets"],
          ["sponsoring", "Sponsoring"],
          ["partenaires", "Associations & Partenariats"],
          ["carrieres", "Carrières"],
          ["documents", "Documents"],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              tab === key
                ? "border-primary text-foreground"
                : "border-transparent text-[color:var(--muted-foreground)] hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "projets" ? (
        <div className="mt-8">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
            <div className="space-y-6">
              <UploadCard
                editingProject={editingProject}
                onCancelEdit={() => setEditingProject(null)}
                onCreated={onProjectsChanged}
                onUpdated={() => {
                  setEditingProject(null);
                  onProjectsChanged();
                }}
              />
            </div>

            <div>
              <h2 className="text-xl mb-4">Projets ({projects.length})</h2>
              <p className="text-xs text-[color:var(--muted-foreground)] mb-4">
                Glissez les projets ou utilisez les flèches pour les réordonner. L'ordre est
                appliqué sur la page publique.
              </p>
              {projectsLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ProjectsList
                  projects={projects}
                  onDelete={onDeleteProject}
                  onEdit={(p) => {
                    setEditingProject(p);
                    if (typeof window !== "undefined") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  editingId={editingProject?.id ?? null}
                />
              )}
            </div>
          </div>
        </div>
      ) : tab === "sponsoring" ? (
        <SponsoringAdmin />
      ) : tab === "partenaires" ? (
        <PartnersAdmin />
      ) : tab === "carrieres" ? (
        <JobsAdmin />
      ) : (
        <DocumentsAdmin />
      )}
    </div>
  );
}


function ProjectsList({
  projects,
  onDelete,
  onEdit,
  editingId,
}: {
  projects: ProjectDTO[];
  onDelete: (id: string) => void;
  onEdit: (p: ProjectDTO) => void;
  editingId: string | null;
}) {
  const queryClient = useQueryClient();
  const reorder = useServerFn(reorderProjects);
  const [order, setOrder] = useState<string[]>(projects.map((p) => p.id));
  const [dragId, setDragId] = useState<string | null>(null);

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

  async function persistOrder(ids: string[]) {
    try {
      await reorder({ data: { ids } });
      toast.success("Ordre des projets enregistré");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  }

  function move(id: string, dir: -1 | 1) {
    setOrder((prev) => {
      const i = prev.indexOf(id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      persistOrder(next);
      return next;
    });
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {ordered.map((p, i) => (
        <div
          key={p.id}
          draggable
          onDragStart={() => onDragStart(p.id)}
          onDragOver={(e) => onDragOver(e, p.id)}
          onDragEnd={onDragEnd}
          className={cn(
            "transition-opacity relative",
            dragId === p.id ? "opacity-50" : "opacity-100",
          )}
        >
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
            <button
              type="button"
              aria-label="Monter"
              disabled={i === 0}
              onClick={() => move(p.id, -1)}
              className="w-7 h-7 rounded bg-background border border-[color:var(--border)] flex items-center justify-center disabled:opacity-30 hover:bg-[color:var(--surface-muted)]"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              aria-label="Descendre"
              disabled={i === ordered.length - 1}
              onClick={() => move(p.id, 1)}
              className="w-7 h-7 rounded bg-background border border-[color:var(--border)] flex items-center justify-center disabled:opacity-30 hover:bg-[color:var(--surface-muted)]"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <AdminProjectCard
            p={p}
            onDelete={() => onDelete(p.id)}
            onEdit={() => onEdit(p)}
            isEditing={editingId === p.id}
          />

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

async function uploadToStorage(file: File, bucket = "project-photos"): Promise<string> {
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
    .from(bucket)
    .upload(path, file, { contentType, cacheControl: "3600", upsert: false });
  if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
  return pub.publicUrl;
}

function AdminProjectCard({
  p,
  onDelete,
  onEdit,
  isEditing,
}: {
  p: ProjectDTO;
  onDelete: () => void;
  onEdit: () => void;
  isEditing: boolean;
}) {
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
          {isEditing && (
            <p className="text-[10px] uppercase tracking-wider text-primary mt-1 font-semibold">
              En cours d'édition
            </p>
          )}
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
              onClick={onEdit}
              className="text-xs inline-flex items-center gap-1 text-primary hover:underline"
            >
              <Pencil className="w-3 h-3" /> Éditer
            </button>
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

const PROJECT_CATEGORY_FNS: CategoryFns = {
  list: listProjectCategories,
  create: createProjectCategory,
  update: updateProjectCategory,
  remove: deleteProjectCategory,
};

const SPONSORING_CATEGORY_FNS: CategoryFns = {
  list: listSponsoringCategories,
  create: createSponsoringCategory,
  update: updateSponsoringCategory,
  remove: deleteSponsoringCategory,
};

function UploadCard({
  onCreated,
  onUpdated,
  editingProject,
  onCancelEdit,
}: {
  onCreated: () => void;
  onUpdated: () => void;
  editingProject: ProjectDTO | null;
  onCancelEdit: () => void;
}) {
  const create = useServerFn(createProject);
  const update = useServerFn(updateProject);
  const addPhoto = useServerFn(addProjectPhoto);
  const removePhoto = useServerFn(deleteProjectPhoto);
  const reorderPhotos = useServerFn(reorderProjectPhotos);

  const isEditing = !!editingProject;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);


  // Pre-fill / reset when entering or leaving edit mode
  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title);
      setDescription(editingProject.description ?? "");
      setCategory(editingProject.category ?? categoryOptions[0] ?? "");
      setFiles([]);
      if (fileRef.current) fileRef.current.value = "";
    } else {
      setTitle("");
      setDescription("");
      setCategory(categoryOptions[0] ?? "");
      setFiles([]);
      if (fileRef.current) fileRef.current.value = "";
    }
  }, [editingProject, categoryOptions]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory(categoryOptions[0] ?? "");
    setFiles([]);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleRemoveExistingPhoto(id: string) {
    if (!editingProject) return;
    if (!confirm("Supprimer cette photo ?")) return;
    try {
      await removePhoto({ data: { id } });
      toast.success("Photo supprimée");
      onUpdatedSilent();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  }

  // Refresh list without exiting edit mode
  function onUpdatedSilent() {
    // Trigger parent invalidation; the AdminTabs effect keeps editingProject in sync
    onCreated();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Le titre est requis.");
      return;
    }

    if (isEditing && editingProject) {
      setUploading(true);
      try {
        await update({
          data: {
            id: editingProject.id,
            title: title.trim(),
            description: description.trim() || null,
            category,
          },
        });
        // Upload any new photos appended in edit mode
        for (const f of files) {
          try {
            const url = await uploadToStorage(f);
            await addPhoto({ data: { project_id: editingProject.id, url } });
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erreur photo");
          }
        }
        toast.success("Projet mis à jour.");
        resetForm();
        onUpdated();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Erreur inconnue";
        toast.error(`Échec : ${msg}`);
      } finally {
        setUploading(false);
      }
      return;
    }

    // Create mode
    if (files.length === 0) {
      toast.error("Veuillez sélectionner au moins une photo");
      return;
    }

    setUploading(true);
    try {
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
      for (let i = 1; i < files.length; i++) {
        try {
          const url = await uploadToStorage(files[i]);
          await addPhoto({ data: { project_id: project.id, url } });
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Erreur photo additionnelle");
        }
      }
      toast.success(`Projet créé avec ${files.length} photo(s).`);
      resetForm();
      onCreated();
    } catch (e) {
      console.error("Upload error:", e);
      const msg = e instanceof Error ? e.message : "Erreur inconnue";
      toast.error(`Échec de l'upload : ${msg}`);
    } finally {
      setUploading(false);
    }
  }

  // Existing photos shown in edit mode (with reorder + delete)
  const existingPhotos = editingProject?.photos ?? [];
  const [photoOrder, setPhotoOrder] = useState<string[]>(existingPhotos.map((p) => p.id));
  const [dragPhoto, setDragPhoto] = useState<string | null>(null);
  useEffect(() => {
    setPhotoOrder(existingPhotos.map((p) => p.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProject?.id, existingPhotos.length, existingPhotos.map((p) => p.id).join(",")]);

  const photosById = new Map<string, ProjectPhotoDTO>(existingPhotos.map((p) => [p.id, p]));
  const orderedPhotos = photoOrder
    .map((id) => photosById.get(id))
    .filter(Boolean) as ProjectPhotoDTO[];

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
    if (!editingProject || ids.length < 2) return;
    try {
      await reorderPhotos({ data: { project_id: editingProject.id, photo_ids: ids } });
      toast.success("Ordre des photos enregistré");
      onUpdatedSilent();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-soft p-6 space-y-4 h-fit sticky top-24">
      <h2 className="text-xl">{isEditing ? "Éditer le projet" : "Ajouter un projet"}</h2>

      {isEditing && orderedPhotos.length > 0 && (
        <div>
          <Label>Photos existantes (glisser pour réordonner)</Label>
          <div className="flex flex-wrap gap-2 mt-1">
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
                    handleRemoveExistingPhoto(ph.id);
                  }}
                  className="absolute -top-1 -right-1 bg-white border rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="file">
          {isEditing
            ? "Ajouter des photos (optionnel)"
            : "Photos (jpg, png, webp — la première sera la couverture)"}
        </Label>
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
        <CategorySelectWithManager
          fns={PROJECT_CATEGORY_FNS}
          value={category}
          onValueChange={setCategory}
          triggerId="cat"
          onCategoriesLoaded={(names) => {
            setCategoryOptions(names);
            setCategory((prev) => prev || names[0] || "");
          }}
          fallbackCategories={editingProject?.category ? [editingProject.category] : []}
        />
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
        {uploading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : isEditing ? (
          <Check className="w-4 h-4 mr-2" />
        ) : (
          <Upload className="w-4 h-4 mr-2" />
        )}
        {isEditing ? "Mettre à jour" : "Ajouter"}
      </Button>

      {isEditing && (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => {
            resetForm();
            onCancelEdit();
          }}
          disabled={uploading}
        >
          Annuler
        </Button>
      )}
    </form>
  );
}


/* ============================== SPONSORING ============================== */

function SponsoringAdmin() {
  const queryClient = useQueryClient();
  const listFn = useServerFn(listSponsoringEntries);
  const deleteEntryFn = useServerFn(deleteSponsoringEntry);
  const reorderFn = useServerFn(reorderSponsoringEntries);

  const q = useQuery({ queryKey: ["sponsoring-entries"], queryFn: () => listFn() });
  const entries: SponsoringEntryDTO[] = q.data?.entries ?? [];




  const [order, setOrder] = useState<string[]>(entries.map((e) => e.id));
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    setOrder(entries.map((e) => e.id));
  }, [entries]);

  const byId = new Map(entries.map((e) => [e.id, e]));
  const ordered = order.map((id) => byId.get(id)).filter(Boolean) as SponsoringEntryDTO[];

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["sponsoring-entries"] });
  }

  async function persistOrder(ids: string[]) {
    try {
      await reorderFn({ data: { ids } });
      toast.success("Ordre enregistré");
      invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  }

  function move(id: string, dir: -1 | 1) {
    setOrder((prev) => {
      const i = prev.indexOf(id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      persistOrder(next);
      return next;
    });
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
    await persistOrder(ids);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette entrée et toutes ses photos ?")) return;
    try {
      await deleteEntryFn({ data: { id } });
      toast.success("Entrée supprimée");
      invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  }

  return (
    <div className="mt-8 grid lg:grid-cols-[1fr_2fr] gap-10">
      <SponsoringUploadCard onCreated={invalidate} />

      <div>
        <h2 className="text-xl mb-4">Entrées sponsoring ({entries.length})</h2>
        <p className="text-xs text-[color:var(--muted-foreground)] mb-4">
          Glissez les entrées ou utilisez les flèches pour les réordonner.
        </p>
        {q.isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {ordered.map((e, i) => (
              <div
                key={e.id}
                draggable
                onDragStart={() => setDragId(e.id)}
                onDragOver={(ev) => onDragOver(ev, e.id)}
                onDragEnd={onDragEnd}
                className={cn(
                  "transition-opacity relative",
                  dragId === e.id ? "opacity-50" : "opacity-100",
                )}
              >
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
                  <button
                    type="button"
                    aria-label="Monter"
                    disabled={i === 0}
                    onClick={() => move(e.id, -1)}
                    className="w-7 h-7 rounded bg-background border border-[color:var(--border)] flex items-center justify-center disabled:opacity-30 hover:bg-[color:var(--surface-muted)]"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Descendre"
                    disabled={i === ordered.length - 1}
                    onClick={() => move(e.id, 1)}
                    className="w-7 h-7 rounded bg-background border border-[color:var(--border)] flex items-center justify-center disabled:opacity-30 hover:bg-[color:var(--surface-muted)]"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <AdminSponsoringCard
                  entry={e}
                  onDelete={() => handleDelete(e.id)}
                  onChanged={invalidate}
                />

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SponsoringUploadCard({ onCreated }: { onCreated: () => void }) {
  const create = useServerFn(createSponsoringEntry);
  const addPhoto = useServerFn(addSponsoringPhoto);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
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
    const finalCategory = category;

    if (!finalCategory) {
      toast.error("La catégorie est requise.");
      return;
    }
    setUploading(true);
    try {
      const coverUrl = await uploadToStorage(files[0], "sponsoring-photos");
      const { entry } = await create({
        data: {
          title: title.trim(),
          description: description.trim() || null,
          category: finalCategory,
          image_url: coverUrl,
        },
      });
      const entryId = (entry as { id: string } | null)?.id;
      if (entryId) {
        for (let i = 1; i < files.length; i++) {
          try {
            const url = await uploadToStorage(files[i], "sponsoring-photos");
            await addPhoto({ data: { entry_id: entryId, url } });
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erreur photo additionnelle");
          }
        }
      }
      toast.success(`Entrée créée avec ${files.length} photo(s).`);
      setTitle("");
      setDescription("");
      setFiles([]);
      if (fileRef.current) fileRef.current.value = "";
      onCreated();

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(`Échec : ${msg}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-soft p-6 space-y-4 h-fit sticky top-24">
      <h2 className="text-xl">Ajouter une entrée sponsoring</h2>

      <div>
        <Label htmlFor="sp-file">Photos (la première sera la couverture)</Label>
        <Input
          ref={fileRef}
          id="sp-file"
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
        <Label htmlFor="sp-title">Titre</Label>
        <Input
          id="sp-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
        />
      </div>

      <div>
        <Label htmlFor="sp-cat">Catégorie</Label>
        <CategorySelectWithManager
          fns={SPONSORING_CATEGORY_FNS}
          value={category}
          onValueChange={setCategory}
          triggerId="sp-cat"
          onCategoriesLoaded={(names) =>
            setCategory((prev) => prev || names[0] || "")
          }
        />
      </div>


      <div>
        <Label htmlFor="sp-desc">Description (optionnel)</Label>
        <Textarea
          id="sp-desc"
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

function AdminSponsoringCard({
  entry,
  knownCategories,
  onDelete,
  onChanged,
}: {
  entry: SponsoringEntryDTO;
  knownCategories: string[];
  onDelete: () => void;
  onChanged: () => void;
}) {
  const update = useServerFn(updateSponsoringEntry);
  const addPhoto = useServerFn(addSponsoringPhoto);
  const removePhoto = useServerFn(deleteSponsoringPhoto);
  const reorderPhotos = useServerFn(reorderSponsoringPhotos);
  const fileRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(entry.title);
  const [description, setDescription] = useState(entry.description ?? "");
  const [category, setCategory] = useState(entry.category);
  const [addingCustom, setAddingCustom] = useState(false);
  const [customCat, setCustomCat] = useState("");
  const [busy, setBusy] = useState(false);
  const [photoOrder, setPhotoOrder] = useState<string[]>(entry.photos.map((p) => p.id));
  const [dragPhoto, setDragPhoto] = useState<string | null>(null);

  useEffect(() => {
    setPhotoOrder(entry.photos.map((p) => p.id));
    setTitle(entry.title);
    setDescription(entry.description ?? "");
    setCategory(entry.category);
  }, [entry]);

  const photosById = new Map<string, SponsoringPhotoDTO>(
    entry.photos.map((ph) => [ph.id, ph]),
  );
  const orderedPhotos = photoOrder
    .map((id) => photosById.get(id))
    .filter(Boolean) as SponsoringPhotoDTO[];

  async function saveEdit() {
    const finalCategory = addingCustom ? customCat.trim() : category;
    if (!title.trim()) {
      toast.error("Titre requis");
      return;
    }
    if (!finalCategory) {
      toast.error("Catégorie requise");
      return;
    }
    try {
      await update({
        data: {
          id: entry.id,
          title: title.trim(),
          description: description.trim() || null,
          category: finalCategory,
        },
      });
      toast.success("Entrée mise à jour");
      setEditing(false);
      setAddingCustom(false);
      setCustomCat("");
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  }

  async function handleAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setBusy(true);
    let ok = 0;
    for (const f of files) {
      try {
        const url = await uploadToStorage(f, "sponsoring-photos");
        await addPhoto({ data: { entry_id: entry.id, url } });
        ok++;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur upload");
      }
    }
    if (ok > 0) toast.success(`${ok} photo(s) ajoutée(s).`);
    if (fileRef.current) fileRef.current.value = "";
    setBusy(false);
    onChanged();
  }

  async function handleRemovePhoto(id: string) {
    if (!confirm("Supprimer cette photo ?")) return;
    try {
      await removePhoto({ data: { id } });
      toast.success("Photo supprimée");
      onChanged();
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
      await reorderPhotos({ data: { entry_id: entry.id, photo_ids: ids } });
      toast.success("Ordre des photos enregistré");
      onChanged();
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
          {entry.image_url ? (
            <img
              src={entry.image_url}
              alt={entry.title}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                placeholder="Titre"
              />
              {addingCustom ? (
                <div className="flex gap-1">
                  <Input
                    value={customCat}
                    onChange={(e) => setCustomCat(e.target.value)}
                    placeholder="Nouvelle catégorie"
                    maxLength={100}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAddingCustom(false);
                      setCustomCat("");
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-1">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {knownCategories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAddingCustom(true)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              )}
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Description"
                maxLength={2000}
              />
              <div className="flex gap-2">
                <Button type="button" size="sm" onClick={saveEdit}>
                  <Check className="w-3 h-3 mr-1" /> Enregistrer
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditing(false)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs text-[color:var(--muted-foreground)]">{entry.category}</p>
              <p className="text-sm font-medium truncate">{entry.title}</p>
              {entry.description && (
                <p className="text-xs text-[color:var(--muted-foreground)] mt-1 line-clamp-2">
                  {entry.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs inline-flex items-center gap-1 text-[color:var(--muted-foreground)] hover:text-foreground"
                >
                  <Pencil className="w-3 h-3" /> Éditer
                </button>
                <button
                  onClick={onDelete}
                  className="text-xs inline-flex items-center gap-1 text-destructive hover:underline"
                >
                  <Trash2 className="w-3 h-3" /> Supprimer
                </button>
              </div>
            </>
          )}
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

/* --------------------------- Partners (Associations & Partenariats) --------------------------- */

const PARTNER_LOGO_ALLOWED: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  svg: "image/svg+xml",
};

async function uploadPartnerLogo(file: File): Promise<string> {
  if (file.size > MAX_SIZE) {
    throw new Error(`Fichier "${file.name}" trop volumineux (max 10 Mo).`);
  }
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const contentType = file.type || PARTNER_LOGO_ALLOWED[ext];
  if (!contentType || !(ext in PARTNER_LOGO_ALLOWED)) {
    throw new Error(`Format non supporté pour "${file.name}". JPG, PNG, WEBP ou SVG.`);
  }
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("partner-logos")
    .upload(path, file, { contentType, cacheControl: "3600", upsert: false });
  if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from("partner-logos").getPublicUrl(path);
  return pub.publicUrl;
}

function PartnersAdmin() {
  const queryClient = useQueryClient();
  const listFn = useServerFn(listPartners);
  const removeFn = useServerFn(deletePartner);
  const reorderFn = useServerFn(reorderPartners);

  const q = useQuery({ queryKey: ["partners"], queryFn: () => listFn() });
  const partners: PartnerDTO[] = q.data?.partners ?? [];

  const [order, setOrder] = useState<string[]>(partners.map((p) => p.id));
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    setOrder(partners.map((p) => p.id));
  }, [partners]);

  const byId = new Map(partners.map((p) => [p.id, p]));
  const ordered = order.map((id) => byId.get(id)).filter(Boolean) as PartnerDTO[];

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["partners"] });
  }

  async function persistOrder(ids: string[]) {
    try {
      await reorderFn({ data: { ids } });
      toast.success("Ordre enregistré");
      invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  }

  function move(id: string, dir: -1 | 1) {
    setOrder((prev) => {
      const i = prev.indexOf(id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      persistOrder(next);
      return next;
    });
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
    await persistOrder(ids);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce partenaire ?")) return;
    try {
      await removeFn({ data: { id } });
      toast.success("Partenaire supprimé");
      invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  }

  return (
    <div className="mt-8 grid lg:grid-cols-[1fr_2fr] gap-10">
      <PartnerUploadCard onCreated={invalidate} />
      <div>
        <h2 className="text-xl mb-4">Partenaires ({partners.length})</h2>
        <p className="text-xs text-[color:var(--muted-foreground)] mb-4">
          Glissez ou utilisez les flèches pour réordonner. L'ordre est appliqué sur la page publique.
        </p>
        {q.isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {ordered.map((p, i) => (
              <div
                key={p.id}
                draggable
                onDragStart={() => setDragId(p.id)}
                onDragOver={(ev) => onDragOver(ev, p.id)}
                onDragEnd={onDragEnd}
                className={cn(
                  "transition-opacity relative",
                  dragId === p.id ? "opacity-50" : "opacity-100",
                )}
              >
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
                  <button
                    type="button"
                    aria-label="Monter"
                    disabled={i === 0}
                    onClick={() => move(p.id, -1)}
                    className="w-7 h-7 rounded bg-background border border-[color:var(--border)] flex items-center justify-center disabled:opacity-30 hover:bg-[color:var(--surface-muted)]"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Descendre"
                    disabled={i === ordered.length - 1}
                    onClick={() => move(p.id, 1)}
                    className="w-7 h-7 rounded bg-background border border-[color:var(--border)] flex items-center justify-center disabled:opacity-30 hover:bg-[color:var(--surface-muted)]"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <PartnerCard partner={p} onDelete={() => handleDelete(p.id)} onChanged={invalidate} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PartnerUploadCard({ onCreated }: { onCreated: () => void }) {
  const create = useServerFn(createPartner);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Le nom est requis.");
      return;
    }
    setBusy(true);
    try {
      let logo_url: string | null = null;
      if (file) {
        logo_url = await uploadPartnerLogo(file);
      }
      await create({
        data: {
          name: name.trim(),
          url: url.trim() ? url.trim() : null,
          logo_url,
        },
      });
      toast.success("Partenaire créé.");
      setName("");
      setUrl("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      onCreated();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(`Échec : ${msg}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-soft p-6 space-y-4 h-fit sticky top-24">
      <h2 className="text-xl">Ajouter un partenaire</h2>
      <div>
        <Label htmlFor="pt-name">Nom</Label>
        <Input id="pt-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={200} required />
      </div>
      <div>
        <Label htmlFor="pt-url">Lien (URL)</Label>
        <Input
          id="pt-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          maxLength={2000}
        />
      </div>
      <div>
        <Label htmlFor="pt-logo">Logo (optionnel — JPG, PNG, WEBP, SVG)</Label>
        <Input
          ref={fileRef}
          id="pt-logo"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
          Sans logo, le nom sera affiché en texte gris.
        </p>
      </div>
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
        Ajouter
      </Button>
    </form>
  );
}

function PartnerCard({
  partner,
  onDelete,
  onChanged,
}: {
  partner: PartnerDTO;
  onDelete: () => void;
  onChanged: () => void;
}) {
  const update = useServerFn(updatePartner);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(partner.name);
  const [url, setUrl] = useState(partner.url ?? "");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function save() {
    if (!name.trim()) {
      toast.error("Nom requis");
      return;
    }
    setBusy(true);
    try {
      await update({
        data: {
          id: partner.id,
          name: name.trim(),
          url: url.trim() ? url.trim() : null,
        },
      });
      toast.success("Partenaire mis à jour");
      setEditing(false);
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function replaceLogo(file: File) {
    setBusy(true);
    try {
      const logo_url = await uploadPartnerLogo(file);
      await update({ data: { id: partner.id, logo_url } });
      toast.success("Logo mis à jour");
      onChanged();
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function removeLogo() {
    if (!confirm("Supprimer le logo ? Le nom sera affiché à la place.")) return;
    setBusy(true);
    try {
      await update({ data: { id: partner.id, logo_url: null } });
      toast.success("Logo supprimé");
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card-soft p-4 space-y-3">
      <div className="aspect-[3/2] bg-[color:var(--surface-muted)] rounded flex items-center justify-center overflow-hidden">
        {partner.logo_url ? (
          <img src={partner.logo_url} alt={partner.name} className="max-h-full max-w-full object-contain p-3" />
        ) : (
          <span className="text-sm font-semibold text-[#666666]">{partner.name}</span>
        )}
      </div>
      {editing ? (
        <div className="space-y-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={200} />
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." maxLength={2000} />
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={save} disabled={busy} className="flex-1">
              <Check className="w-4 h-4 mr-1" /> Enregistrer
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          <p className="font-medium text-sm">{partner.name}</p>
          {partner.url && (
            <a
              href={partner.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[color:var(--muted-foreground)] underline break-all"
            >
              {partner.url}
            </a>
          )}
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        {!editing && (
          <Button type="button" size="sm" variant="outline" onClick={() => setEditing(true)} disabled={busy}>
            <Pencil className="w-3.5 h-3.5 mr-1" /> Éditer
          </Button>
        )}
        <Button type="button" size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={busy}>
          <Upload className="w-3.5 h-3.5 mr-1" /> {partner.logo_url ? "Remplacer logo" : "Ajouter logo"}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) replaceLogo(f);
          }}
        />
        {partner.logo_url && (
          <Button type="button" size="sm" variant="ghost" onClick={removeLogo} disabled={busy}>
            Sans logo
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onDelete}
          disabled={busy}
          className="text-destructive hover:text-destructive ml-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

function CategoriesCard({
  version,
  onChanged,
}: {
  version: number;
  onChanged: () => void;
}) {
  const fetchCategories = useServerFn(listProjectCategories);
  const createCat = useServerFn(createProjectCategory);
  const updateCat = useServerFn(updateProjectCategory);
  const deleteCat = useServerFn(deleteProjectCategory);

  const [cats, setCats] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchCategories({})
      .then((res) => {
        if (!alive) return;
        setCats((res.categories ?? []).map((c) => ({ id: c.id, name: c.name })));
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [fetchCategories, version]);

  function resetForm() {
    setName("");
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Le nom est requis.");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateCat({ data: { id: editingId, name: trimmed } });
        toast.success("Catégorie mise à jour.");
      } else {
        await createCat({ data: { name: trimmed } });
        toast.success("Catégorie ajoutée.");
      }
      resetForm();
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette catégorie ?")) return;
    try {
      await deleteCat({ data: { id } });
      toast.success("Catégorie supprimée.");
      if (editingId === id) resetForm();
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  }

  return (
    <div className="card-soft p-6 space-y-4">
      <h2 className="text-xl">Gérer les catégories</h2>

      {loading ? (
        <Loader2 className="animate-spin" />
      ) : cats.length === 0 ? (
        <p className="text-sm text-[color:var(--muted-foreground)]">Aucune catégorie.</p>
      ) : (
        <ul className="space-y-2">
          {cats.map((c) => (
            <li
              key={c.id}
              className={cn(
                "flex items-center justify-between gap-2 px-3 py-2 rounded border",
                editingId === c.id
                  ? "border-primary bg-primary/5"
                  : "border-[color:var(--border)]",
              )}
            >
              <span className="text-sm">{c.name}</span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(c.id);
                    setName(c.name);
                  }}
                >
                  <Pencil className="w-3 h-3" /> Éditer
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(c.id)}
                >
                  <Trash2 className="w-3 h-3" /> Supprimer
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t border-[color:var(--border)]">
        <Label htmlFor="cat-name">
          {editingId ? "Modifier la catégorie" : "Nouvelle catégorie"}
        </Label>
        <Input
          id="cat-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          placeholder="Nom de la catégorie"
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : editingId ? (
              "Mettre à jour"
            ) : (
              "Ajouter"
            )}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Annuler
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
