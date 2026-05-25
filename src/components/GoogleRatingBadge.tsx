import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Star } from "lucide-react";
import { getGoogleReviews, type GoogleReviewsData } from "@/lib/reviews.functions";

export function GoogleRatingBadge() {
  const fetchReviews = useServerFn(getGoogleReviews);
  const [data, setData] = useState<GoogleReviewsData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchReviews()
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rating = data?.rating ?? 4.9;
  const total = data?.user_ratings_total ?? 154;

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/25 px-4 py-2 text-sm font-medium text-white">
      <Star className="w-4 h-4" style={{ color: "#ff6633", fill: "#ff6633" }} />
      <span>{rating.toFixed(1)}</span>
      <span className="text-white/80">· {total} avis Google</span>
    </span>
  );
}
