import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ActualiteSection } from "@/components/ActualiteSection";
import { getArticles } from "@/lib/articles.functions";

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

function ActualitePage() {
  const { data } = useSuspenseQuery(articlesQueryOptions);

  return (
    <div>
      <SiteHeader />
      <section className="py-24">
        <div className="container-x">
          <p className="eyebrow">Notre actualité</p>
          <h1 className="mt-2 text-3xl md:text-4xl">À la une</h1>
          <ActualiteSection articles={data.articles} />
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
