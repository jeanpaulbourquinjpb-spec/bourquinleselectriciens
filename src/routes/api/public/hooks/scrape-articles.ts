import { createFileRoute } from "@tanstack/react-router";
import { scrapeAndStoreArticles } from "@/lib/scrape-articles.server";

export const Route = createFileRoute("/api/public/hooks/scrape-articles")({
  server: {
    handlers: {
      POST: async () => {
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
