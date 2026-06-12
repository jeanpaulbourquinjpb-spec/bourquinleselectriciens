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

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
let cache: { data: GoogleReviewsData; expiresAt: number } | null = null as { data: GoogleReviewsData; expiresAt: number } | null;

export const getGoogleMapsEmbedUrl = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ url: string; error?: string }> => {
    // Use a dedicated Maps Embed key only — never fall back to the Places API key,
    // which would expose a server-only key to the browser via the iframe URL.
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const placeId = "ChIJfS2J5zZljEcREXY9RXGNl_I";
    if (!apiKey) {
      // Fallback to keyless embed so the iframe still renders without leaking a key.
      return {
        url: `https://www.google.com/maps?q=place_id:${placeId}&output=embed`,
      };
    }
    return {
      url: `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=place_id:${placeId}&language=fr`,
    };
  },
);

export const getGoogleReviews = createServerFn({ method: "GET" }).handler(
  async (): Promise<GoogleReviewsData> => {
    if (cache && cache.expiresAt > Date.now()) {
      return cache.data;
    }
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
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
        error: `Missing env var: ${!apiKey ? "GOOGLE_PLACES_API_KEY " : ""}${!placeId ? "GOOGLE_PLACE_ID" : ""}`.trim(),
      };
    }

    try {
      const url = `https://places.googleapis.com/v1/places/${placeId}`;

      const res = await fetch(url, {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "rating,userRatingCount,reviews,displayName,googleMapsUri",
          "Content-Type": "application/json",
        },
      });

      const statusCode = res.status;
      const rawText = await res.text();

      let json: PlacesV1Response = {};
      try {
        json = JSON.parse(rawText) as PlacesV1Response;
      } catch {
        return {
          ...fallback,
          error: `HTTP ${statusCode}: non-JSON response`,
        };
      }

      if (!res.ok) {
        return {
          ...fallback,
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

      const result: GoogleReviewsData = {
        rating: json.rating ?? 0,
        user_ratings_total: json.userRatingCount ?? 0,
        reviews,
        url: json && (json as { googleMapsUri?: string }).googleMapsUri
          ? (json as { googleMapsUri?: string }).googleMapsUri!
          : `https://search.google.com/local/writereview?placeid=${placeId}`,
        place_id: placeId,
      };
      cache = { data: result, expiresAt: Date.now() + CACHE_TTL_MS };
      return result;
    } catch (err) {
      return {
        ...fallback,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  },
);
