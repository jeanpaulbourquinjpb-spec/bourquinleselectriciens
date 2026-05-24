import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/nos-projets")({
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQueryOptions),
  component: NosProjetsPage,
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
          "Découvrez une sélection de projets réalisés par bourquin les électriciens à Genève : éclairage, sécurité, rénovation, grands projets, résidentiel et commercial.",
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

function NosProjetsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const { data } = useSuspenseQuery(projectsQueryOptions);
  const projects = data.projects;

  const filtered = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );

  const filters: { label: string; value: Filter }[] = [
    { label: "Tous les projets", value: "all" },
    ...CATEGORIES.map((c) => ({ label: c, value: c })),
  ];

  return (
    <div>
      <SiteHeader />
      <section className="py-24">
        <div className="container-x">
          <p className="eyebrow">Réalisations</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Nos projets</h1>
          <p className="mt-4 max-w-2xl text-[color:var(--muted-foreground)]">
            Une sélection de réalisations qui illustrent notre savoir-faire en électricité,
            éclairage, sécurité et télécommunications.
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {filters.map((f) => {
              const active = filter === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "px-4 py-2 rounded-full border text-sm transition-colors",
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

          {filtered.length === 0 ? (
            <div className="mt-16 text-center text-[color:var(--muted-foreground)]">
              <p>Aucun projet à afficher pour le moment.</p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProjectGalleryCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
