import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ImageIcon } from "lucide-react";

export const Route = createFileRoute("/nos-projets")({
  component: NosProjetsPage,
  head: () => ({
    meta: [
      { title: "Nos projets — bourquin les électriciens" },
      {
        name: "description",
        content:
          "Découvrez une sélection de projets réalisés par bourquin les électriciens à Genève : installations électriques, éclairage, sécurité et télécommunications.",
      },
      { property: "og:title", content: "Nos projets — bourquin les électriciens" },
      {
        property: "og:description",
        content: "Sélection de projets réalisés à Genève par bourquin les électriciens.",
      },
    ],
  }),
});

const projects = [
  {
    title: "Rénovation immeuble résidentiel",
    description:
      "Mise aux normes complète de l'installation électrique d'un immeuble de 24 appartements en centre-ville.",
  },
  {
    title: "Éclairage architectural",
    description:
      "Conception et installation d'un éclairage LED scénographique pour un espace commercial haut de gamme.",
  },
  {
    title: "Système de sécurité bureau",
    description:
      "Contrôle d'accès, vidéosurveillance et interphonie pour un immeuble de bureaux à Plan-les-Ouates.",
  },
  {
    title: "Villa connectée",
    description:
      "Domotique complète : éclairage automatisé, stores, audio multipièces et gestion énergétique.",
  },
  {
    title: "Réseau télécom entreprise",
    description:
      "Câblage structuré et déploiement réseau pour les nouveaux locaux d'une PME genevoise.",
  },
  {
    title: "Borne de recharge véhicule",
    description:
      "Installation de bornes de recharge pour véhicules électriques en parking collectif.",
  },
];

function NosProjetsPage() {
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
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <article key={p.title} className="card-soft overflow-hidden p-0 flex flex-col">
                <div className="aspect-[4/3] bg-[color:var(--surface-muted)] flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-[color:var(--muted-foreground)]" />
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-lg">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed flex-1">{p.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
