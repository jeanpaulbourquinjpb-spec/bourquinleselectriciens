import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Star, ExternalLink } from "lucide-react";
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

          <div className="space-y-4">
            {error && (
              <div
                className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700"
                role="alert"
              >
                <p className="font-semibold">Erreur de chargement des avis Google</p>
                <p className="mt-1 break-words">{error}</p>
              </div>
            )}
            {loading && (
              <div className="card-soft text-sm text-[color:var(--muted-foreground,#666)]">
                Chargement des avis…
              </div>
            )}
            {!loading && !error && reviews.length === 0 && (
              <div className="card-soft text-sm">
                Les avis ne sont pas disponibles pour le moment.
              </div>
            )}
            {reviews.map((r, i) => (
              <article
                key={`${r.time}-${i}`}
                className="rounded-2xl bg-white p-6 border border-[color:var(--line)]"
                style={{ boxShadow: "0 4px 18px -8px rgba(0,0,0,0.15)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{r.author_name}</p>
                    <p className="text-xs text-[color:var(--muted-foreground,#666)] mt-0.5">
                      {r.relative_time_description}
                    </p>
                  </div>
                  <Stars rating={r.rating} />
                </div>
                <p className="mt-3 text-sm leading-relaxed line-clamp-5">{r.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={WRITE_REVIEW_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-brand"
          >
            Laisser un avis <ExternalLink className="w-4 h-4" />
          </a>
          {data?.url && (
            <a href={data.url} target="_blank" rel="noreferrer" className="btn-outline">
              Voir tous les avis
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
