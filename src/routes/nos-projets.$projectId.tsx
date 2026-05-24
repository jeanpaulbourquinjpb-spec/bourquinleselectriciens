import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArrowLeft, ImageIcon, Instagram } from "lucide-react";
import { listProjects } from "@/lib/projects.functions";

const projectsQueryOptions = queryOptions({
  queryKey: ["projects"],
  queryFn: () => listProjects(),
});

export const Route = createFileRoute("/nos-projets/$projectId")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(projectsQueryOptions);
    const project = data.projects.find((p) => p.id === params.projectId);
    if (!project) throw notFound();
    return { project };
  },
  component: ProjectDetailPage,
  errorComponent: ({ error }) => (
    <div className="container-x py-24 text-center text-[color:var(--muted-foreground)]">
      <p>Impossible de charger ce projet.</p>
      <p className="mt-2 text-xs">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div>
      <SiteHeader />
      <div className="container-x py-24 text-center">
        <h1 className="text-2xl">Projet introuvable</h1>
        <Link to="/nos-projets" className="mt-6 inline-block underline">
          Retour aux projets
        </Link>
      </div>
      <SiteFooter />
    </div>
  ),
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    const title = p ? `${p.title} — bourquin les électriciens` : "Projet";
    return {
      meta: [
        { title },
        {
          name: "description",
          content:
            p?.description?.slice(0, 160) ??
            "Découvrez un projet réalisé par bourquin les électriciens à Genève.",
        },
        { property: "og:title", content: title },
        ...(p?.image_url ? [{ property: "og:image", content: p.image_url }] : []),
      ],
    };
  },
});

function ProjectDetailPage() {
  const { project: p } = useSuspenseQuery({
    ...projectsQueryOptions,
    select: (d) => ({ project: d.projects.find((x) => x.id === Route.useParams().projectId)! }),
  }).data;

  return (
    <div>
      <SiteHeader />
      <section className="py-16 md:py-24">
        <div className="container-x">
          <Link
            to="/nos-projets"
            className="inline-flex items-center gap-2 text-sm text-[color:var(--muted-foreground)] hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux projets
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div className="aspect-[4/3] bg-[color:var(--surface-muted)] flex items-center justify-center overflow-hidden rounded-md">
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-10 h-10 text-[color:var(--muted-foreground)]" />
              )}
            </div>

            <div className="flex flex-col">
              {p.category && <p className="eyebrow">{p.category}</p>}
              <h1 className="mt-2 text-3xl md:text-4xl">{p.title}</h1>
              {p.description && (
                <p className="mt-6 leading-relaxed whitespace-pre-line text-[color:var(--body)]">
                  {p.description}
                </p>
              )}
              {p.instagram_url && (
                <a
                  href={p.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 text-sm text-brand hover:underline w-fit"
                >
                  <Instagram className="w-4 h-4" />
                  Voir sur Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
