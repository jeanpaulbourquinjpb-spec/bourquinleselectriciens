import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Phone,
  Home,
  Sun,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

export const Route = createFileRoute("/eclairage")({
  component: EclairagePage,
  head: () => ({
    meta: [
      { title: "Éclairage électrique à Genève — Du concept à l'installation" },
      {
        name: "description",
        content:
          "Conception et installation d'éclairage sur mesure à Genève. Éclairagiste certifié pour résidentiel, tertiaire, extérieur et éclairage technique.",
      },
      { property: "og:title", content: "Éclairage électrique à Genève — Du concept à l'installation" },
      {
        property: "og:description",
        content:
          "Conception et installation d'éclairage sur mesure à Genève par bourquin les électriciens, avec éclairagiste certifié.",
      },
    ],
    links: [{ rel: "canonical", href: "https://bourquinelectricite.ch/eclairage" }],
  }),
});

const domaines = [
  { icon: Home, title: "Résidentiel et tertiaire", text: "Éclairage d'appartements, villas, immeubles de bureaux et commerces. Concept lumineux sur mesure, choix des produits et installation complète." },
  { icon: Sun, title: "Espaces extérieurs et communs", text: "Illumination de parcs, jardins et parties communes d'immeubles. Solutions économiques pour réduire durablement votre consommation." },
  { icon: ShieldCheck, title: "Éclairage technique et de sécurité", text: "Technologie LED, éclairage de secours et installations conformes aux normes en vigueur. Mise aux normes et remplacement de vos installations existantes." },
];

const avantages = [
  "Éclairagiste certifié",
  "Du concept lumineux à l'installation finale",
  "Des luminaires et un éclairage adaptés à chaque espace et chaque usage",
  "Un seul interlocuteur de A à Z",
];

function EclairagePage() {
  return (
    <div>
      <SiteHeader />

      {/* HERO */}
      <section className="container-x py-20">
        <p className="eyebrow">Éclairage</p>
        <h1 className="mt-3 text-4xl md:text-5xl max-w-3xl">
          Éclairage électrique à Genève
        </h1>
        <p className="mt-4 text-xl text-brand font-medium">
          Du concept à l'installation, nous prenons tout en charge
        </p>
        <p className="mt-6 max-w-2xl text-lg">
          L'éclairage, c'est bien plus que brancher des luminaires. Un bon concept lumineux transforme un espace, améliore le confort et réduit la consommation énergétique. Chez bourquin les électriciens, nous disposons d'un éclairagiste certifié qui élabore vos concepts de A à Z, du choix des sources lumineuses jusqu'aux finitions. Une prestation complète que peu d'électriciens proposent encore.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="tel:0228498333" className="btn-brand">
            <Phone className="w-4 h-4" /> Appeler le 022 849 83 33
          </a>
          <a href="/contact" className="btn-outline">Envoyer une demande</a>
        </div>
      </section>

      {/* NOS DOMAINES D'INTERVENTION */}
      <section className="py-20 bg-[color:var(--surface-muted)]">
        <div className="container-x">
          <h2 className="text-3xl md:text-4xl max-w-3xl">Nos domaines d'intervention</h2>
          <p className="mt-6 max-w-2xl text-lg">
            Que ce soit pour une villa, un immeuble de bureaux, un commerce ou un espace extérieur, notre éclairagiste certifié analyse vos besoins et conçoit une solution adaptée à votre espace, à votre usage et à votre budget. Nos électriciens qualifiés se chargent ensuite de l'installation et des finitions.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {domaines.map((d) => (
              <article key={d.title} className="card-soft">
                <d.icon className="w-7 h-7 text-brand" />
                <h3 className="mt-5 text-xl">{d.title}</h3>
                <p className="mt-2 text-sm">{d.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NOTRE DIFFÉRENCE */}
      <section className="container-x py-20">
        <h2 className="text-3xl md:text-4xl max-w-3xl">Notre différence</h2>
        <p className="mt-6 max-w-2xl text-lg">
          Un concept d'éclairage réussi repose autant sur la maîtrise technique que sur la sensibilité aux espaces et aux usages. Chez bourquin les électriciens, notre éclairagiste certifié conçoit le concept lumineux adapté à votre projet, et nos électriciens qualifiés se chargent de l'installation et des finitions. Un seul interlocuteur, de la première esquisse jusqu'à la mise en lumière finale.
        </p>
        <p className="mt-4 max-w-2xl text-lg">
          Que ce soit pour votre jardin, une exposition d'art, un musée, un monument historique, un restaurant ou un hôtel, nous avons une solution pour chaque type d'ambiance et chaque contrainte technique. Nous serons ravis de réaliser une étude éclairagisme avec vous.
        </p>
      </section>

      {/* CE QUI FAIT LA DIFFÉRENCE */}
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
          <h2 className="text-3xl md:text-4xl text-white">Vous avez un projet d'éclairage ?</h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-white/90">
            Notre éclairagiste certifié analyse votre espace et vous propose un concept adapté à vos besoins et à votre budget.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a
              href="tel:0228498333"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-brand font-semibold hover:bg-white/90 transition"
            >
              <Phone className="w-4 h-4" /> 022 849 83 33
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white text-white font-semibold hover:bg-white/10 transition"
            >
              Formulaire de contact
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
