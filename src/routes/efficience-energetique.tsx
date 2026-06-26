import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Phone,
  BadgeCheck,
  Search,
  Replace,
  Coins,
} from "lucide-react";

export const Route = createFileRoute("/efficience-energetique")({
  component: EfficiencePage,
  head: () => ({
    meta: [
      { title: "Efficience énergétique à Genève — Partenaire éco21" },
      {
        name: "description",
        content:
          "Réduisez votre consommation électrique avec bourquin les électriciens, partenaire certifié éco21 depuis 2019. Audit, LED et prime jusqu'à 50%.",
      },
      { property: "og:title", content: "Efficience énergétique à Genève — Partenaire éco21" },
      {
        property: "og:description",
        content:
          "Partenaire certifié éco21. Audit éclairage, remplacement LED et prime jusqu'à 50% du montant investi.",
      },
    ],
    links: [{ rel: "canonical", href: "https://bourquinelectricite.ch/efficience-energetique" }],
  }),
});

const eco21Cards = [
  {
    icon: Search,
    title: "Audit de votre éclairage",
    text: "Nos électriciens analysent votre installation existante et identifient les économies réalisables. L'audit est pris en charge dans le cadre du programme éco21.",
  },
  {
    icon: Replace,
    title: "Remplacement LED",
    text: "Remplacement de vos sources lumineuses par des solutions LED efficientes. Jusqu'à 80% d'économies sur votre facture d'éclairage et une rentabilité moyenne en moins de 3 ans.",
  },
  {
    icon: Coins,
    title: "Prime éco21",
    text: "Une prime de 21 centimes par kWh économisé vous est versée directement par les SIG à la réception des travaux. Nos électriciens qualifiés s'occupent de toutes les démarches.",
  },
];

const avantages = [
  "Partenaire certifié éco21 depuis 2019",
  "Prime jusqu'à 50% du montant investi",
  "Jusqu'à 80% d'économies sur votre éclairage",
  "Investissements 100% déductibles fiscalement",
];

function EfficiencePage() {
  return (
    <div>
      <SiteHeader />

      {/* HERO */}
      <section className="container-x py-20">
        <p className="eyebrow">Efficience énergétique</p>
        <h1 className="mt-3 text-4xl md:text-5xl max-w-3xl">
          Efficience énergétique à Genève
        </h1>
        <p className="mt-4 text-xl text-brand font-medium">
          Réduisez votre consommation électrique avec les bons experts
        </p>
        <p className="mt-6 max-w-2xl text-lg">
          Consommer moins sans sacrifier le confort, c'est possible. Partenaire certifié éco21 depuis 2019, bourquin les électriciens vous accompagne dans l'optimisation de vos installations électriques et la réduction durable de votre facture d'électricité.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="tel:0228498333" className="btn-brand">
            <Phone className="w-4 h-4" /> 022 849 83 33
          </a>
          <Link to="/contact" className="btn-outline">Envoyer une demande</Link>
        </div>
      </section>

      {/* PARTENARIAT ÉCO21 */}
      <section className="py-20 bg-[color:var(--surface-muted)]">
        <div className="container-x">
          <h2 className="text-3xl md:text-4xl max-w-3xl">Notre partenariat éco21</h2>
          <p className="mt-6 max-w-2xl text-lg">
            Le programme éco21 des SIG permet aux entreprises et aux propriétaires genevois de bénéficier d'une prime allant jusqu'à 50% du montant investi pour le remplacement de leur éclairage par des solutions LED performantes. Nous prenons en charge l'ensemble du processus, de l'audit jusqu'à la réception des travaux.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {eco21Cards.map((c) => (
              <article key={c.title} className="card-soft">
                <c.icon className="w-7 h-7 text-brand" />
                <h3 className="mt-5 text-xl">{c.title}</h3>
                <p className="mt-2 text-sm">{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AVANTAGES CONCRETS */}
      <section className="container-x py-20">
        <h2 className="text-3xl md:text-4xl max-w-3xl">Les avantages concrets</h2>
        <p className="mt-6 max-w-2xl text-lg">
          Faire appel à un partenaire agréé SIG comme bourquin les électriciens, c'est la garantie d'un travail réalisé dans les règles de l'art, avec des produits de qualité au meilleur prix. Les investissements sont 100% déductibles de votre revenu imposable et la rentabilité est en moyenne inférieure à 3 ans.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {avantages.map((a) => (
            <div key={a} className="card-soft text-center">
              <BadgeCheck className="w-8 h-8 text-brand mx-auto" />
              <p className="mt-4 font-medium text-sm">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-brand text-white">
        <div className="container-x py-20 text-center">
          <h2 className="text-3xl md:text-4xl text-white">Vous voulez réduire votre consommation électrique ?</h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-white/90">
            Nos électriciens analysent votre installation et vous accompagnent dans toutes les démarches éco21.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a
              href="tel:0228498333"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-brand font-semibold hover:bg-white/90 transition"
            >
              <Phone className="w-4 h-4" /> 022 849 83 33
            </a>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white text-white font-semibold hover:bg-white/10 transition"
            >
              Envoyer une demande
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
