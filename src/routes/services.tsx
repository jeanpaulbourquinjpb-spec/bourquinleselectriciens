import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Lightbulb, Shield, Tv, Wrench, Zap, Network, ClipboardCheck, HeadphonesIcon } from "lucide-react";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Services — Électricité, télécom, sécurité & audiovisuel à Genève" },
      {
        name: "description",
        content:
          "Étude, rénovation, éclairage, télécommunications, sécurité, audiovisuel, maintenance et dépannage. Solutions complètes pour particuliers et professionnels à Genève.",
      },
    ],
  }),
});

const services = [
  {
    icon: ClipboardCheck,
    title: "Étude, conseil & contrôle",
    text: "Analyse, conception et contrôle de vos installations électriques par notre équipe d'experts certifiés.",
  },
  {
    icon: Wrench,
    title: "Rénovation",
    text: "Modernisation de vos installations existantes, mise aux normes et rénovation complète d'appartements et bâtiments.",
  },
  {
    icon: Lightbulb,
    title: "Éclairage",
    text: "Confort lumineux : technique électrique qui économise du temps, accroît le confort et permet une ambiance lumineuse parfaite sur pression d'un bouton.",
  },
  {
    icon: Network,
    title: "Télécommunications",
    text: "Câblage cuivre et fibre, réseaux informatiques, téléphonie. Partenaire Swisscom Business Platin.",
  },
  {
    icon: Shield,
    title: "Sécurité",
    text: "Installations haute technologie : contrôle d'accès, vidéosurveillance, interphonie, biométrie.",
  },
  {
    icon: Tv,
    title: "Audiovisuel",
    text: "Des experts pour toutes vos installations audiovisuelles : télévision, son et vidéo à la hauteur de vos exigences.",
  },
  {
    icon: Zap,
    title: "Efficience énergétique",
    text: "Solutions durables alliant sécurité, confort et efficience énergétique — partenaire éco21 engagé.",
  },
  {
    icon: HeadphonesIcon,
    title: "Maintenance & dépannage",
    text: "Intervention rapide et entretien régulier de tous types d'installations électriques.",
  },
];

function ServicesPage() {
  return (
    <div>
      <SiteHeader />
      <section className="container-x py-20">
        <p className="eyebrow">Nos services</p>
        <h1 className="mt-3 text-4xl md:text-5xl max-w-3xl">
          Sécurité, confort et efficience énergétique.
        </h1>
        <p className="mt-6 max-w-2xl text-lg">
          Grâce à notre équipe d'électriciens, de télématiciens, de contrôleurs, de conseillers en sécurité
          et de formateurs, nous prenons en charge tous les aspects de vos installations électriques.
        </p>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article key={s.title} className="card-soft">
              <s.icon className="w-7 h-7 text-brand" />
              <h2 className="mt-5 text-xl">{s.title}</h2>
              <p className="mt-2 text-sm">{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-20 bg-[color:var(--surface-muted)]">
        <div className="container-x text-center">
          <h2 className="text-3xl md:text-4xl">Entre nous le courant passe</h2>
          <p className="mt-4 max-w-xl mx-auto">
            Une clientèle institutionnelle, commerciale et privée nous fait confiance depuis trois générations.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/contact" className="btn-brand">Demander un devis</Link>
            <Link to="/presentation" className="btn-outline">En savoir plus</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
