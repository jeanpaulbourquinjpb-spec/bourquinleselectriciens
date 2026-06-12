import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProjectGalleryCard } from "@/components/ProjectGalleryCard";
import { cn } from "@/lib/utils";
import { listProjects, CATEGORIES } from "@/lib/projects.functions";

const projectsQueryOptions = queryOptions({
  queryKey: ["projects"],
  queryFn: () => listProjects(),
});

export const Route = createFileRoute("/projets")({
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQueryOptions),
  component: ProjetsPage,
  errorComponent: ({ error }) => (
    <div className="container-x py-24 text-center text-[color:var(--muted-foreground)]">
      <p>Impossible de charger les projets pour le moment.</p>
      <p className="mt-2 text-xs">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-x py-24 text-center">Page introuvable.</div>
  ),
  head: () => ({
    meta: [
      { title: "Nos projets — bourquin les électriciens" },
      {
        name: "description",
        content:
          "Une sélection de réalisations qui illustrent notre savoir-faire en électricité, éclairage, sécurité et télécommunications.",
      },
      { property: "og:title", content: "Nos projets — bourquin les électriciens" },
      {
        property: "og:description",
        content: "Sélection de projets réalisés à Genève par bourquin les électriciens.",
      },
    ],
  }),
});

type Filter = (typeof CATEGORIES)[number] | "all";
const PAGE_SIZE = 12;

function ProjetsPage() {
  const { data } = useSuspenseQuery(projectsQueryOptions);
  const projects = data.projects;

  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );

  const availableCategories = useMemo(
    () => CATEGORIES.filter((c) => projects.some((p) => p.category === c)),
    [projects],
  );

  const filters: { label: string; value: Filter }[] = [
    { label: "Tous les projets", value: "all" },
    ...availableCategories.map((c) => ({ label: c, value: c })),
  ];

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <SiteHeader />
      <section className="py-24">
        <div className="container-x">
          <Link
            to="/"
            className="inline-block text-sm text-[color:var(--muted-foreground)] hover:text-[#ff6633] transition-colors"
          >
            ← Retour à l'accueil
          </Link>

          <p className="eyebrow mt-6">Réalisations</p>
          <h1 className="mt-2 text-3xl md:text-5xl">Nos projets</h1>
          <p className="mt-4 max-w-2xl text-[color:var(--muted-foreground)]">
            Une sélection de réalisations qui illustrent notre savoir-faire en électricité,
            éclairage, sécurité et télécommunications.
          </p>

          <div className="mt-10 flex gap-2 overflow-x-auto md:flex-wrap -mx-4 px-4 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((f) => {
              const active = filter === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => {
                    setFilter(f.value);
                    setPage(1);
                  }}
                  className={cn(
                    "shrink-0 whitespace-nowrap px-4 py-2 rounded-full border text-sm transition-colors",
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-[color:var(--border)] hover:bg-[color:var(--surface-muted)]",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {pageItems.length === 0 ? (
            <div className="mt-16 text-center text-[color:var(--muted-foreground)]">
              <p>Aucun projet à afficher pour le moment.</p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((p) => (
                <ProjectGalleryCard key={p.id} p={p} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md border border-[color:var(--border)] text-sm hover:bg-[color:var(--surface-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Précédent
              </button>
              <span className="text-sm text-[color:var(--muted-foreground)]">
                Page {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md border border-[color:var(--border)] text-sm hover:bg-[color:var(--surface-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Suivant →
              </button>
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
