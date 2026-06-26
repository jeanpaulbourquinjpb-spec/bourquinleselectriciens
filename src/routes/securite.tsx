import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Phone,
  Camera,
  Bell,
  Fingerprint,
  BadgeCheck,
} from "lucide-react";

export const Route = createFileRoute("/securite")({
  component: SecuritePage,
  head: () => ({
    meta: [
      { title: "Sécurité à Genève — Vidéosurveillance, alarme & contrôle d'accès" },
      {
        name: "description",
        content:
          "Installations de sécurité haute technologie à Genève : vidéosurveillance, anti-intrusion, détection incendie, contrôle d'accès et biométrie. Conçues et posées par nos électriciens qualifiés.",
      },
      { property: "og:title", content: "Sécurité à Genève — Vidéosurveillance, alarme & contrôle d'accès" },
      {
        property: "og:description",
        content:
          "Vidéosurveillance, anti-intrusion, détection incendie, contrôle d'accès et biométrie pour vos locaux à Genève.",
      },
    ],
    links: [{ rel: "canonical", href: "https://bourquinelectricite.ch/securite" }],
  }),
});

const domaines = [
  {
    icon: Camera,
    title: "Vidéosurveillance",
    text: "Nous installons des systèmes de caméras IP et analogiques adaptés à vos locaux, intérieurs comme extérieurs, pour une supervision en temps réel ou en différé.",
  },
  {
    icon: Bell,
    title: "Anti-intrusion & détection incendie",
    text: "Systèmes d'alarme filaires et sans fil pour protéger vos locaux contre les intrusions et détecter tout départ de feu, avec intervention rapide en cas d'alerte.",
  },
  {
    icon: Fingerprint,
    title: "Contrôle d'accès & biométrie",
    text: "Gérez les accès à vos locaux avec précision. Lecteurs de cartes, claviers à code, cylindres électroniques ou reconnaissance biométrique : chaque solution est adaptée à la taille et aux besoins de votre entreprise. La biométrie offre un niveau de sécurité maximal en identifiant une personne par ses caractéristiques morphologiques uniques, sans risque de perte, de vol ou de copie.",
  },
];

const avantages = [
  "Entreprise familiale genevoise depuis 1968",
  "Électriciens et conseillers en sécurité qualifiés",
  "Technologies IP, filaires et sans-fil",
  "Un seul interlocuteur de l'étude à l'installation",
];

function SecuritePage() {
  return (
    <div>
      <SiteHeader />

      {/* HERO */}
      <section className="container-x py-20">
        <p className="eyebrow">Sécurité</p>
        <h1 className="mt-3 text-4xl md:text-5xl max-w-3xl">Sécurité</h1>
        <p className="mt-4 text-xl text-brand font-medium">
          Installations haute technologie pour vos locaux
        </p>
        <p className="mt-6 max-w-2xl text-lg">
          Protégez vos locaux, votre entreprise et vos biens grâce à des installations haute technologie, conçues et posées par nos électriciens qualifiés.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="tel:0228498333" className="btn-brand">
            <Phone className="w-4 h-4" /> 022 849 83 33
          </a>
          <a href="/contact" className="btn-outline">Envoyer une demande</a>
        </div>
      </section>

      {/* DOMAINES */}
      <section className="py-20 bg-[color:var(--surface-muted)]">
        <div className="container-x">
          <h2 className="text-3xl md:text-4xl max-w-3xl">Nos solutions de sécurité</h2>
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
          <h2 className="text-3xl md:text-4xl text-white">Un projet de sécurisation ?</h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-white/90">
            Contactez-nous : nos responsables de projets clients vous conseillent et établissent une étude sur mesure.
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
