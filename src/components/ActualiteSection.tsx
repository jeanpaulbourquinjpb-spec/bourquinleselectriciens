import { useMemo, useState } from "react";
import { ArrowRight, ImageIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { ArticleDTO } from "@/lib/articles.functions";


export type FilterKey =
  | "all"
  | "eclairage"
  | "securite"
  | "domotique"
  | "energies"
  | "installation"
  | "formation";

export const FILTERS: { key: FilterKey; label: string; match: (cat: string) => boolean }[] = [
  { key: "all", label: "Tous", match: () => true },
  { key: "eclairage", label: "Éclairage", match: (c) => /(éclair|eclair)/i.test(c) },
  { key: "securite", label: "Sécurité", match: (c) => /(sécur|secur)/i.test(c) },
  { key: "domotique", label: "Domotique", match: (c) => /domot/i.test(c) },
  { key: "energies", label: "Énergies", match: (c) => /(énerg|energ)/i.test(c) },
  { key: "installation", label: "Installation", match: (c) => /install/i.test(c) },
  { key: "formation", label: "Formation", match: (c) => /format/i.test(c) },
];

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

function ArticleImage({
  src,
  alt,
  enhance,
}: {
  src: string | null;
  alt: string;
  enhance?: boolean;
}) {
  if (!src) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ backgroundColor: "#ff6633" }}
        aria-label="Image indisponible"
      >
        <ImageIcon className="w-10 h-10 text-white/80" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover"
      style={enhance ? { filter: "brightness(1.05) contrast(1.08) saturate(1.05)" } : undefined}
      onError={(e) => {
        const el = e.currentTarget;
        el.style.display = "none";
        const parent = el.parentElement;
        if (parent && !parent.querySelector("[data-fallback]")) {
          const div = document.createElement("div");
          div.setAttribute("data-fallback", "true");
          div.className = "absolute inset-0";
          div.style.backgroundColor = "#ff6633";
          parent.appendChild(div);
        }
      }}
    />
  );
}

function FeaturedArticle({ a }: { a: ArticleDTO }) {
  const date = formatDate(a.published_at);
  return (
    <a
      href={a.url}
      target="_blank"
      rel="noreferrer"
      className="card-soft mt-12 overflow-hidden !p-0 grid md:grid-cols-2 md:max-h-[280px] hover:shadow-md transition-shadow"
    >
      <div className="relative w-full h-48 md:h-full min-h-[200px] bg-[color:var(--surface-muted)] overflow-hidden">
        <ArticleImage src={a.image_url} alt={a.title} />
      </div>
      <div className="flex flex-col justify-center p-6 md:p-8 gap-3 overflow-hidden">
        {(a.category || date) && (
          <p className="eyebrow">
            {a.category}
            {a.category && date ? " · " : ""}
            {date}
          </p>
        )}
        <h3 className="text-xl md:text-2xl line-clamp-2">{a.title}</h3>
        {a.excerpt && <p className="text-sm line-clamp-2">{a.excerpt}</p>}
        <span className="link-brand mt-1 inline-flex items-center gap-1 text-sm font-semibold w-fit">
          Lire l'article <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </a>
  );
}

export function ArticleCard({ a }: { a: ArticleDTO }) {
  const date = formatDate(a.published_at);
  return (
    <a
      href={a.url}
      target="_blank"
      rel="noreferrer"
      className="card-soft !p-0 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow"
    >
      <div className="relative w-full aspect-[16/10] bg-[color:var(--surface-muted)] overflow-hidden">
        <ArticleImage src={a.image_url} alt={a.title} enhance />
        {date && (
          <span className="absolute top-3 left-3 inline-block rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
            {date}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5 gap-2">
        {a.category && <p className="eyebrow text-[10px]">{a.category}</p>}
        <h4 className="text-base leading-snug line-clamp-3 flex-1">{a.title}</h4>
        <span className="link-brand mt-2 inline-flex items-center gap-1 text-xs font-semibold w-fit">
          Lire <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </a>
  );
}

export function CategoryFilters({
  filter,
  onChange,
}: {
  filter: FilterKey;
  onChange: (k: FilterKey) => void;
}) {
  return (
    <div className="relative -mx-4 md:mx-0">
      <div
        className="flex gap-2 overflow-x-auto md:flex-wrap px-4 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Filtrer par catégorie"
      >
        {FILTERS.map((f) => {
          const active = f.key === filter;
          return (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(f.key)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors",
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
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[color:var(--surface-muted)] to-transparent md:hidden" />
    </div>
  );
}

export function ActualiteSection({
  articles,
  isLoading,
}: {
  articles: ArticleDTO[];
  isLoading?: boolean;
}) {
  const sorted = useMemo(() => {
    return [...articles].sort((a, b) => {
      const da = a.published_at ? new Date(a.published_at).getTime() : 0;
      const db = b.published_at ? new Date(b.published_at).getTime() : 0;
      return db - da;
    });
  }, [articles]);

  const featured = sorted[0];
  const rest = useMemo(() => sorted.slice(1, 4), [sorted]);

  if (isLoading) {
    return (
      <div className="mt-12 flex items-center gap-2 text-sm text-muted-foreground">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Chargement de l'actualité…
      </div>
    );
  }

  if (!featured) {
    return (
      <p className="mt-12 text-sm text-muted-foreground">
        Aucun article pour le moment. La prochaine mise à jour automatique aura lieu bientôt.
      </p>
    );
  }

  return (
    <>
      <FeaturedArticle a={featured} />

      {rest.length > 0 && (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <ArticleCard key={a.id} a={a} />
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link
          to="/actualites"
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--foreground)] bg-[color:var(--foreground)] px-6 py-3 text-sm font-semibold text-[color:var(--background)] transition-opacity hover:opacity-90"
        >
          Voir toutes les actualités <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </>
  );
}

export function ActualiteGrid({
  articles,
  isLoading,
}: {
  articles: ArticleDTO[];
  isLoading?: boolean;
}) {
  const sorted = useMemo(() => {
    return [...articles].sort((a, b) => {
      const da = a.published_at ? new Date(a.published_at).getTime() : 0;
      const db = b.published_at ? new Date(b.published_at).getTime() : 0;
      return db - da;
    });
  }, [articles]);

  const [filter, setFilter] = useState<FilterKey>("all");
  const matcher = FILTERS.find((f) => f.key === filter)?.match ?? (() => true);
  const filtered = useMemo(
    () => sorted.filter((a) => matcher(a.category ?? "")),
    [sorted, matcher],
  );

  if (isLoading) {
    return (
      <div className="mt-12 flex items-center gap-2 text-sm text-muted-foreground">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Chargement de l'actualité…
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <p className="mt-12 text-sm text-muted-foreground">
        Aucun article pour le moment.
      </p>
    );
  }

  return (
    <>
      <div className="mt-10">
        <CategoryFilters filter={filter} onChange={setFilter} />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-sm text-muted-foreground">
          Aucun article dans cette catégorie.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <ArticleCard key={a.id} a={a} />
          ))}
        </div>
      )}
    </>
  );
}

