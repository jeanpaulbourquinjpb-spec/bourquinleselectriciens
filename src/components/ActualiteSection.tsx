import { useMemo, useState } from "react";
import { ArrowRight, ImageIcon } from "lucide-react";
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

function ArticleImage({ src, alt }: { src: string | null; alt: string }) {
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

function ArticleCard({ a }: { a: ArticleDTO }) {
  const date = formatDate(a.published_at);
  return (
    <article className="card-soft flex flex-col overflow-hidden !p-0 h-full">
      <div className="relative w-full aspect-[16/10] bg-[color:var(--surface-muted)] overflow-hidden">
        <ArticleImage src={a.image_url} alt={a.title} />
      </div>
      <div className="p-6 flex flex-col flex-1">
        {date && <p className="eyebrow mb-2">{date}</p>}
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

function CategorySection({ name, articles }: { name: string; articles: ArticleDTO[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? articles : articles.slice(0, 2);
  const hidden = articles.length - visible.length;

  return (
    <section className="mt-16">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <h3 className="text-2xl">{name}</h3>
        <span className="text-sm text-[color:var(--muted-foreground)]">
          {articles.length} article{articles.length > 1 ? "s" : ""}
        </span>
      </div>

      <div
        className={
          "mt-6 grid gap-6 grid-cols-1 md:grid-cols-2" +
          (expanded ? " max-h-[2000px]" : " max-h-[1200px]") +
          " overflow-hidden transition-[max-height] duration-500"
        }
      >
        {visible.map((a) => (
          <ArticleCard key={a.id} a={a} />
        ))}
      </div>

      {(hidden > 0 || expanded) && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="btn-outline"
          >
            {expanded ? "Voir moins" : `Voir plus (${hidden})`}
          </button>
        </div>
      )}
    </section>
  );
}

export function ActualiteSection({ articles }: { articles: ArticleDTO[] }) {
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = useMemo(
    () => articles.filter((a) => a.id !== featured?.id),
    [articles, featured?.id],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, ArticleDTO[]>();
    for (const a of rest) {
      const key = a.category?.trim() || "Autres";
      const arr = map.get(key) ?? [];
      arr.push(a);
      map.set(key, arr);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b, "fr"));
  }, [rest]);

  if (!featured) {
    return (
      <p className="mt-12 text-sm text-muted-foreground">
        Aucun article pour le moment. La prochaine mise à jour automatique aura lieu bientôt.
      </p>
    );
  }

  return (
    <>
      <article className="card-soft mt-12 flex flex-col gap-3 md:p-10 overflow-hidden">
        <div className="relative w-full aspect-[21/9] -mx-6 -mt-6 md:-mx-10 md:-mt-10 mb-4 bg-[color:var(--surface-muted)] overflow-hidden">
          <ArticleImage src={featured.image_url} alt={featured.title} />
        </div>
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

      {grouped.map(([cat, items]) => (
        <CategorySection key={cat} name={cat} articles={items} />
      ))}
    </>
  );
}
