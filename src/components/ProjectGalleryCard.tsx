import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectDTO } from "@/lib/projects.functions";

export function ProjectGalleryCard({ p }: { p: ProjectDTO }) {
  const photos = p.photos.length > 0 ? p.photos : p.image_url ? [{ id: "_", url: p.image_url, is_cover: true, sort_order: 0 }] : [];
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const hasMany = photos.length > 1;

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + photos.length) % photos.length);
    },
    [photos.length],
  );

  return (
    <>
      <div className="card-soft overflow-hidden p-0 flex flex-col">
        <button
          type="button"
          onClick={() => photos.length > 0 && setLightbox(true)}
          className="relative aspect-[4/3] bg-[color:var(--surface-muted)] flex items-center justify-center overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {photos.length > 0 ? (
            <>
              {photos.map((ph, i) => (
                <img
                  key={ph.id}
                  src={ph.url}
                  alt={p.title}
                  loading="lazy"
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                    i === index ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                {p.category && (
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/80">
                    {p.category}
                  </p>
                )}
                <p className="mt-1 text-white text-base font-medium leading-snug line-clamp-2 text-left">
                  {p.title}
                </p>
              </div>
            </>
          ) : (
            <ImageIcon className="w-10 h-10 text-[color:var(--muted-foreground)]" />
          )}

          {hasMany && (
            <>
              <span
                role="button"
                tabIndex={0}
                aria-label="Photo précédente"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    go(-1);
                  }
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </span>
              <span
                role="button"
                tabIndex={0}
                aria-label="Photo suivante"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    go(1);
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </span>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {photos.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-colors",
                      i === index ? "bg-white" : "bg-white/40",
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </button>

        {hasMany && (
          <div className="p-3 flex gap-2 overflow-x-auto">
            {photos.map((ph, i) => (
              <button
                key={ph.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Voir la photo ${i + 1}`}
                className={cn(
                  "shrink-0 w-14 h-14 rounded overflow-hidden border-2 transition-colors",
                  i === index
                    ? "border-primary"
                    : "border-transparent hover:border-[color:var(--border)]",
                )}
              >
                <img src={ph.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && photos.length > 0 && (
        <Lightbox
          photos={photos}
          startIndex={index}
          title={p.title}
          onClose={() => setLightbox(false)}
          onIndexChange={setIndex}
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
  onIndexChange,
}: {
  photos: { id: string; url: string }[];
  startIndex: number;
  title: string;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const hasMany = photos.length > 1;
  const touchStartX = useRef<number | null>(null);

  const setI = useCallback(
    (i: number) => {
      const next = (i + photos.length) % photos.length;
      setIndex(next);
      onIndexChange(next);
    },
    [photos.length, onIndexChange],
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
            onClick={(e) => {
              e.stopPropagation();
              setI(index - 1);
            }}
            aria-label="Photo précédente"
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
