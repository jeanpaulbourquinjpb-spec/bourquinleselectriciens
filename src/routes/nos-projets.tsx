import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { listProjects, CATEGORIES, type ProjectDTO } from "@/lib/projects.functions";

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
                <ProjectCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function ProjectCard({ p }: { p: ProjectDTO }) {
  return (
    <Link
      to="/nos-projets/$projectId"
      params={{ projectId: p.id }}
      className="card-soft overflow-hidden p-0 flex flex-col group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative aspect-[4/3] bg-[color:var(--surface-muted)] flex items-center justify-center overflow-hidden">
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={p.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ImageIcon className="w-10 h-10 text-[color:var(--muted-foreground)]" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
          {p.category && (
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/80">{p.category}</p>
          )}
          <p className="mt-1 text-white text-base font-medium leading-snug line-clamp-2">
            {p.title}
          </p>
        </div>
      </div>
    </Link>
  );
}
