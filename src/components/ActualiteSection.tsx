import { useMemo, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
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

function CompactCard({ a }: { a: ArticleDTO }) {
  const date = formatDate(a.published_at);
  return (
    <a
      href={a.url}
      target="_blank"
      rel="noreferrer"
      className="card-soft flex gap-4 !p-3 hover:shadow-md transition-shadow h-full"
    >
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 bg-[color:var(--surface-muted)] overflow-hidden rounded">
        <ArticleImage src={a.image_url} alt={a.title} enhance />
      </div>
      <div className="flex flex-col flex-1 min-w-0 py-1">
        {date && <p className="eyebrow mb-1 text-[10px]">{date}</p>}
        <h4 className="text-sm md:text-base leading-snug line-clamp-3 flex-1">{a.title}</h4>
        <span className="link-brand mt-2 inline-flex items-center gap-1 text-xs font-semibold w-fit">
          Lire <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </a>
  );
}

function ArticlesCarousel({ articles }: { articles: ArticleDTO[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.9), behavior: "smooth" });
  };

  if (articles.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-end justify-between gap-4 mb-4">
        <h3 className="text-2xl">Tous les articles</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Précédent"
            className="w-10 h-10 rounded-full border border-[color:var(--border)] bg-background flex items-center justify-center hover:bg-[color:var(--surface-muted)] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Suivant"
            className="w-10 h-10 rounded-full border border-[color:var(--border)] bg-background flex items-center justify-center hover:bg-[color:var(--surface-muted)] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-2 px-2"
        style={{ scrollbarWidth: "thin" }}
      >
        {articles.map((a) => (
          <div
            key={a.id}
            className="snap-start shrink-0 w-[88%] sm:w-[calc(50%-0.5rem)]"
          >
            <CompactCard a={a} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActualiteSection({ articles }: { articles: ArticleDTO[] }) {
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = useMemo(() => {
    const list = articles.filter((a) => a.id !== featured?.id);
    return list.sort((a, b) => {
      const da = a.published_at ? new Date(a.published_at).getTime() : 0;
      const db = b.published_at ? new Date(b.published_at).getTime() : 0;
      return db - da;
    });
  }, [articles, featured?.id]);

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

      <ArticlesCarousel articles={rest} />
    </>
  );
}
