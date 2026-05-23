// Server-only: scrape e-tec.swiss articles via Firecrawl and upsert into Supabase.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BASE = "https://www.e-tec.swiss";
const MEMBER = "1108";
const ENTRY = `${BASE}/fr?member=${MEMBER}`;

type FirecrawlMapResp = {
  success?: boolean;
  links?: Array<string | { url: string }>;
  data?: { links?: string[] };
};

type ExtractedArticle = {
  title?: string | null;
  excerpt?: string | null;
  category?: string | null;
  published_at?: string | null;
};

type FirecrawlScrapeResp = {
  success?: boolean;
  data?: {
    json?: ExtractedArticle;
    metadata?: { title?: string; description?: string; sourceURL?: string };
  };
  json?: ExtractedArticle;
  metadata?: { title?: string; description?: string; sourceURL?: string };
};

function requireKey() {
  const k = process.env.FIRECRAWL_API_KEY;
  if (!k) throw new Error("FIRECRAWL_API_KEY is not configured");
  return k;
}

async function fcMap(url: string): Promise<string[]> {
  const res = await fetch("https://api.firecrawl.dev/v2/map", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, limit: 500, includeSubdomains: false }),
  });
  if (!res.ok) throw new Error(`Firecrawl map failed [${res.status}]: ${await res.text()}`);
  const json = (await res.json()) as FirecrawlMapResp;
  const raw = json.links ?? json.data?.links ?? [];
  return raw
    .map((l) => (typeof l === "string" ? l : l.url))
    .filter((u): u is string => typeof u === "string");
}

async function fcScrape(url: string): Promise<{ extracted: ExtractedArticle; metaTitle?: string; metaDesc?: string }> {
  const schema = {
    type: "object",
    properties: {
      title: { type: "string", description: "Article title" },
      excerpt: { type: "string", description: "Short summary or intro paragraph, max 400 chars" },
      category: {
        type: "string",
        description:
          "Top-level category, e.g. 'Installation de base', 'Énergies alternatives', 'Sécurité', 'Télécommunication', 'Domotique'.",
      },
      published_at: { type: "string", description: "Publication date in ISO 8601 if present" },
    },
  };

  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      onlyMainContent: true,
      formats: [{ type: "json", schema, prompt: "Extract the article metadata." }],
    }),
  });
  if (!res.ok) throw new Error(`Firecrawl scrape failed [${res.status}]: ${await res.text()}`);
  const json = (await res.json()) as FirecrawlScrapeResp;
  const data = json.data ?? json;
  return {
    extracted: data.json ?? {},
    metaTitle: data.metadata?.title,
    metaDesc: data.metadata?.description,
  };
}

function withMember(url: string): string {
  try {
    const u = new URL(url);
    if (!u.searchParams.has("member")) u.searchParams.set("member", MEMBER);
    return u.toString();
  } catch {
    return url;
  }
}

function isArticleUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.hostname !== "www.e-tec.swiss") return false;
    if (!u.pathname.startsWith("/fr/")) return false;
    // Article URLs have 3+ segments under /fr/, e.g. /fr/<category>/<slug>
    const parts = u.pathname.split("/").filter(Boolean);
    return parts.length >= 3;
  } catch {
    return false;
  }
}

export type ScrapeResult = {
  discovered: number;
  scraped: number;
  inserted: number;
  skipped: number;
  errors: Array<{ url: string; error: string }>;
};

export async function scrapeAndStoreArticles(maxPages = 40): Promise<ScrapeResult> {
  const result: ScrapeResult = { discovered: 0, scraped: 0, inserted: 0, skipped: 0, errors: [] };

  // 1. Discover URLs
  const links = await fcMap(ENTRY);
  const articleUrls = Array.from(
    new Set(links.filter(isArticleUrl).map((u) => withMember(u))),
  ).slice(0, maxPages);
  result.discovered = articleUrls.length;

  // 2. Filter against DB — URLs are stored canonically with ?member=1108 appended.
  // Also check legacy URLs (without member) so we don't re-insert old entries.
  const urlsNoMember = articleUrls.map((u) => {
    const x = new URL(u);
    x.searchParams.delete("member");
    return x.toString();
  });

  const { data: existing } = await supabaseAdmin
    .from("articles")
    .select("url")
    .in("url", [...articleUrls, ...urlsNoMember]);
  const have = new Set((existing ?? []).map((r) => r.url));

  const toScrape = articleUrls.filter((u) => {
    const noMember = (() => {
      const x = new URL(u);
      x.searchParams.delete("member");
      return x.toString();
    })();
    return !have.has(u) && !have.has(noMember);
  });

  // 3. Scrape and insert
  for (const url of toScrape) {
    try {
      const { extracted, metaTitle, metaDesc } = await fcScrape(url);
      result.scraped++;

      const title = (extracted.title || metaTitle || "").trim();
      if (!title) {
        result.skipped++;
        continue;
      }

      const canonicalUrl = withMember(url);

      const publishedAt = extracted.published_at
        ? new Date(extracted.published_at).toISOString()
        : null;

      const { error } = await supabaseAdmin.from("articles").insert({
        url: canonicalUrl,
        title,
        excerpt: (extracted.excerpt || metaDesc || "").trim() || null,
        category: (extracted.category || "").trim() || null,
        published_at: publishedAt,
      });

      if (error) {
        if (error.code === "23505") {
          result.skipped++;
        } else {
          result.errors.push({ url, error: error.message });
        }
      } else {
        result.inserted++;
      }
    } catch (e) {
      result.errors.push({ url, error: e instanceof Error ? e.message : String(e) });
    }
  }

  // 4. Refresh featured flag: most recent article gets featured=true
  await supabaseAdmin.from("articles").update({ featured: false }).eq("featured", true);
  const { data: newest } = await supabaseAdmin
    .from("articles")
    .select("id")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("scraped_at", { ascending: false })
    .limit(1);
  if (newest && newest[0]) {
    await supabaseAdmin.from("articles").update({ featured: true }).eq("id", newest[0].id);
  }

  return result;
}
