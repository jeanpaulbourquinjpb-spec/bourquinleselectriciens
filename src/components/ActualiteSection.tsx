import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ImageIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { ArticleDTO } from "@/lib/articles.functions";

type FilterKey =
  | "all"
  | "eclairage"
  | "securite"
  | "domotique"
  | "energies"
  | "installation"
  | "formation";

const FILTERS: { key: FilterKey; label: string; match: (cat: string) => boolean }[] = [
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

export function ActualiteSection({ articles }: { articles: ArticleDTO[] }) {
  const sorted = useMemo(() => {
    return [...articles].sort((a, b) => {
      const da = a.published_at ? new Date(a.published_at).getTime() : 0;
      const db = b.published_at ? new Date(b.published_at).getTime() : 0;
      return db - da;
    });
  }, [articles]);

  const featured = sorted[0];
  const rest = useMemo(() => sorted.slice(1), [sorted]);

  const [filter, setFilter] = useState<FilterKey>("all");
  const matcher = FILTERS.find((f) => f.key === filter)?.match ?? (() => true);

  const [api, setApi] = useState<CarouselApi>();
  const [progress, setProgress] = useState(0);

  // Re-init embla whenever filter (visible slides) changes so sizing recalculates
  useEffect(() => {
    if (!api) return;
    api.reInit();
    setProgress(api.scrollProgress());
  }, [api, filter]);

  useEffect(() => {
    if (!api) return;
    const onScroll = () => setProgress(Math.max(0, Math.min(1, api.scrollProgress())));
    onScroll();
    api.on("scroll", onScroll);
    api.on("reInit", onScroll);
    return () => {
      api.off("scroll", onScroll);
      api.off("reInit", onScroll);
    };
  }, [api]);

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
        <>
          {/* Filtres */}
          <div className="mt-12 flex flex-wrap gap-2" role="tablist" aria-label="Filtrer par catégorie">
            {FILTERS.map((f) => {
              const active = f.key === filter;
              return (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.key)}
                  className={
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors " +
                    (active
                      ? "border-transparent bg-[color:var(--foreground)] text-[color:var(--background)]"
                      : "border-[color:var(--border)] bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--surface-muted)]")
                  }
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Carousel */}
          <div className="mt-8 px-0 md:px-14">
            <Carousel
              setApi={setApi}
              opts={{ align: "start", containScroll: "trimSnaps" }}
              className="w-full"
            >
              <CarouselContent>
                {rest.map((a) => {
                  const visible = matcher(a.category ?? "");
                  return (
                    <CarouselItem
                      key={a.id}
                      className="basis-full sm:basis-1/2 lg:basis-1/3"
                      style={visible ? undefined : { display: "none" }}
                      aria-hidden={visible ? undefined : true}
                    >
                      <ArticleCard a={a} />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>

            {/* Barre de progression */}
            <div
              className="mt-6 h-1 w-full overflow-hidden rounded-full bg-[color:var(--border)]"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
            >
              <div
                className="h-full bg-[color:var(--foreground)] transition-[width] duration-200"
                style={{ width: `${Math.max(8, progress * 100)}%` }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
