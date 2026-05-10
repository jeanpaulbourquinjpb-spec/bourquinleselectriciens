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
  raw?: string;
  error?: string;
};

type PlacesV1Review = {
  name?: string;
  rating?: number;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
};

type PlacesV1Response = {
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  reviews?: PlacesV1Review[];
  error?: { message?: string; status?: string; code?: number };
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
      return {
        ...fallback,
        error: `Missing env var: ${!apiKey ? "GOOGLE_MAPS_API_KEY " : ""}${!placeId ? "GOOGLE_PLACE_ID" : ""}`.trim(),
      };
    }

    try {
      const url = `https://places.googleapis.com/v1/places/${placeId}?languageCode=fr`;
      const res = await fetch(url, {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews",
        },
      });

      const json = (await res.json()) as PlacesV1Response;

      if (!res.ok) {
        return {
          ...fallback,
          raw: JSON.stringify(json),
          error: `HTTP ${res.status}: ${json?.error?.message ?? res.statusText}`,
        };
      }

      const reviews: GoogleReview[] = (json.reviews ?? [])
        .slice()
        .sort((a, b) => {
          const ta = a.publishTime ? new Date(a.publishTime).getTime() : 0;
          const tb = b.publishTime ? new Date(b.publishTime).getTime() : 0;
          return tb - ta;
        })
        .slice(0, 5)
        .map((r) => ({
          author_name: r.authorAttribution?.displayName ?? "Anonyme",
          rating: r.rating ?? 0,
          text: r.text?.text ?? r.originalText?.text ?? "",
          relative_time_description: r.relativePublishTimeDescription ?? "",
          time: r.publishTime ? new Date(r.publishTime).getTime() : 0,
          profile_photo_url: r.authorAttribution?.photoUri,
        }));

      return {
        rating: json.rating ?? 0,
        user_ratings_total: json.userRatingCount ?? 0,
        reviews,
        url: `https://search.google.com/local/writereview?placeid=${placeId}`,
        place_id: placeId,
        raw: JSON.stringify(json),
      };
    } catch (err) {
      return {
        ...fallback,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  },
);
