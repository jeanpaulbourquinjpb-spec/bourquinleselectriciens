import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhotoCarousel, type PhotoCarouselImage } from "@/components/PhotoCarousel";
import type { SponsoringEntryDTO, SponsoringPhotoDTO } from "@/lib/sponsoring.functions";
import { SPONSORING_CATEGORIES } from "@/lib/sponsoring.functions";

const CATEGORY_ORDER = SPONSORING_CATEGORIES as readonly string[];

export function SponsoringSection({ entries }: { entries: SponsoringEntryDTO[] }) {
  const [lightbox, setLightbox] = useState<{
    photos: SponsoringPhotoDTO[];
    index: number;
    title: string;
  } | null>(null);

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

  const { images, entryByImage } = useMemo(() => {
    const imgs: PhotoCarouselImage[] = [];
    const map: { entry: SponsoringEntryDTO; photoIndex: number }[] = [];
    for (const entry of sorted) {
      const photos = entry.photos.length > 0
        ? entry.photos
        : entry.image_url
          ? [{ id: `${entry.id}-cover`, url: entry.image_url, is_cover: true, sort_order: 0 }]
          : [];
      photos.forEach((ph, photoIndex) => {
        imgs.push({
          id: ph.id,
          url: ph.url,
          alt: entry.title,
          category: entry.category,
          title: entry.title,
          description: entry.description ?? undefined,
        });
        map.push({ entry, photoIndex });
      });
    }
    return { images: imgs, entryByImage: map };
  }, [sorted]);

  return (
    <>
      <div className="container-x mt-12">
        {entries.length === 0 ? (
          <p className="text-sm text-[color:var(--muted-foreground)] italic">
            Engagements à venir.
          </p>
        ) : (
          <div className="mx-auto max-w-xl">
            <PhotoCarousel
              images={images}
              onSlideClick={(i) => {
                const ref = entryByImage[i];
                if (!ref) return;
                setLightbox({
                  photos: ref.entry.photos,
                  index: ref.photoIndex,
                  title: ref.entry.title,
                });
              }}
            />
          </div>
        )}
      </div>

      {lightbox && (
        <Lightbox
          photos={lightbox.photos}
          startIndex={lightbox.index}
          title={lightbox.title}
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
  photos: SponsoringPhotoDTO[];
  startIndex: number;
  title: string;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const hasMany = photos.length > 1;
  const setI = (i: number) => setIndex(((i % photos.length) + photos.length) % photos.length);

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
            aria-label="Précédent"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setI(index + 1); }}
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
      >
        {photos.map((ph, i) => (
          <img
            key={ph.id}
            src={ph.url}
            alt={title}
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
