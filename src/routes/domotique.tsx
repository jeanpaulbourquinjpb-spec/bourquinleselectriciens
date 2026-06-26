import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Phone,
  Home,
  Lightbulb,
  Shield,
  Thermometer,
  Smartphone,
  BadgeCheck,
} from "lucide-react";

export const Route = createFileRoute("/domotique")({
  component: DomotiquePage,
  head: () => ({
    meta: [
      { title: "Domotique à Genève — Confort intelligent et maison connectée" },
      {
        name: "description",
        content:
          "Conception et installation de systèmes domotiques sur mesure à Genève. Pilotez l'éclairage, les stores, le chauffage et la sécurité depuis un seul système, compatible Apple, Google et Amazon.",
      },
      { property: "og:title", content: "Domotique à Genève — Confort intelligent et maison connectée" },
      {
        property: "og:description",
        content:
          "Systèmes domotiques sur mesure à Genève. Éclairage, stores, chauffage et sécurité pilotés depuis un seul système.",
      },
    ],
    links: [{ rel: "canonical", href: "https://bourquinelectricite.ch/domotique" }],
  }),
});

const domaines = [
  {
    icon: Lightbulb,
    title: "Éclairage intelligent",
    text: "Réglez l'ambiance lumineuse de chaque pièce à la voix ou depuis votre smartphone. Scénarios personnalisés pour chaque moment de la journée.",
  },
  {
    icon: Home,
    title: "Stores et volets",
    text: "Automatisez l'ouverture et la fermeture de vos stores selon l'heure, la luminosité ou la température. Confort et économies d'énergie.",
  },
  {
    icon: Thermometer,
    title: "Chauffage & climatisation",
    text: "Pilotage centralisé de votre chauffage et climatisation pour un confort optimal et une consommation maîtrisée, pièce par pièce.",
  },
  {
    icon: Shield,
    title: "Sécurité connectée",
    text: "Intégration des alarmes, caméras, détecteurs et contrôle d'accès dans un même écosystème. Notifications en temps réel sur votre mobile.",
  },
  {
    icon: Smartphone,
    title: "Écosystèmes compatibles",
    text: "Nos installations s'appuient sur les protocoles professionnels les plus récents, compatibles avec les grands écosystèmes Apple HomeKit, Google Home et Amazon Alexa.",
  },
];

const avantages = [
  "Entreprise familiale genevoise depuis 1968",
  "Protocoles filaires pérennes et sans-fil compatibles",
  "Intégration avec Apple, Google et Amazon",
  "Un seul interlocuteur de l'étude à l'installation",
];

function DomotiquePage() {
  return (
    <div>
      <SiteHeader />

      {/* HERO */}
      <section className="container-x py-20">
        <p className="eyebrow">Domotique</p>
        <h1 className="mt-3 text-4xl md:text-5xl max-w-3xl">
          Domotique à Genève
        </h1>
        <p className="mt-4 text-xl text-brand font-medium">
          Confort intelligent pour votre bâtiment
        </p>
        <p className="mt-6 max-w-2xl text-lg">
          Nous concevons et installons des systèmes domotiques sur mesure pour votre confort, votre sécurité et vos économies d'énergie. Pilotez l'éclairage, les stores, le chauffage et la sécurité depuis un seul système, compatible avec les grands écosystèmes connectés.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="tel:0228498333" className="btn-brand">
            <Phone className="w-4 h-4" /> 022 849 83 33
          </a>
          <Link to="/contact" className="btn-outline">Envoyer une demande</Link>
        </div>
      </section>

      {/* DOMAINES */}
      <section className="py-20 bg-[color:var(--surface-muted)]">
        <div className="container-x">
          <h2 className="text-3xl md:text-4xl max-w-3xl">Ce que nous domotisons</h2>
          <p className="mt-6 max-w-2xl text-lg">
            Du simple volet roulant à l'éclairage d'une villa entière, nous intégrons chaque élément de votre bâtiment dans un système cohérent, intuitif et évolutif.
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
          <h2 className="text-3xl md:text-4xl text-white">Un projet domotique ?</h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-white/90">
            Discutons de vos besoins : nos responsables de projets clients vous conseillent et établissent une étude sur mesure.
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
