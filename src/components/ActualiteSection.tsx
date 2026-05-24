import { useMemo, useState } from "react";
import { ArrowRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArticleDTO } from "@/lib/articles.functions";

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("fr-CH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

function ArticleImageCard({ a }: { a: ArticleDTO }) {
  const date = formatDate(a.published_at);
  return (
    <article className="card-soft flex flex-col overflow-hidden !p-0 h-full">
      <div className="relative w-full aspect-[16/10] bg-[color:var(--surface-muted)] overflow-hidden">
        {a.image_url ? (
          <img
            src={a.image_url}
            alt={a.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[color:var(--muted-foreground)]">
            <ImageIcon className="w-10 h-10 opacity-40" />
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        {(a.category || date) && (
          <p className="eyebrow mb-2">
            {a.category}
            {a.category && date ? " · " : ""}
            {date}
          </p>
        )}
        <h4 className="text-lg flex-1">{a.title}</h4>
        <a
          href={a.url}
          target="_blank"
          rel="noreferrer"
          className="link-brand mt-5 inline-flex items-center gap-1 text-sm font-semibold w-fit"
        >
          Lire l'article <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </article>
  );
}

export function ActualiteSection({ articles }: { articles: ArticleDTO[] }) {
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = useMemo(
    () => articles.filter((a) => a.id !== featured?.id),
    [articles, featured?.id],
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    rest.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return Array.from(set).sort();
  }, [rest]);

  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(
    () => (filter === "all" ? rest : rest.filter((a) => a.category === filter)),
    [filter, rest],
  );

  const showAll = filter !== "all" || expanded;
  const visible = showAll ? filtered : filtered.slice(0, 2);
  const hiddenCount = filtered.length - visible.length;

  if (!featured) {
    return (
      <p className="mt-12 text-sm text-muted-foreground">
        Aucun article pour le moment. La prochaine mise à jour automatique aura lieu bientôt.
      </p>
    );
  }

  return (
    <>
      <article className="card-soft mt-12 flex flex-col gap-3 md:p-10">
        {(featured.category || formatDate(featured.published_at)) && (
          <p className="eyebrow">
            {featured.category}
            {featured.category && formatDate(featured.published_at) ? " · " : ""}
            {formatDate(featured.published_at)}
          </p>
        )}
        <h3 className="text-2xl md:text-3xl">{featured.title}</h3>
        {featured.excerpt && <p className="text-base">{featured.excerpt}</p>}
        <a
          href={featured.url}
          target="_blank"
          rel="noreferrer"
          className="link-brand mt-2 inline-flex items-center gap-1 text-sm font-semibold w-fit"
        >
          Lire l'article <ArrowRight className="w-4 h-4" />
        </a>
      </article>

      {rest.length > 0 && (
        <>
          <h3 className="mt-16 text-2xl">Tous les articles</h3>

          {categories.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { label: "Toutes les catégories", value: "all" },
                ...categories.map((c) => ({ label: c, value: c })),
              ].map((f) => {
                const active = filter === f.value;
                return (
                  <button
                    key={f.value}
                    onClick={() => {
                      setFilter(f.value);
                      setExpanded(false);
                    }}
                    className={cn(
                      "px-4 py-2 rounded-full border text-sm transition-colors",
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-[color:var(--border)] hover:bg-[color:var(--surface-muted)]",
                    )}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="mt-8 text-sm text-muted-foreground">
              Aucun article dans cette catégorie.
            </p>
          ) : (
            <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 transition-all duration-500">
              {visible.map((a) => (
                <ArticleImageCard key={a.id} a={a} />
              ))}
            </div>
          )}

          {hiddenCount > 0 && (
            <div className="mt-10 flex justify-center">
              <button onClick={() => setExpanded(true)} className="btn-outline">
                Voir plus ({hiddenCount})
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
