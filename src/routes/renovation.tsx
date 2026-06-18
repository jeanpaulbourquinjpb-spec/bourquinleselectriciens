import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Phone,
  Home,
  Building2,
  Factory,
  Search,
  FileText,
  Hammer,
  BadgeCheck,
} from "lucide-react";

export const Route = createFileRoute("/renovation")({
  component: RenovationPage,
  head: () => ({
    meta: [
      { title: "Rénovation électrique à Genève — Transformation et mise aux normes" },
      {
        name: "description",
        content:
          "Rénovation électrique à Genève pour appartements, villas, bureaux, commerces et industries. Diagnostic, mise aux normes NIBT/OIBT et réalisation par nos électriciens qualifiés depuis 1968.",
      },
      { property: "og:title", content: "Rénovation électrique à Genève" },
      {
        property: "og:description",
        content:
          "Transformation et mise aux normes pour tous types de bâtiments par nos électriciens qualifiés.",
      },
    ],
  }),
});

const typesBatiments = [
  {
    icon: Home,
    title: "Résidentiel",
    text: "Appartements, villas et immeubles d'habitation — rénovation complète ou partielle, mise aux normes et modernisation de votre installation électrique.",
  },
  {
    icon: Building2,
    title: "Commercial et institutionnel",
    text: "Bureaux, commerces, hôtels, restaurants, écoles et crèches — travaux électriques adaptés à vos contraintes d'exploitation et aux normes en vigueur.",
  },
  {
    icon: Factory,
    title: "Industriel et technique",
    text: "Garages, industries et espaces extérieurs — électricité industrielle, éclairage de parcs et jardins, mise aux normes de vos locaux techniques.",
  },
];

const etapes = [
  { icon: Search, title: "Analyse", text: "Diagnostic de votre installation et définition précise de vos besoins" },
  { icon: FileText, title: "Proposition", text: "Offre détaillée adaptée à votre projet et à votre bâtiment" },
  { icon: Hammer, title: "Réalisation", text: "Travaux exécutés par nos électriciens qualifiés, dans les délais convenus" },
];

const avantages = [
  "Entreprise familiale genevoise depuis 1968",
  "Électriciens qualifiés et certifiés",
  "Résidentiel, commercial et institutionnel",
  "Conformité aux normes NIBT/OIBT garantie",
];

function RenovationPage() {
  return (
    <div>
      <SiteHeader />

      {/* HERO */}
      <section className="container-x py-20">
        <p className="eyebrow">Rénovation</p>
        <h1 className="mt-3 text-4xl md:text-5xl max-w-3xl">
          Rénovation électrique à Genève
        </h1>
        <p className="mt-4 text-xl text-brand font-medium">
          Transformation et mise aux normes pour tous types de bâtiments
        </p>
        <p className="mt-6 max-w-2xl text-lg">
          Appartement, villa, immeuble de bureaux ou établissement
          commercial — nos électriciens qualifiés interviennent sur tous vos
          projets de transformation et rénovation électrique, du diagnostic
          jusqu'à la mise en service.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="tel:0228498333" className="btn-brand">
            <Phone className="w-4 h-4" /> Appeler le 022 849 83 33
          </a>
          <a href="https://www.bourquinelectricite.ch/#contact" className="btn-outline">
            Envoyer une demande
          </a>
        </div>
      </section>

      {/* NOS INTERVENTIONS */}
      <section className="py-20 bg-[color:var(--surface-muted)]">
        <div className="container-x">
          <h2 className="text-3xl md:text-4xl max-w-3xl">
            Tous types de bâtiments, tous types de projets
          </h2>
          <p className="mt-6 max-w-3xl text-lg">
            Nos électriciens qualifiés interviennent aussi bien dans le
            résidentiel que dans le commercial et l'institutionnel.
            Appartements, villas, immeubles d'habitation, immeubles de
            bureaux, commerces, hôtels et restaurants, écoles, crèches,
            garages et industries — chaque chantier est abordé avec le même
            niveau d'exigence, qu'il s'agisse d'une transformation partielle
            ou d'une rénovation complète de l'installation électrique.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {typesBatiments.map((b) => (
              <article key={b.title} className="card-soft">
                <b.icon className="w-7 h-7 text-brand" />
                <h3 className="mt-5 text-xl">{b.title}</h3>
                <p className="mt-2 text-sm">{b.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NOTRE APPROCHE */}
      <section className="container-x py-20">
        <h2 className="text-3xl md:text-4xl max-w-3xl">Un projet mené de A à Z</h2>
        <p className="mt-6 max-w-3xl text-lg">
          Chaque rénovation commence par une analyse approfondie de votre
          installation existante. Nos électriciens établissent un diagnostic
          précis avant de vous proposer une solution adaptée à vos besoins.
          Les travaux sont ensuite réalisés dans le respect strict des normes
          NIBT/OIBT en vigueur en Suisse, avec un suivi rigoureux jusqu'à la
          réception du chantier.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {etapes.map((e) => (
            <div key={e.title} className="card-soft text-center">
              <e.icon className="w-8 h-8 text-brand mx-auto" />
              <h3 className="mt-4 text-xl">{e.title}</h3>
              <p className="mt-2 text-sm">{e.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POURQUOI NOUS CHOISIR */}
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
          <h2 className="text-3xl md:text-4xl text-white">Un projet de rénovation ?</h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-white/90">
            Nos électriciens analysent votre installation et vous proposent
            la solution la mieux adaptée à votre bâtiment.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a
              href="tel:0228498333"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-brand font-semibold hover:bg-white/90 transition"
            >
              <Phone className="w-4 h-4" /> 022 849 83 33
            </a>
            <a
              href="https://www.bourquinelectricite.ch/#contact"
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
