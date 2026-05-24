import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SPONSORING_CATEGORIES,
  type SponsoringCategory,
  type SponsoringPhotoDTO,
} from "@/lib/sponsoring.functions";

const DESCRIPTIONS: Record<SponsoringCategory, string> = {
  "Équitation":
    "Fiers de soutenir l'excellence équestre internationale aux côtés des plus grands cavaliers.",
  "Basketball":
    "Partenaire des Lions de Genève, nous soutenons le sport collectif et l'esprit d'équipe.",
  "Course à pied":
    "Engagés aux côtés des coureurs genevois pour des causes qui nous tiennent à cœur.",
  "Football":
    "Supporters du football genevois et des grands événements sportifs internationaux.",
};

export function SponsoringSection({ photos }: { photos: SponsoringPhotoDTO[] }) {
  const [lightbox, setLightbox] = useState<{
    photos: SponsoringPhotoDTO[];
    index: number;
  } | null>(null);

  return (
    <>
      <div className="container-x mt-12 space-y-16">
        {SPONSORING_CATEGORIES.map((cat) => {
          const items = photos.filter((p) => p.category === cat);
          return (
            <div key={cat}>
              <h4 className="text-2xl">{cat}</h4>
              <p className="mt-2 max-w-2xl text-sm text-[color:var(--muted-foreground)]">
                {DESCRIPTIONS[cat]}
              </p>
              {items.length === 0 ? (
                <p className="mt-6 text-xs text-[color:var(--muted-foreground)] italic">
                  Photos à venir.
                </p>
              ) : (
                <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  {items.map((ph, i) => (
                    <button
                      key={ph.id}
                      type="button"
                      onClick={() => setLightbox({ photos: items, index: i })}
                      className="relative aspect-square bg-[color:var(--surface-muted)] overflow-hidden rounded group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <img
                        src={ph.url}
                        alt={`${cat} ${i + 1}`}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
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
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center"
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
              "absolute max-w-full max-h-full object-contain transition-opacity duration-300",
              i === index ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          />
        ))}
        {photos.length === 0 && <ImageIcon className="w-12 h-12 text-white/40" />}
      </div>
      {hasMany && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm tabular-nums">
          {index + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}
