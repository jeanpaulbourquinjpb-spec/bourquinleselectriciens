import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SponsoringEntryDTO, SponsoringPhotoDTO } from "@/lib/sponsoring.functions";

export function SponsoringSection({ entries }: { entries: SponsoringEntryDTO[] }) {
  const [lightbox, setLightbox] = useState<{
    photos: SponsoringPhotoDTO[];
    index: number;
  } | null>(null);

  // Group entries by category, preserving entry sort order
  const byCategory = new Map<string, SponsoringEntryDTO[]>();
  for (const e of entries) {
    const arr = byCategory.get(e.category) ?? [];
    arr.push(e);
    byCategory.set(e.category, arr);
  }
  const categories = Array.from(byCategory.keys());

  return (
    <>
      <div className="container-x mt-12 space-y-16">
        {categories.length === 0 && (
          <p className="text-sm text-[color:var(--muted-foreground)] italic">
            Engagements à venir.
          </p>
        )}
        {categories.map((cat) => {
          const items = byCategory.get(cat) ?? [];
          return (
            <div key={cat}>
              <h4 className="text-2xl">{cat}</h4>
              <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() =>
                      entry.photos.length > 0 &&
                      setLightbox({ photos: entry.photos, index: 0 })
                    }
                    className="group relative aspect-[4/3] bg-[color:var(--surface-muted)] overflow-hidden rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-left"
                  >
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      <h5 className="text-white text-lg font-semibold">{entry.title}</h5>
                      {entry.description && (
                        <p className="mt-1 text-white/85 text-sm line-clamp-3">
                          {entry.description}
                        </p>
                      )}
                      {entry.photos.length > 1 && (
                        <p className="mt-2 text-white/70 text-xs">
                          {entry.photos.length} photos
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
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
      </div>
      {hasMany && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm tabular-nums">
          {index + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}
