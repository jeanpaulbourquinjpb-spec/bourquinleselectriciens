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
  ClipboardCheck,
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
    text: "Appartements, villas et immeubles d'habitation. Rénovation complète ou partielle, mise aux normes et modernisation de votre installation électrique.",
  },
  {
    icon: Building2,
    title: "Commercial et institutionnel",
    text: "Bureaux, commerces, hôtels, restaurants, écoles, crèches, musées et salles de spectacle. Nos électriciens s'adaptent à vos contraintes d'exploitation et aux exigences spécifiques de chaque type d'établissement.",
  },
  {
    icon: Factory,
    title: "Industriel et extérieur",
    text: "Garages, industries, gares, parcs et jardins. Électricité industrielle, éclairage extérieur et mise aux normes de vos locaux techniques.",
  },
];

const etapes = [
  { icon: Search, title: "Analyse sur place", text: "Un responsable de projets clients se déplace chez vous pour évaluer votre installation existante et comprendre vos besoins." },
  { icon: FileText, title: "Offre sur mesure", text: "Une proposition claire et détaillée, adaptée à votre espace et à vos contraintes." },
  { icon: Hammer, title: "Réalisation", text: "Nos électriciens qualifiés exécutent les travaux dans les délais convenus." },
  { icon: ClipboardCheck, title: "Contrôle final", text: "Une vérification complète de l'installation réalisée, conformément aux normes NIBT/OIBT, avant la remise des clés." },
];

const avantages = [
  "Entreprise familiale genevoise depuis 1968",
  "Responsables de projets clients dédiés",
  "Résidentiel, commercial et institutionnel",
  "Normes NIBT/OIBT respectées et contrôlées sur chaque chantier",
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
          Une rénovation électrique, c'est bien plus que changer des prises. Nos responsables de projets clients analysent votre installation existante, définissent les meilleures solutions de câblage et de distribution, puis nos électriciens qualifiés réalisent l'ensemble des travaux, du passage des tubes aux raccordements finaux.
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

      {/* TOUS TYPES DE BÂTIMENTS */}
      <section className="py-20 bg-[color:var(--surface-muted)]">
        <div className="container-x">
          <h2 className="text-3xl md:text-4xl max-w-3xl">
            Tous types de bâtiments
          </h2>
          <p className="mt-6 max-w-3xl text-lg">
            Que ce soit un appartement à rafraîchir, un immeuble de bureaux à moderniser ou un restaurant à remettre aux normes, nous intervenons sur tous types de bâtiments résidentiels, commerciaux et institutionnels dans tout le canton de Genève.
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

      {/* COMMENT ON TRAVAILLE */}
      <section className="container-x py-20">
        <h2 className="text-3xl md:text-4xl max-w-3xl">Simple et clair, du premier contact aux travaux terminés</h2>
        <p className="mt-6 max-w-3xl text-lg">
          Un responsable de projets clients se déplace chez vous pour analyser votre installation et comprendre vos besoins. Il établit ensuite une offre détaillée adaptée à votre espace et à vos contraintes. Ce sont nos électriciens qualifiés qui réalisent les travaux, dans le respect des normes NIBT/OIBT en vigueur en Suisse.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {etapes.map((e) => (
            <div key={e.title} className="card-soft text-center">
              <e.icon className="w-8 h-8 text-brand mx-auto" />
              <h3 className="mt-4 text-xl">{e.title}</h3>
              <p className="mt-2 text-sm">{e.text}</p>
            </div>
          ))}
        </div>
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
          <h2 className="text-3xl md:text-4xl text-white">Un projet de rénovation ?</h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-white/90">
            Un appartement des années 70 à remettre aux normes, un restaurant à rénover sans interruption d'activité, des bureaux à reconfigurer. Chaque projet a ses contraintes. Nos responsables de projets clients les anticipent pour vous.
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
