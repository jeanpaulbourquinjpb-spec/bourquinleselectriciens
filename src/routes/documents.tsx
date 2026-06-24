import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { listDocuments, type DocumentDTO } from "@/lib/documents.functions";
import { FileText, ExternalLink } from "lucide-react";

const documentsQueryOptions = queryOptions({
  queryKey: ["documents"],
  queryFn: () => listDocuments(),
});

export const Route = createFileRoute("/documents")({
  loader: ({ context }) => context.queryClient.ensureQueryData(documentsQueryOptions),
  component: DocumentsPage,
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="container-x py-24 text-center text-[color:var(--muted-foreground)]">
        <p>Impossible de charger les documents pour le moment.</p>
        <p className="mt-2 text-xs">{error.message}</p>
      </div>
      <SiteFooter />
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="container-x py-24 text-center">Page introuvable.</div>
      <SiteFooter />
    </div>
  ),
  head: () => ({
    meta: [
      { title: "Documents & conditions générales — bourquin les électriciens" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content:
          "Retrouvez l'ensemble des documents contractuels et tarifaires de bourquin les électriciens : conditions générales de vente, prix d'intervention et annexes.",
      },
      { property: "og:title", content: "Documents & conditions générales — bourquin les électriciens" },
      {
        property: "og:description",
        content: "Documents contractuels et tarifaires de bourquin les électriciens.",
      },
    ],
  }),
});

function DocumentsPage() {
  const { data } = useSuspenseQuery(documentsQueryOptions);
  const documents = data.documents;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        <section className="container-x py-20 md:py-28">
          <p className="eyebrow">Informations</p>
          <h1 className="mt-3 text-3xl md:text-5xl">Documents &amp; conditions générales</h1>
          <p className="mt-4 max-w-2xl text-[color:var(--muted-foreground)] text-base md:text-lg">
            Retrouvez ici l'ensemble de nos documents contractuels et tarifaires.
          </p>

          {documents.length === 0 ? (
            <div className="mt-16 text-center text-[color:var(--muted-foreground)]">
              <p>Aucun document disponible pour le moment.</p>
            </div>
          ) : (
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function DocumentCard({ doc }: { doc: DocumentDTO }) {
  return (
    <article className="card-soft flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <FileText className="w-6 h-6 text-brand shrink-0 mt-0.5" />
        <h3 className="text-lg font-semibold leading-snug" style={{ color: "#54544b" }}>
          {doc.title}
        </h3>
      </div>
      <div className="mt-auto pt-2">
        <a
          href={doc.file_url}
          target="_blank"
          rel="noreferrer"
          className="btn-outline w-full justify-center"
        >
          <ExternalLink className="w-4 h-4" />
          Consulter
        </a>
      </div>
    </article>
  );
}
