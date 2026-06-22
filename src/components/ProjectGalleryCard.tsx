import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import type { ProjectDTO } from "@/lib/projects.functions";

export function ProjectGalleryCard({ p }: { p: ProjectDTO }) {
  const photos = p.photos.length > 0
    ? p.photos
    : p.image_url
      ? [{ id: "_", url: p.image_url, is_cover: true, sort_order: 0 }]
      : [];
  const [lightbox, setLightbox] = useState<number | null>(null);
  const hasMany = photos.length > 1;

  return (
    <>
      <div className="card-soft overflow-hidden p-0 flex flex-col">
        {photos.length === 0 ? (
          <div className="relative aspect-[4/3] bg-[color:var(--surface-muted)] flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-[color:var(--muted-foreground)]" />
          </div>
        ) : hasMany ? (
          <PhotoCarousel
            images={photos.map((ph) => ({
              id: ph.id,
              url: ph.url,
              alt: p.title,
              category: p.category ?? undefined,
              title: p.title,
            }))}
            onSlideClick={(i) => setLightbox(i)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setLightbox(0)}
            className="relative aspect-[4/5] md:aspect-square bg-neutral-900 overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <img
              src={photos[0].url}
              alt={p.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex flex-col justify-end p-4">
              {p.category && (
                <p className="text-[11px] uppercase tracking-[0.18em] font-medium text-[#ff6633]">
                  {p.category}
                </p>
              )}
              <p className="mt-1 text-white text-base font-bold leading-snug line-clamp-2 text-left">
                {p.title}
              </p>
            </div>
          </button>
        )}
      </div>

      {lightbox !== null && photos.length > 0 && (
        <Lightbox
          photos={photos}
          startIndex={lightbox}
          title={p.title}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}

function Lightbox({
  photos,
  startIndex,
  title,
  onClose,
}: {
  photos: { id: string; url: string }[];
  startIndex: number;
  title: string;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const hasMany = photos.length > 1;
  const touchStartX = useRef<number | null>(null);

  const setI = useCallback(
    (i: number) => setIndex(((i % photos.length) + photos.length) % photos.length),
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
      aria-label={title}
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
            onClick={(e) => { e.stopPropagation(); setI(index - 1); }}
            aria-label="Photo précédente"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setI(index + 1); }}
            aria-label="Photo suivante"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-12"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
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
            alt={title}
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
