import { useMemo } from "react";
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
    <article
      className="card-soft mt-12 overflow-hidden !p-0 grid md:grid-cols-2"
      style={{ maxHeight: 280 }}
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
        <a
          href={a.url}
          target="_blank"
          rel="noreferrer"
          className="link-brand mt-1 inline-flex items-center gap-1 text-sm font-semibold w-fit"
        >
          Lire l'article <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </article>
  );
}

function ArticleCard({ a }: { a: ArticleDTO }) {
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
      </div>
      <div className="flex flex-col flex-1 p-5 gap-2">
        {(a.category || date) && (
          <p className="eyebrow text-[10px]">
            {a.category}
            {a.category && date ? " · " : ""}
            {date}
          </p>
        )}
        <h4 className="text-base leading-snug line-clamp-3 flex-1">{a.title}</h4>
        {a.excerpt && (
          <p className="text-xs text-[color:var(--muted-foreground)] line-clamp-2">{a.excerpt}</p>
        )}
        <span className="link-brand mt-2 inline-flex items-center gap-1 text-xs font-semibold w-fit">
          Lire <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </a>
  );
}

export function ActualiteSection({ articles }: { articles: ArticleDTO[] }) {
  const sorted = useMemo(() => {
    return [...articles].sort((a, b) => {
      const da = a.published_at ? new Date(a.published_at).getTime() : 0;
      const db = b.published_at ? new Date(b.published_at).getTime() : 0;
      return db - da;
    });
  }, [articles]);

  const featured = sorted[0];
  const rest = sorted.slice(1);

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
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <ArticleCard key={a.id} a={a} />
          ))}
        </div>
      )}
    </>
  );
}
