import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Star, ExternalLink } from "lucide-react";
import { getGoogleReviews, type GoogleReviewsData } from "@/lib/reviews.functions";

const PLACE_ID = "ChIJuThs3TZljEcRZQMSVoTiA_A";
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
  const [data, setData] = useState<GoogleReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchReviews()
      .then((d) => {
        if (cancelled) return;
        // Debug: log raw Google Places API response
        console.log("[GoogleReviews] server response:", d);
        if (d.raw) {
          try {
            console.log("[GoogleReviews] raw Places API:", JSON.parse(d.raw));
          } catch {
            console.log("[GoogleReviews] raw (string):", d.raw);
          }
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
    return () => {
      cancelled = true;
    };
  }, [fetchReviews]);

  const rating = data?.rating ?? 4.9;
  const total = data?.user_ratings_total ?? 154;
  const reviews = data?.reviews ?? [];

  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${
    import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY ?? ""
  }&q=place_id:${PLACE_ID}`;
  // Fallback to keyless iframe embed (no API key needed) for reliability:
  const mapSrcFallback = `https://www.google.com/maps?q=Rue+Henri-Blanvalet+21,+1207+Gen%C3%A8ve&output=embed`;

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
              src={mapSrcFallback}
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
