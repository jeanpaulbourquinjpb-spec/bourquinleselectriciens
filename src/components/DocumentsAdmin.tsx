import { useState, useEffect, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Pencil, ExternalLink } from "lucide-react";
import {
  listDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  signDocumentUrl,
  type DocumentDTO,
} from "@/lib/documents.functions";

const MAX_PDF_SIZE = 20 * 1024 * 1024;

export function DocumentsAdmin() {
  const queryClient = useQueryClient();
  const list = useServerFn(listDocuments);
  const remove = useServerFn(deleteDocument);

  const q = useQuery({ queryKey: ["documents"], queryFn: () => list() });
  const docs = q.data?.documents ?? [];
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DocumentDTO | null>(null);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["documents"] });
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce document ?")) return;
    try {
      await remove({ data: { id } });
      toast.success("Document supprimé");
      invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl">Documents ({docs.length})</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter un document
        </Button>
      </div>

      {q.isLoading ? (
        <Loader2 className="animate-spin" />
      ) : docs.length === 0 ? (
        <p className="text-sm text-[color:var(--muted-foreground)]">
          Aucun document pour le moment.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-[color:var(--border)] rounded">
            <thead className="bg-[color:var(--surface-muted)]">
              <tr>
                <th className="text-left p-3">Titre</th>
                <th className="text-left p-3">Mis à jour le</th>
                <th className="text-left p-3">Ordre</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id} className="border-t border-[color:var(--border)]">
                  <td className="p-3 font-medium">
                    <div className="flex items-center gap-2">
                      <span>{d.title}</span>
                      {d.file_url && (
                        <a
                          href={d.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[color:var(--muted-foreground)] hover:text-foreground"
                          aria-label="Ouvrir le PDF"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-[color:var(--muted-foreground)]">
                    {new Date(d.updated_at).toLocaleDateString("fr-CH")}
                  </td>
                  <td className="p-3">{d.display_order}</td>
                  <td className="p-3 text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditing(d)}
                      className="mr-1"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(d.id)}
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

      <DocumentFormDialog open={open} onOpenChange={setOpen} onSaved={invalidate} />
      <DocumentFormDialog
        open={!!editing}
        onOpenChange={() => setEditing(null)}
        onSaved={invalidate}
        doc={editing ?? undefined}
      />
    </div>
  );
}

function DocumentFormDialog({
  open,
  onOpenChange,
  onSaved,
  doc,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved: () => void;
  doc?: DocumentDTO;
}) {
  const create = useServerFn(createDocument);
  const update = useServerFn(updateDocument);
  const sign = useServerFn(signDocumentUrl);
  const [title, setTitle] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [fileUrl, setFileUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isEdit = !!doc;

  useEffect(() => {
    if (doc) {
      setTitle(doc.title);
      setDisplayOrder(doc.display_order);
      setFileUrl(doc.file_url);
    } else {
      setTitle("");
      setDisplayOrder(0);
      setFileUrl("");
    }
    if (fileRef.current) fileRef.current.value = "";
  }, [doc, open]);

  async function uploadPdf(file: File): Promise<string> {
    if (file.size > MAX_PDF_SIZE) {
      throw new Error("Fichier trop volumineux (max 20 Mo).");
    }
    const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
    if (ext !== "pdf") throw new Error("Seuls les fichiers PDF sont acceptés.");
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.pdf`;
    const { error: upErr } = await supabase.storage
      .from("documents")
      .upload(path, file, {
        contentType: "application/pdf",
        cacheControl: "3600",
        upsert: false,
      });
    if (upErr) throw upErr;
    const { url } = await sign({ data: { path } });
    return url;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Titre requis");
      return;
    }
    const file = fileRef.current?.files?.[0];
    if (!isEdit && !file) {
      toast.error("Veuillez sélectionner un fichier PDF.");
      return;
    }
    setBusy(true);
    try {
      let url = fileUrl;
      if (file) url = await uploadPdf(file);

      if (isEdit && doc) {
        await update({
          data: {
            id: doc.id,
            title: title.trim(),
            file_url: url,
            display_order: displayOrder,
          },
        });
        toast.success("Document modifié");
      } else {
        await create({
          data: {
            title: title.trim(),
            file_url: url,
            display_order: displayOrder,
          },
        });
        toast.success("Document créé");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Modifier le document" : "Nouveau document"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="doc-title">Titre</Label>
            <Input
              id="doc-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={300}
              required
            />
          </div>

          <div>
            <Label htmlFor="doc-file">
              Fichier PDF {isEdit ? "(laisser vide pour conserver l'actuel)" : ""}
            </Label>
            <Input
              id="doc-file"
              ref={fileRef}
              type="file"
              accept="application/pdf,.pdf"
            />
            {isEdit && fileUrl && (
              <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
                Fichier actuel :{" "}
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  ouvrir
                </a>
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="doc-order">Ordre d'affichage</Label>
            <Input
              id="doc-order"
              type="number"
              min={0}
              max={100000}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={busy}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={busy}>
              {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{" "}
              {isEdit ? "Enregistrer" : "Créer le document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
