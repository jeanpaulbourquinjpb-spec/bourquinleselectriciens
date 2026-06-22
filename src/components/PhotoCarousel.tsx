import { useEffect, useRef, useState, useCallback } from "react";
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
  const touchStartX = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const [firstLoaded, setFirstLoaded] = useState(false);

  const total = images.length;
  const hasImages = total > 0;

  // Reset state when image set changes
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

  // Update index when user scrolls
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

  // Skeleton placeholder while data is empty / loading
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
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const track = trackRef.current;
            if (!track) return;
            const w = track.clientWidth;
            const startX = touchStartX.current;
            touchStartX.current = null;
            let target = Math.round(track.scrollLeft / w);
            if (startX != null) {
              const dx = e.changedTouches[0].clientX - startX;
              if (Math.abs(dx) > 50) {
                target = Math.max(0, Math.min(total - 1, index + (dx < 0 ? 1 : -1)));
              }
            }
            setIndex(target);
            track.scrollTo({ left: target * w, behavior: "smooth" });
          }}
          style={{ scrollSnapType: "x mandatory" }}
          className="absolute inset-0 flex overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, i) => (
            <div
              key={img.id}
              onClick={() => onSlideClick?.(i)}
              style={{
                scrollSnapAlign: "start",
                scrollSnapStop: "always",
                flexShrink: 0,
                width: "100%",
              }}
              className={cn(
                "relative h-full bg-neutral-900",
                onSlideClick && "cursor-pointer",
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
                onLoad={() => i === 0 && setFirstLoaded(true)}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {(img.category || img.title || img.description) && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex flex-col justify-end p-4">
                  {img.category && (
                    <p className="text-[11px] uppercase tracking-[0.18em] font-medium text-[#ff6633]">
                      {img.category}
                    </p>
                  )}
                  {img.title && (
                    <p className="mt-1 text-white text-base font-bold leading-snug line-clamp-2">
                      {img.title}
                    </p>
                  )}
                  {img.description && (
                    <p className="mt-1 text-white/90 text-sm leading-snug line-clamp-2">
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
