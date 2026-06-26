import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Phone,
  Home,
  Building2,
  Car,
  Zap,
  BadgeCheck,
} from "lucide-react";

export const Route = createFileRoute("/e-mobility")({
  component: EMobilityPage,
  head: () => ({
    meta: [
      { title: "Bornes de recharge électrique à Genève — E-Mobility" },
      {
        name: "description",
        content:
          "Installation de bornes de recharge pour véhicules électriques à Genève. Solutions adaptées aux maisons, entreprises et parkings collectifs. Devis gratuit.",
      },
      { property: "og:title", content: "Bornes de recharge électrique à Genève — E-Mobility" },
      {
        property: "og:description",
        content:
          "Installation de bornes de recharge pour véhicules électriques à Genève. Résidentiel, commercial et collectif.",
      },
    ],
    links: [{ rel: "canonical", href: "https://bourquinelectricite.ch/e-mobility" }],
  }),
});

const usages = [
  {
    icon: Home,
    title: "Résidentiel",
    text: "Installation de bornes de recharge chez vous, en garage ou à l'extérieur. Nous dimensionnons l'installation selon votre compteur, votre voiture et vos habitudes de charge.",
  },
  {
    icon: Building2,
    title: "Commercial et entreprise",
    text: "Bornes de recharge pour vos collaborateurs, clients et flottes. Solutions adaptées à votre infrastructure électrique et à votre rythme d'utilisation.",
  },
  {
    icon: Car,
    title: "Parking collectif",
    text: "Installation dans des immeubles et parkings partagés. Gestion intelligente de la charge et répartition de la puissance entre plusieurs véhicules.",
  },
];

const avantages = [
  "Entreprise familiale genevoise depuis 1968",
  "Installation certifiée et aux normes",
  "Solutions pour maison, entreprise et parking collectif",
  "Gestion intelligente de la charge et de la consommation",
];

function EMobilityPage() {
  return (
    <div>
      <SiteHeader />

      {/* HERO */}
      <section className="container-x py-20">
        <p className="eyebrow">E-Mobility</p>
        <h1 className="mt-3 text-4xl md:text-5xl max-w-3xl">
          Bornes de recharge à Genève
        </h1>
        <p className="mt-4 text-xl text-brand font-medium">
          Rechargez vite, en toute sécurité et gardez le contrôle
        </p>
        <p className="mt-6 max-w-2xl text-lg">
          Votre voiture électrique mérite mieux qu'une prise de courant. Nous installons des bornes de recharge adaptées à votre usage, que ce soit pour une maison, une entreprise ou un parking collectif.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="tel:0228498333" className="btn-brand">
            <Phone className="w-4 h-4" /> 022 849 83 33
          </a>
          <Link to="/contact" className="btn-outline">Envoyer une demande</Link>
        </div>
      </section>

      {/* USAGES */}
      <section className="py-20 bg-[color:var(--surface-muted)]">
        <div className="container-x">
          <h2 className="text-3xl md:text-4xl max-w-3xl">Pour chaque usage</h2>
          <p className="mt-6 max-w-2xl text-lg">
            Chaque situation électrique est différente. Nous analysons votre installation existante, vos besoins et vos contraintes pour proposer la solution de recharge la plus adaptée.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {usages.map((u) => (
              <article key={u.title} className="card-soft">
                <u.icon className="w-7 h-7 text-brand" />
                <h3 className="mt-5 text-xl">{u.title}</h3>
                <p className="mt-2 text-sm">{u.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="py-20 bg-[color:var(--surface-muted)]">
        <div className="container-x">
          <h2 className="text-3xl md:text-4xl text-center">Ce qui fait la différence</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {avantages.map((a) => (
              <div key={a} className="card-soft text-center">
                <BadgeCheck className="w-8 h-8 text-brand mx-auto" />
                <p className="mt-4 font-medium text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-brand text-white">
        <div className="container-x py-20 text-center">
          <h2 className="text-3xl md:text-4xl text-white">Un projet de recharge ?</h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-white/90">
            Parlons de votre installation : nos équipes vous conseillent et établissent un devis adapté à vos besoins.
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
