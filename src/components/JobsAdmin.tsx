import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  listJobs,
  createJob,
  updateJob,
  deleteJob,
  JOB_CATEGORIES,
  JOB_CONTRACT_TYPES,
  type JobDTO,
  type JobCategory,
  type JobContractType,
} from "@/lib/jobs.functions";

const CATEGORY_LABELS: Record<JobCategory, string> = {
  cadre: "Cadre",
  technicien: "Technicien",
  apprentissage: "Apprentissage",
  admin: "Administration",
};

export function JobsAdmin() {
  const queryClient = useQueryClient();
  const list = useServerFn(listJobs);
  const update = useServerFn(updateJob);
  const remove = useServerFn(deleteJob);

  const q = useQuery({ queryKey: ["jobs"], queryFn: () => list() });
  const jobs = q.data?.jobs ?? [];
  const [open, setOpen] = useState(false);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["jobs"] });
  }

  async function toggleActive(job: JobDTO) {
    try {
      await update({ data: { id: job.id, is_active: !job.is_active } });
      invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette offre ?")) return;
    try {
      await remove({ data: { id } });
      toast.success("Offre supprimée");
      invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl">Offres d'emploi ({jobs.length})</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Nouvelle offre
        </Button>
      </div>

      {q.isLoading ? (
        <Loader2 className="animate-spin" />
      ) : jobs.length === 0 ? (
        <p className="text-sm text-[color:var(--muted-foreground)]">Aucune offre pour le moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-[color:var(--border)] rounded">
            <thead className="bg-[color:var(--surface-muted)]">
              <tr>
                <th className="text-left p-3">Titre</th>
                <th className="text-left p-3">Catégorie</th>
                <th className="text-left p-3">Contrat</th>
                <th className="text-left p-3">Statut</th>
                <th className="text-left p-3">Publié le</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-t border-[color:var(--border)]">
                  <td className="p-3 font-medium">{j.title}</td>
                  <td className="p-3">{j.category ? CATEGORY_LABELS[j.category] : "—"}</td>
                  <td className="p-3">{j.contract_type ?? "—"}</td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => toggleActive(j)}
                      className={
                        "px-2 py-1 rounded text-xs font-medium " +
                        (j.is_active
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300")
                      }
                    >
                      {j.is_active ? "Actif" : "Inactif"}
                    </button>
                  </td>
                  <td className="p-3 text-[color:var(--muted-foreground)]">
                    {new Date(j.published_at).toLocaleDateString("fr-CH")}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(j.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <JobFormDialog open={open} onOpenChange={setOpen} onCreated={invalidate} />
    </div>
  );
}

function JobFormDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const create = useServerFn(createJob);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<JobCategory | "">("");
  const [contractType, setContractType] = useState<JobContractType | "">("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [busy, setBusy] = useState(false);

  function reset() {
    setTitle("");
    setCategory("");
    setContractType("");
    setDescription("");
    setRequirements("");
    setPdfUrl("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Titre requis");
      return;
    }
    setBusy(true);
    try {
      await create({
        data: {
          title: title.trim(),
          category: category || null,
          contract_type: contractType || null,
          description: description.trim() || null,
          requirements: requirements.trim() || null,
          pdf_url: pdfUrl.trim() || null,
        },
      });
      toast.success("Offre créée");
      reset();
      onOpenChange(false);
      onCreated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle offre d'emploi</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="job-title">Titre</Label>
            <Input
              id="job-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={300}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="job-category">Catégorie</Label>
              <Select value={category || undefined} onValueChange={(v) => setCategory(v as JobCategory)}>
                <SelectTrigger id="job-category">
                  <SelectValue placeholder="Choisir…" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="job-contract">Type de contrat</Label>
              <Select value={contractType} onValueChange={(v) => setContractType(v as JobContractType)}>
                <SelectTrigger id="job-contract">
                  <SelectValue placeholder="Choisir…" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_CONTRACT_TYPES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="job-desc">Description</Label>
            <Textarea
              id="job-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={10000}
            />
          </div>

          <div>
            <Label htmlFor="job-req">Exigences</Label>
            <Textarea
              id="job-req"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={4}
              maxLength={10000}
            />
          </div>

          <div>
            <Label htmlFor="job-pdf">URL PDF (optionnel)</Label>
            <Input
              id="job-pdf"
              type="url"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              placeholder="https://..."
              maxLength={2000}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>
              Annuler
            </Button>
            <Button type="submit" disabled={busy}>
              {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Créer l'offre
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
