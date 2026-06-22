import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type PhotoCarouselImage = {
  id: string;
  url: string;
  alt?: string;
  category?: string;
  title?: string;
  description?: string;
};

type Props = {
  images: PhotoCarouselImage[];
  onSlideClick?: (index: number) => void;
  className?: string;
};

export function PhotoCarousel({ images, onSlideClick, className }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [index, setIndex] = useState(0);
  const [firstLoaded, setFirstLoaded] = useState(false);

  const total = images.length;
  const hasImages = total > 0;

  useEffect(() => {
    setIndex(0);
    setFirstLoaded(false);
  }, [images]);

  const scrollToIndex = useCallback((i: number, smooth = true) => {
    const track = trackRef.current;
    if (!track) return;
    const w = track.clientWidth;
    track.scrollTo({ left: i * w, behavior: smooth ? "smooth" : "auto" });
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(total - 1, i));
      setIndex(next);
      scrollToIndex(next);
    },
    [total, scrollToIndex],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = track.clientWidth;
        if (w <= 0) return;
        const nearest = Math.round(track.scrollLeft / w);
        setIndex((prev) => (prev === nearest ? prev : nearest));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("scroll", onScroll);
    };
  }, [total]);

  if (!hasImages) {
    return (
      <div className={cn("w-full", className)}>
        <div className="aspect-[4/5] md:aspect-square w-full rounded-lg bg-neutral-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="relative aspect-[4/5] md:aspect-square w-full overflow-hidden rounded-lg bg-neutral-900">
        <div
          ref={trackRef}
          onTouchStart={(e) => {
            touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }}
          onTouchEnd={(e) => {
            const track = trackRef.current;
            const start = touchStart.current;
            touchStart.current = null;
            if (!track) return;
            const w = track.clientWidth;
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const dx = start ? endX - start.x : 0;
            const dy = start ? endY - start.y : 0;
            const absX = Math.abs(dx);
            const absY = Math.abs(dy);

            // Tap (small movement) → open lightbox
            if (absX < 10 && absY < 10) {
              onSlideClick?.(index);
              track.scrollTo({ left: index * w, behavior: "smooth" });
              return;
            }

            // Swipe → navigate, clamped to bounds
            if (absX > 50 && absX > absY) {
              const target = Math.max(0, Math.min(total - 1, index + (dx < 0 ? 1 : -1)));
              setIndex(target);
              track.scrollTo({ left: target * w, behavior: "smooth" });
            } else {
              // Snap back to current
              track.scrollTo({ left: index * w, behavior: "smooth" });
            }
          }}
          style={{ scrollSnapType: "x mandatory", overscrollBehaviorX: "contain" }}
          className="absolute inset-0 flex overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, i) => (
            <div
              key={img.id}
              onClick={(e) => {
                // Desktop click → open lightbox. Skip on touch (handled in onTouchEnd).
                if ((e as unknown as { pointerType?: string }).pointerType === "touch") return;
                onSlideClick?.(i);
              }}
              style={{
                scrollSnapAlign: "start",
                scrollSnapStop: "always",
                flexShrink: 0,
                width: "100%",
              }}
              className={cn(
                "relative h-full bg-neutral-900",
                onSlideClick && "md:cursor-pointer",
              )}
            >
              {!firstLoaded && i === 0 && (
                <div className="absolute inset-0 bg-neutral-800 animate-pulse" aria-hidden />
              )}
              <img
                src={img.url}
                alt={img.alt ?? img.title ?? ""}
                loading="eager"
                decoding="async"
                draggable={false}
                onLoad={() => i === 0 && setFirstLoaded(true)}
                className="absolute inset-0 w-full h-full object-cover select-none"
              />

              {(img.category || img.title || img.description) && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex flex-col justify-end p-4 text-left">
                  {img.category && (
                    <p className="text-left text-[11px] uppercase tracking-[0.18em] font-medium text-[#ff6633]">
                      {img.category}
                    </p>
                  )}
                  {img.title && (
                    <p className="mt-1 text-left text-white text-base font-bold leading-snug line-clamp-2">
                      {img.title}
                    </p>
                  )}
                  {img.description && (
                    <p className="mt-1 text-left text-white/90 text-sm leading-snug line-clamp-2">
                      {img.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {total > 1 && (
          <div className="absolute top-2 right-2 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded-full pointer-events-none tabular-nums">
            {index + 1} / {total}
          </div>
        )}

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Image précédente"
              disabled={index === 0}
              onClick={(e) => {
                e.stopPropagation();
                goTo(index - 1);
              }}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Image suivante"
              disabled={index === total - 1}
              onClick={(e) => {
                e.stopPropagation();
                goTo(index + 1);
              }}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Aller à l'image ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                i === index ? "bg-[#ff6633]" : "bg-neutral-400/50",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
