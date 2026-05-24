import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SponsoringEntryDTO, SponsoringPhotoDTO } from "@/lib/sponsoring.functions";
import { SPONSORING_CATEGORIES } from "@/lib/sponsoring.functions";

const CATEGORY_ORDER = SPONSORING_CATEGORIES as readonly string[];

function extractYear(entry: SponsoringEntryDTO): string {
  const m = entry.title.match(/(19|20)\d{2}/);
  if (m) return m[0];
  return new Date(entry.created_at).getFullYear().toString();
}

export function SponsoringSection({ entries }: { entries: SponsoringEntryDTO[] }) {
  const [lightbox, setLightbox] = useState<{
    photos: SponsoringPhotoDTO[];
    index: number;
  } | null>(null);

  // Sort by configured category order, then by entry sort_order
  const sorted = useMemo(() => {
    const idx = (c: string) => {
      const i = CATEGORY_ORDER.indexOf(c);
      return i === -1 ? CATEGORY_ORDER.length : i;
    };
    return [...entries].sort((a, b) => {
      const d = idx(a.category) - idx(b.category);
      if (d !== 0) return d;
      return a.sort_order - b.sort_order;
    });
  }, [entries]);

  const categoriesInOrder = useMemo(() => {
    const seen: string[] = [];
    for (const e of sorted) if (!seen.includes(e.category)) seen.push(e.category);
    return seen;
  }, [sorted]);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>(
    sorted[0]?.category ?? "",
  );
  const touchStartX = useRef<number | null>(null);

  // Observe cards to determine active card → category
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const rect = track.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      let best = 0;
      let bestDist = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const d = Math.abs(c - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActiveIndex(best);
      const cat = sorted[best]?.category;
      if (cat) setActiveCategory(cat);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => track.removeEventListener("scroll", onScroll);
  }, [sorted]);

  const scrollByCards = useCallback((dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const first = itemRefs.current.find(Boolean);
    const step = first ? first.getBoundingClientRect().width + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  // Progress within total
  const progress = sorted.length > 1 ? activIndexClamp(activeIndex, sorted.length) : 0;

  return (
    <>
      <div className="container-x mt-12">
        {sorted.length === 0 && (
          <p className="text-sm text-[color:var(--muted-foreground)] italic">
            Engagements à venir.
          </p>
        )}

        {sorted.length > 0 && (
          <>
            <div className="relative h-10 mb-6">
              <h4
                key={activeCategory}
                className="absolute left-0 top-0 text-2xl text-[color:var(--brand)] animate-fade-in"
              >
                {activeCategory}
              </h4>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                aria-label="Précédent"
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 h-11 w-11 rounded-full bg-white border border-[color:var(--line)] hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] shadow-sm items-center justify-center transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                aria-label="Suivant"
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 h-11 w-11 rounded-full bg-white border border-[color:var(--line)] hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] shadow-sm items-center justify-center transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div
                ref={trackRef}
                onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
                onTouchEnd={(e) => {
                  if (touchStartX.current == null) return;
                  const dx = e.changedTouches[0].clientX - touchStartX.current;
                  if (Math.abs(dx) > 50) scrollByCards(dx < 0 ? 1 : -1);
                  touchStartX.current = null;
                }}
                className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {sorted.map((entry, i) => {
                  const year = extractYear(entry);
                  return (
                    <div
                      key={entry.id}
                      ref={(el) => { itemRefs.current[i] = el; }}
                      className="snap-center shrink-0 basis-full md:basis-[calc(50%-12px)]"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          entry.photos.length > 0 &&
                          setLightbox({ photos: entry.photos, index: 0 })
                        }
                        className="group block w-full text-left"
                      >
                        <div className="relative aspect-[4/3] bg-[color:var(--surface-muted)] overflow-hidden rounded-lg">
                          {entry.image_url ? (
                            <img
                              src={entry.image_url}
                              alt={entry.title}
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-[color:var(--muted-foreground)]" />
                            </div>
                          )}
                        </div>
                        <div className="mt-4 flex items-baseline justify-between gap-4">
                          <h5 className="text-lg font-medium text-[#666666]">
                            {entry.title}
                          </h5>
                          <span className="text-sm tabular-nums text-[color:var(--brand)] shrink-0">
                            {year}
                          </span>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category progress */}
            <div className="mt-8 flex items-center justify-center gap-2">
              {categoriesInOrder.map((cat) => {
                const isActive = cat === activeCategory;
                return (
                  <div key={cat} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        isActive
                          ? "w-10 bg-[color:var(--brand)]"
                          : "w-6 bg-[color:var(--line)]",
                      )}
                      aria-hidden
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-3 h-1 w-full max-w-md mx-auto rounded-full bg-[color:var(--line)] overflow-hidden">
              <div
                className="h-full bg-[color:var(--brand)] transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </>
        )}
      </div>

      {lightbox && (
        <Lightbox
          photos={lightbox.photos}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}

function activIndexClamp(i: number, n: number): number {
  if (n <= 1) return 0;
  return Math.min(1, Math.max(0, i / (n - 1)));
}

function Lightbox({
  photos,
  startIndex,
  onClose,
}: {
  photos: SponsoringPhotoDTO[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const hasMany = photos.length > 1;
  const touchStartX = useRef<number | null>(null);

  const setI = useCallback(
    (i: number) => setIndex((i + photos.length) % photos.length),
    [photos.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasMany) setI(index + 1);
      if (e.key === "ArrowLeft" && hasMany) setI(index - 1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, hasMany, onClose, setI]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center animate-fade-in"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10"
      >
        <X className="w-5 h-5" />
      </button>
      {hasMany && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setI(index - 1);
            }}
            aria-label="Précédent"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setI(index + 1);
            }}
            aria-label="Suivant"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-12"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current == null || !hasMany) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 50) setI(index + (dx < 0 ? 1 : -1));
          touchStartX.current = null;
        }}
      >
        {photos.map((ph, i) => (
          <img
            key={ph.id}
            src={ph.url}
            alt=""
            className={cn(
              "absolute max-w-full max-h-full object-contain transition-opacity duration-500",
              i === index ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          />
        ))}
      </div>
      {hasMany && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm tabular-nums">
          {index + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}
