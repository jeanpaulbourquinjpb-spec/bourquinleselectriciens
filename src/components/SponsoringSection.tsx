import { useMemo, useState } from "react";
import { PhotoCarousel, type PhotoCarouselImage } from "@/components/PhotoCarousel";
import { PhotoLightbox } from "@/components/PhotoLightbox";
import type { SponsoringEntryDTO } from "@/lib/sponsoring.functions";
import { SPONSORING_CATEGORIES } from "@/lib/sponsoring.functions";

const CATEGORY_ORDER = SPONSORING_CATEGORIES as readonly string[];

export function SponsoringSection({ entries }: { entries: SponsoringEntryDTO[] }) {
  const [lightboxEntry, setLightboxEntry] = useState<SponsoringEntryDTO | null>(null);

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

  // Level 1: one slide per event (cover photo only)
  const slides: PhotoCarouselImage[] = useMemo(
    () =>
      sorted.map((entry) => {
        const cover = entry.photos[0]?.url ?? entry.image_url;
        return {
          id: entry.id,
          url: cover,
          alt: entry.title,
          category: entry.category,
          title: entry.title,
        };
      }),
    [sorted],
  );

  return (
    <>
      <div className="container-x mt-12">
        {sorted.length === 0 ? (
          <p className="text-sm text-[color:var(--muted-foreground)] italic">
            Engagements à venir.
          </p>
        ) : (
          <div className="mx-auto max-w-xl">
            <PhotoCarousel
              images={slides}
              onSlideClick={(i) => setLightboxEntry(sorted[i] ?? null)}
            />
          </div>
        )}
      </div>

      {lightboxEntry && (
        <PhotoLightbox
          photos={lightboxEntry.photos}
          title={lightboxEntry.title}
          onClose={() => setLightboxEntry(null)}
        />
      )}
    </>
  );
}
