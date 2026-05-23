import { createServerFn } from "@tanstack/react-start";

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const POSTS = [
  "https://www.instagram.com/p/DW3-Q-WDI3O/",
  "https://www.instagram.com/p/DW3972xDOvB/",
  "https://www.instagram.com/p/DN0Tbv_WOgw/",
  "https://www.instagram.com/p/DNpdVSAs6wW/",
  "https://www.instagram.com/p/DJb0ts5o4dM/",
  "https://www.instagram.com/p/DJMGNtFoM0A/",
  "https://www.instagram.com/p/DI1UE4ksOot/",
  "https://www.instagram.com/p/DFch92ksYWt/",
  "https://www.instagram.com/p/DFZ94DMMMES/",
  "https://www.instagram.com/p/DFXWxfoMnRg/",
  "https://www.instagram.com/p/DFPs1GMs-C6/",
];

type FcResp = {
  success?: boolean;
  data?: {
    json?: { caption?: string; image_url?: string; date?: string };
    metadata?: { ogImage?: string; ogDescription?: string; title?: string; description?: string };
    markdown?: string;
  };
  json?: { caption?: string; image_url?: string; date?: string };
  metadata?: { ogImage?: string; ogDescription?: string; title?: string; description?: string };
  markdown?: string;
};

async function scrapeOne(url: string): Promise<{ caption: string | null; image: string | null }> {
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key) throw new Error("FIRECRAWL_API_KEY not configured");
  const schema = {
    type: "object",
    properties: {
      caption: { type: "string", description: "Full post caption text" },
      image_url: { type: "string", description: "Direct URL of the main post image" },
    },
  };
  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      onlyMainContent: false,
      formats: [
        { type: "json", schema, prompt: "Extract the Instagram post caption and the main image URL." },
      ],
    }),
  });
  if (!res.ok) {
    console.error(`Firecrawl scrape failed for ${url}: ${res.status} ${await res.text()}`);
    return { caption: null, image: null };
  }
  const json = (await res.json()) as FcResp;
  const extracted = json.data?.json ?? json.json;
  const meta = json.data?.metadata ?? json.metadata;
  const caption = extracted?.caption ?? meta?.ogDescription ?? meta?.description ?? null;
  const image = extracted?.image_url ?? meta?.ogImage ?? null;
  return { caption: caption?.trim() || null, image: image || null };
}

function inferCategory(text: string | null): string {
  const t = (text ?? "").toLowerCase();
  if (/(usine|atelier|industri|entrep[oô]t|hangar)/.test(t)) return "Industriel";
  if (/(r[eé]novation|mise aux normes|r[eé]fection)/.test(t)) return "Rénovation";
  if (/(bureau|commerc|magasin|boutique|restaurant|h[oô]tel|cabinet)/.test(t)) return "Commercial";
  return "Résidentiel";
}

function makeTitle(caption: string | null, fallback: string): string {
  if (!caption) return fallback;
  const firstLine = caption.split(/\n|\.|!|\?/)[0].trim();
  return firstLine.length > 4 ? firstLine.slice(0, 120) : fallback;
}

export const scrapeInstagramPosts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: adminRow } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!adminRow) throw new Error("Forbidden");

    const { data: existing } = await supabaseAdmin
      .from("projects")
      .select("instagram_url")
      .not("instagram_url", "is", null);
    const existingSet = new Set((existing ?? []).map((r) => r.instagram_url));

    const toScrape = POSTS.filter((u) => !existingSet.has(u));
    const results: Array<{ url: string; status: "added" | "no_image" | "error" }> = [];

    for (const url of toScrape) {
      try {
        const { caption, image } = await scrapeOne(url);
        if (!image) {
          const { error } = await supabaseAdmin.from("projects").insert({
            title: makeTitle(caption, "Publication Instagram"),
            description: caption,
            category: inferCategory(caption),
            image_url: "",
            instagram_url: url,
            source_type: "instagram",
          });
          results.push({ url, status: error ? "error" : "no_image" });
          continue;
        }
        const { error } = await supabaseAdmin.from("projects").insert({
          title: makeTitle(caption, "Projet"),
          description: caption,
          category: inferCategory(caption),
          image_url: image,
          instagram_url: url,
          source_type: "instagram",
        });
        results.push({ url, status: error ? "error" : "added" });
      } catch (e) {
        console.error("scrape one failed", url, e);
        results.push({ url, status: "error" });
      }
    }

    return { processed: toScrape.length, results };
  });

