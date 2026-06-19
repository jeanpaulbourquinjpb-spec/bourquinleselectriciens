import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2, Check, X, Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MANAGE_VALUE = "__manage_categories__";

// Loosely typed server-fn refs to keep this component reusable.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = any;

export type CategoryFns = {
  list: AnyFn;
  create: AnyFn;
  update: AnyFn;
  remove: AnyFn;
};

export function CategorySelectWithManager({
  fns,
  value,
  onValueChange,
  triggerId,
  triggerClassName,
  placeholder,
  onCategoriesLoaded,
  fallbackCategories,
}: {
  fns: CategoryFns;
  value: string;
  onValueChange: (v: string) => void;
  triggerId?: string;
  triggerClassName?: string;
  placeholder?: string;
  onCategoriesLoaded?: (names: string[]) => void;
  /** Optional extra category names to display even if absent from the table (e.g. value already on an entry). */
  fallbackCategories?: string[];
}) {
  const listFn = useServerFn(fns.list);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [version, setVersion] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    listFn({})
      .then((res: { categories?: { id: string; name: string }[] }) => {
        if (!alive) return;
        const list = res.categories ?? [];
        setCategories(list);
        onCategoriesLoaded?.(list.map((c) => c.name));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  const names = categories.map((c) => c.name);
  const extras = (fallbackCategories ?? []).filter(
    (n) => n && !names.includes(n),
  );
  const displayNames = [...names, ...extras];

  function handleChange(v: string) {
    if (v === MANAGE_VALUE) {
      setOpen(true);
      return;
    }
    onValueChange(v);
  }

  return (
    <>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger id={triggerId} className={triggerClassName}>
          <SelectValue placeholder={placeholder ?? "Sélectionner…"} />
        </SelectTrigger>
        <SelectContent>
          {displayNames.map((n) => (
            <SelectItem key={n} value={n}>
              {n}
            </SelectItem>
          ))}
          <div className="my-1 h-px bg-[color:var(--border)]" />
          <SelectItem
            value={MANAGE_VALUE}
            className="text-[color:var(--muted-foreground)] focus:text-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <Settings2 className="w-3.5 h-3.5" />
              Gérer les catégories
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <CategoryManagerDialog
        open={open}
        onOpenChange={setOpen}
        fns={fns}
        onChanged={() => setVersion((v) => v + 1)}
      />
    </>
  );
}

export function CategoryManagerDialog({
  open,
  onOpenChange,
  fns,
  onChanged,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  fns: CategoryFns;
  onChanged?: () => void;
}) {
  const listFn = useServerFn(fns.list);
  const createFn = useServerFn(fns.create);
  const updateFn = useServerFn(fns.update);
  const removeFn = useServerFn(fns.remove);

  const [items, setItems] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const res = await listFn({});
      setItems(((res.categories ?? []) as { id: string; name: string }[]).map((c) => ({ id: c.id, name: c.name })));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) {
      refresh();
      setEditingId(null);
      setEditingName("");
      setNewName("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) {
      toast.error("Le nom est requis.");
      return;
    }
    setAdding(true);
    try {
      await createFn({ data: { name: trimmed } });
      toast.success("Catégorie ajoutée.");
      setNewName("");
      await refresh();
      onChanged?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setAdding(false);
    }
  }

  async function handleUpdate(id: string) {
    const trimmed = editingName.trim();
    if (!trimmed) {
      toast.error("Le nom est requis.");
      return;
    }
    setBusyId(id);
    try {
      await updateFn({ data: { id, name: trimmed } });
      toast.success("Catégorie mise à jour.");
      setEditingId(null);
      setEditingName("");
      await refresh();
      onChanged?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette catégorie ?")) return;
    setBusyId(id);
    try {
      await removeFn({ data: { id } });
      toast.success("Catégorie supprimée.");
      if (editingId === id) {
        setEditingId(null);
        setEditingName("");
      }
      await refresh();
      onChanged?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gérer les catégories</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-sm text-[color:var(--muted-foreground)] py-2">
              Aucune catégorie pour le moment.
            </p>
          ) : (
            <ul className="space-y-2 max-h-[40vh] overflow-auto pr-1">
              {items.map((c) => (
                <li
                  key={c.id}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded border",
                    editingId === c.id
                      ? "border-primary bg-primary/5"
                      : "border-[color:var(--border)]",
                  )}
                >
                  {editingId === c.id ? (
                    <>
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        maxLength={100}
                        className="h-8 flex-1"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleUpdate(c.id);
                          }
                          if (e.key === "Escape") {
                            setEditingId(null);
                            setEditingName("");
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleUpdate(c.id)}
                        disabled={busyId === c.id}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(null);
                          setEditingName("");
                        }}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm">{c.name}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(c.id);
                          setEditingName(c.name);
                        }}
                        title="Éditer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(c.id)}
                        disabled={busyId === c.id}
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}

          <form
            onSubmit={handleCreate}
            className="flex gap-2 pt-3 border-t border-[color:var(--border)]"
          >
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={100}
              placeholder="Nouvelle catégorie"
              className="flex-1"
            />
            <Button type="submit" disabled={adding}>
              {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Ajouter"}
            </Button>
          </form>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
