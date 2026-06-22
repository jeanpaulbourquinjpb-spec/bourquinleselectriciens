import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type LightboxPhoto = { id: string; url: string };

type Props = {
  photos: LightboxPhoto[];
  startIndex?: number;
  title?: string;
  onClose: () => void;
};

export function PhotoLightbox({ photos, startIndex = 0, title, onClose }: Props) {
  const [index, setIndex] = useState(startIndex);
  const total = photos.length;
  const hasMany = total > 1;
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const setI = useCallback(
    (i: number) => setIndex(((i % total) + total) % total),
    [total],
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
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-fade-in"
    >
      {/* Counter top-center */}
      {hasMany && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white text-sm tabular-nums bg-black/40 px-3 py-1 rounded-full">
          {index + 1} / {total}
        </div>
      )}

      {/* Close top-right */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
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
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setI(index + 1); }}
            aria-label="Photo suivante"
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-12"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }}
        onTouchEnd={(e) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start || !hasMany) return;
          const dx = e.changedTouches[0].clientX - start.x;
          const dy = e.changedTouches[0].clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            setI(index + (dx < 0 ? 1 : -1));
          }
        }}
      >
        {photos.map((ph, i) => (
          <img
            key={ph.id}
            src={ph.url}
            alt={title ?? ""}
            className={cn(
              "absolute max-w-full max-h-full object-contain transition-opacity duration-300",
              i === index ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          />
        ))}
      </div>

      {/* Dots bottom */}
      {hasMany && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Aller à la photo ${i + 1}`}
              onClick={(e) => { e.stopPropagation(); setI(i); }}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                i === index ? "bg-[#ff6633]" : "bg-white/40",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
