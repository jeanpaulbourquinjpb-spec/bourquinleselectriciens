import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ActualiteGrid } from "@/components/ActualiteSection";
import { getArticles } from "@/lib/articles.functions";

const articlesQueryOptions = queryOptions({
  queryKey: ["articles"],
  queryFn: () => getArticles(),
});

export const Route = createFileRoute("/actualites")({
  component: ActualitesPage,
  loader: ({ context }) => context.queryClient.prefetchQuery(articlesQueryOptions),
  head: () => ({
    meta: [
      { title: "Actualités — bourquin les électriciens" },
      {
        name: "description",
        content:
          "Toutes les actualités de la branche électrique : éclairage, sécurité, domotique, énergies, installation et formation.",
      },
      { property: "og:title", content: "Actualités — bourquin les électriciens" },
      {
        property: "og:description",
        content:
          "Toutes les actualités de la branche électrique : éclairage, sécurité, domotique, énergies, installation et formation.",
      },
    ],
  }),
});

function ActualitesPage() {
  const { data, isLoading } = useQuery(articlesQueryOptions);
  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--background)]">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-[color:var(--surface-muted)]">
          <div className="container-x py-20 md:py-24">
            <p className="eyebrow">Notre actualité</p>
            <h1 className="mt-2 text-3xl md:text-5xl">Actualités</h1>
            <p className="mt-4 max-w-2xl text-[color:var(--muted-foreground)]">
              Retrouvez toutes les actualités de la branche électrique : éclairage,
              sécurité, domotique, énergies, installation et formation.
            </p>
            <ActualiteGrid articles={data?.articles ?? []} isLoading={isLoading} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
