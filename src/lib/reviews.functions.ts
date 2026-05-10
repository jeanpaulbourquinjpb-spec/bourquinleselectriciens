import { createServerFn } from "@tanstack/react-start";

export type GoogleReview = {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  time: number;
  profile_photo_url?: string;
};

export type GoogleReviewsData = {
  rating: number;
  user_ratings_total: number;
  reviews: GoogleReview[];
  url: string;
  place_id: string;
  error?: string;
};

export const getGoogleReviews = createServerFn({ method: "GET" }).handler(
  async (): Promise<GoogleReviewsData> => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    const fallback: GoogleReviewsData = {
      rating: 0,
      user_ratings_total: 0,
      reviews: [],
      url: placeId
        ? `https://search.google.com/local/writereview?placeid=${placeId}`
        : "https://www.google.com",
      place_id: placeId ?? "",
    };

    if (!apiKey || !placeId) {
      return { ...fallback, error: "Missing GOOGLE_MAPS_API_KEY or GOOGLE_PLACE_ID" };
    }

    try {
      const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
      url.searchParams.set("place_id", placeId);
      url.searchParams.set("fields", "rating,user_ratings_total,reviews,url");
      url.searchParams.set("language", "fr");
      url.searchParams.set("reviews_sort", "newest");
      url.searchParams.set("key", apiKey);

      const res = await fetch(url.toString());
      if (!res.ok) {
        return { ...fallback, error: `HTTP ${res.status}` };
      }
      const json = (await res.json()) as {
        status: string;
        error_message?: string;
        result?: {
          rating?: number;
          user_ratings_total?: number;
          reviews?: GoogleReview[];
          url?: string;
        };
      };

      if (json.status !== "OK" || !json.result) {
        return { ...fallback, error: json.error_message ?? json.status };
      }

      const reviews = (json.result.reviews ?? [])
        .slice()
        .sort((a, b) => b.time - a.time)
        .slice(0, 5);

      return {
        rating: json.result.rating ?? 0,
        user_ratings_total: json.result.user_ratings_total ?? 0,
        reviews,
        url:
          json.result.url ??
          `https://search.google.com/local/writereview?placeid=${placeId}`,
        place_id: placeId,
      };
    } catch (err) {
      return { ...fallback, error: err instanceof Error ? err.message : "Unknown error" };
    }
  },
);
