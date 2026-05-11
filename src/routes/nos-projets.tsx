import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/nos-projets")({
  component: NosProjetsPage,
  head: () => ({
    meta: [
      { title: "Nos projets — bourquin les électriciens" },
      {
        name: "description",
        content:
          "Découvrez une sélection de projets réalisés par bourquin les électriciens à Genève : résidentiel, commercial, industriel et rénovation.",
      },
      { property: "og:title", content: "Nos projets — bourquin les électriciens" },
      {
        property: "og:description",
        content: "Sélection de projets réalisés à Genève par bourquin les électriciens.",
      },
    ],
  }),
});

type Category = "Résidentiel" | "Commercial" | "Industriel" | "Rénovation";

const categories: Category[] = ["Résidentiel", "Commercial", "Industriel", "Rénovation"];

const projects: { title: string; description: string; category: Category }[] = [
  {
    title: "Villa connectée",
    description:
      "Domotique complète : éclairage automatisé, stores, audio multipièces et gestion énergétique.",
    category: "Résidentiel",
  },
  {
    title: "Appartement haut standing",
    description:
      "Installation électrique complète et éclairage sur mesure pour un appartement à Champel.",
    category: "Résidentiel",
  },
  {
    title: "Maison familiale",
    description:
      "Câblage, tableau électrique et bornes de recharge pour véhicules électriques.",
    category: "Résidentiel",
  },
  {
    title: "Éclairage architectural",
    description:
      "Conception et installation d'un éclairage LED scénographique pour un espace commercial haut de gamme.",
    category: "Commercial",
  },
  {
    title: "Système de sécurité bureau",
    description:
      "Contrôle d'accès, vidéosurveillance et interphonie pour un immeuble de bureaux à Plan-les-Ouates.",
    category: "Commercial",
  },
  {
    title: "Réseau télécom entreprise",
    description:
      "Câblage structuré et déploiement réseau pour les nouveaux locaux d'une PME genevoise.",
    category: "Commercial",
  },
  {
    title: "Atelier de production",
    description:
      "Installation électrique force et lumière pour un atelier industriel aux Acacias.",
    category: "Industriel",
  },
  {
    title: "Entrepôt logistique",
    description:
      "Mise en place d'un éclairage LED haute performance et d'un système de détection.",
    category: "Industriel",
  },
  {
    title: "Rénovation immeuble résidentiel",
    description:
      "Mise aux normes complète de l'installation électrique d'un immeuble de 24 appartements en centre-ville.",
    category: "Rénovation",
  },
  {
    title: "Rénovation bâtiment historique",
    description:
      "Remise à neuf des installations en respectant les contraintes patrimoniales du bâtiment.",
    category: "Rénovation",
  },
  {
    title: "Modernisation tableau électrique",
    description:
      "Remplacement et mise en conformité des tableaux électriques d'une copropriété.",
    category: "Rénovation",
  },
];

function NosProjetsPage() {
  const [filter, setFilter] = useState<Category | "all">("all");

  const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  const filters: { label: string; value: Category | "all" }[] = [
    { label: "Tous les projets", value: "all" },
    ...categories.map((c) => ({ label: c, value: c })),
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

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <article key={p.title} className="card-soft overflow-hidden p-0 flex flex-col">
                <div className="aspect-[4/3] bg-[color:var(--surface-muted)] flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-[color:var(--muted-foreground)]" />
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <p className="eyebrow">{p.category}</p>
                  <h3 className="mt-2 text-lg">{p.title}</h3>
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
