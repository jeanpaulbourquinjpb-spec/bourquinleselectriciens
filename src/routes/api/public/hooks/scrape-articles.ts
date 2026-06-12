import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "crypto";
import { scrapeAndStoreArticles } from "@/lib/scrape-articles.server";

function authorized(request: Request): boolean {
  const secret = process.env.SCRAPE_WEBHOOK_SECRET;
  if (!secret) return false;
  const header =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    request.headers.get("x-webhook-secret") ??
    "";
  const a = Buffer.from(header);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export const Route = createFileRoute("/api/public/hooks/scrape-articles")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!authorized(request)) {
          return new Response("Unauthorized", { status: 401 });
        }
        try {
          const result = await scrapeAndStoreArticles();
          return Response.json({ success: true, ...result });
        } catch (e) {
          console.error("scrape-articles failed:", e);
          return Response.json(
            { success: false, error: e instanceof Error ? e.message : String(e) },
            { status: 500 },
          );
        }
      },
    },
  },
});
