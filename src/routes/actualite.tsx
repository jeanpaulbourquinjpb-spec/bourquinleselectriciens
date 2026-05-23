import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArrowRight } from "lucide-react";
import { getArticles, type ArticleDTO } from "@/lib/articles.functions";

const articlesQueryOptions = queryOptions({
  queryKey: ["articles"],
  queryFn: () => getArticles(),
});

export const Route = createFileRoute("/actualite")({
  loader: ({ context }) => context.queryClient.ensureQueryData(articlesQueryOptions),
  component: ActualitePage,
  head: () => ({
    meta: [
      { title: "Notre actualité — bourquin les électriciens" },
      {
        name: "description",
        content:
          "Actualités et conseils de bourquin les électriciens : aspirateur central, énergie solaire, sécurité électrique et plus.",
      },
      { property: "og:title", content: "Notre actualité — bourquin les électriciens" },
      {
        property: "og:description",
        content: "Actualités et conseils de bourquin les électriciens.",
      },
    ],
  }),
});

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("fr-CH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

function ArticleCard({ a }: { a: ArticleDTO }) {
  const date = formatDate(a.published_at);
  return (
    <article className="card-soft flex flex-col">
      {(a.category || date) && (
        <p className="eyebrow mb-2">
          {a.category}
          {a.category && date ? " · " : ""}
          {date}
        </p>
      )}
      <h3 className="text-lg">{a.title}</h3>
      {a.excerpt && <p className="mt-3 text-sm flex-1">{a.excerpt}</p>}
      <a
        href={a.url}
        target="_blank"
        rel="noreferrer"
        className="link-brand mt-5 inline-flex items-center gap-1 text-sm font-semibold"
      >
        Vers l'article <ArrowRight className="w-4 h-4" />
      </a>
    </article>
  );
}

function ActualitePage() {
  const { data } = useSuspenseQuery(articlesQueryOptions);
  const articles = data.articles;
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a.id !== featured?.id);

  return (
    <div>
      <SiteHeader />
      <section className="py-24">
        <div className="container-x">
          <p className="eyebrow">Notre actualité</p>
          <h1 className="mt-2 text-3xl md:text-4xl">À la une</h1>

          {!featured && (
            <p className="mt-12 text-sm text-muted-foreground">
              Aucun article pour le moment. La prochaine mise à jour automatique aura lieu bientôt.
            </p>
          )}

          {featured && (
            <article className="card-soft mt-12 flex flex-col gap-3 md:p-10">
              {(featured.category || formatDate(featured.published_at)) && (
                <p className="eyebrow">
                  {featured.category}
                  {featured.category && formatDate(featured.published_at) ? " · " : ""}
                  {formatDate(featured.published_at)}
                </p>
              )}
              <h2 className="text-2xl md:text-3xl">{featured.title}</h2>
              {featured.excerpt && <p className="text-base">{featured.excerpt}</p>}
              <a
                href={featured.url}
                target="_blank"
                rel="noreferrer"
                className="link-brand mt-2 inline-flex items-center gap-1 text-sm font-semibold"
              >
                Lire l'article <ArrowRight className="w-4 h-4" />
              </a>
            </article>
          )}

          {rest.length > 0 && (
            <>
              <h2 className="mt-16 text-2xl">Tous les articles</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((a) => (
                  <ArticleCard key={a.id} a={a} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
