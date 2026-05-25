import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getGoogleReviews, getGoogleMapsEmbedUrl, type GoogleReviewsData } from "@/lib/reviews.functions";


const PLACE_ID = "ChIJfS2J5zZljEcREXY9RXGNl_I";
const WRITE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${PLACE_ID}`;

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  const full = Math.round(rating);
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${rating} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={i < full ? "" : "opacity-25"}
          style={{ color: "#ff6633", fill: i < full ? "#ff6633" : "transparent" }}
        />
      ))}
    </div>
  );
}

export function GoogleReviewsSection() {
  const fetchReviews = useServerFn(getGoogleReviews);
  const fetchMapUrl = useServerFn(getGoogleMapsEmbedUrl);
  const [data, setData] = useState<GoogleReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapSrc, setMapSrc] = useState<string>(
    "https://www.google.com/maps?q=Rue+Henri-Blanvalet+21,+1207+Gen%C3%A8ve&output=embed",
  );

  useEffect(() => {
    let cancelled = false;
    fetchReviews()
      .then((d) => {
        if (cancelled) return;
        console.log("[GoogleReviews] server response:", JSON.stringify(d));
        if (d.raw) {
          console.log("[GoogleReviews] raw Places API:", JSON.stringify(d.raw));
        }
        setData(d);
        if (d.error) setError(d.error);
      })
      .catch((e) => {
        console.error("[GoogleReviews] fetch failed:", e);
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    fetchMapUrl()
      .then((m) => {
        if (!cancelled && m.url) setMapSrc(m.url);
      })
      .catch((e) => console.error("[GoogleReviews] map url fetch failed:", e));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rating = data?.rating ?? 4.9;
  const total = data?.user_ratings_total ?? 154;
  const reviews = data?.reviews ?? [];

  return (
    <section className="py-24 bg-[color:var(--surface-muted)]">
      <div className="container-x">
        <p className="eyebrow">Avis Google</p>
        <h2 className="mt-2 text-3xl md:text-4xl">Ce que disent nos clients</h2>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="text-4xl font-semibold" style={{ color: "#ff6633" }}>
            {rating.toFixed(1)}
          </span>
          <Stars rating={rating} size={22} />
          <span className="text-sm text-[color:var(--muted-foreground,#666)]">
            {total} avis sur Google
          </span>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-2xl overflow-hidden border border-[color:var(--line)] aspect-[4/3] lg:aspect-auto lg:min-h-[420px] shadow-md">
            <iframe
              title="Localisation bourquin les électriciens"
              src={mapSrc}
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <ReviewsCarousel reviews={reviews} loading={loading} error={error} />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href={WRITE_REVIEW_URL} target="_blank" rel="noreferrer" className="btn-brand">
            Laisser un avis Google
          </a>
          <a
            href={data?.url ?? `https://search.google.com/local/reviews?placeid=${PLACE_ID}`}
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            Voir tous les avis Google
          </a>
        </div>
      </div>
    </section>
  );
}

type Review = NonNullable<GoogleReviewsData["reviews"]>[number];

function ReviewsCarousel({
  reviews,
  loading,
  error,
}: {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = reviews.length;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPaused || count <= 1) return;
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, count]);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700" role="alert">
        <p className="font-semibold">Erreur de chargement des avis Google</p>
        <p className="mt-1 break-words">{error}</p>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="card-soft text-sm text-[color:var(--muted-foreground,#666)]">
        Chargement des avis…
      </div>
    );
  }
  if (count === 0) {
    return <div className="card-soft text-sm">Les avis ne sont pas disponibles pour le moment.</div>;
  }

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {reviews.map((r, i) => (
            <div
              key={`${r.time}-${i}`}
              className="shrink-0 basis-full md:basis-1/2 px-2"
            >
              <article
                className="h-full rounded-2xl bg-white p-6 border border-[color:var(--line)] flex flex-col"
                style={{ boxShadow: "0 4px 18px -8px rgba(0,0,0,0.15)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold">{r.author_name}</p>
                  <Stars rating={r.rating} />
                </div>
                <p className="mt-3 text-sm leading-relaxed line-clamp-3 flex-1">{r.text}</p>
                <p className="mt-3 text-xs text-[color:var(--muted-foreground,#666)]">
                  {r.relative_time_description}
                </p>
              </article>
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Avis précédent"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-4 z-10 rounded-full bg-white border border-[color:var(--line)] shadow-md p-2 hover:bg-[color:var(--surface-muted)]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Avis suivant"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-4 z-10 rounded-full bg-white border border-[color:var(--line)] shadow-md p-2 hover:bg-[color:var(--surface-muted)]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}

