import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type ArticleDTO = {
  id: string;
  url: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  published_at: string | null;
  featured: boolean;
};

export const getArticles = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select("id, url, title, excerpt, category, published_at, featured")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("scraped_at", { ascending: false });

  if (error) {
    console.error("getArticles error:", error);
    return { articles: [] as ArticleDTO[] };
  }
  return { articles: (data ?? []) as ArticleDTO[] };
});
