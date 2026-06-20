import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Phone,
  ClipboardCheck,
  MessageSquare,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

export const Route = createFileRoute("/etude-conseil-controle")({
  component: EtudeConseilControlePage,
  head: () => ({
    meta: [
      { title: "Étude, conseil et contrôle électrique à Genève" },
      {
        name: "description",
        content:
          "De la conception à la réception, nous accompagnons vos projets électriques à chaque étape. Étude, conseil et contrôle par nos techniciens qualifiés à Genève.",
      },
      { property: "og:title", content: "Étude, conseil et contrôle électrique à Genève" },
      {
        property: "og:description",
        content:
          "Accompagnement technique de la conception à la réception. Études électriques, conseil et contrôles NIBT/OIBT à Genève.",
      },
    ],
    links: [{ rel: "canonical", href: "https://bourquinelectricite.ch/etude-conseil-controle" }],
  }),
});

const services = [
  {
    icon: ClipboardCheck,
    title: "Étude et conception",
    text: "Chaque projet mérite une analyse sérieuse avant de commencer. Nous établissons le concept électrique adapté à votre chantier, qu'il y ait ou non un architecte ou une direction de travaux en place.",
  },
  {
    icon: MessageSquare,
    title: "Conseil tout au long du chantier",
    text: "Notre accompagnement ne s'arrête pas au devis. Nos techniciens restent disponibles à chaque phase des travaux pour coordonner, ajuster et garantir la bonne exécution du projet.",
  },
  {
    icon: ShieldCheck,
    title: "Contrôle et réception",
    text: "Contrôles initiaux, finaux, de réception et périodiques selon les normes NIBT/OIBT. Audits, analyses et expertises de vos installations électriques existantes.",
  },
];

const avantages = [
  "Maître électricien fédéral à la tête des études",
  "Autorisation d'installer et autorisation de contrôler",
  "Accompagnement de la conception à la réception",
  "Particuliers, entreprises et régies immobilières",
];

function EtudeConseilControlePage() {
  return (
    <div>
      <SiteHeader />

      {/* HERO */}
      <section className="container-x py-20">
        <p className="eyebrow">Étude, conseil et contrôle</p>
        <h1 className="mt-3 text-4xl md:text-5xl max-w-3xl">
          Étude, conseil et contrôle électrique à Genève
        </h1>
        <p className="mt-4 text-xl text-brand font-medium">
          De la conception à la réception, nous accompagnons vos projets à chaque étape
        </p>
        <p className="mt-6 max-w-2xl text-lg">
          Un conseil électrique bien fait, c'est souvent ce qui évite une erreur coûteuse. Certains chantiers n'ont pas d'architecte ni de direction de travaux. C'est alors notre équipe qui assure la coordination technique, de la conception du concept électrique jusqu'à la réception finale. Nos études sont conduites par nos techniciens qualifiés et supervisées par notre maître électricien fédéral, le titre le plus élevé de la profession en Suisse.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="tel:0228498333" className="btn-brand">
            <Phone className="w-4 h-4" /> Appeler le 022 849 83 33
          </a>
          <a href="/contact" className="btn-outline">
            Envoyer une demande
          </a>
        </div>
      </section>

      {/* CE QUE NOUS FAISONS */}
      <section className="py-20 bg-[color:var(--surface-muted)]">
        <div className="container-x">
          <h2 className="text-3xl md:text-4xl max-w-3xl">Ce que nous faisons</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {services.map((s) => (
              <article key={s.title} className="card-soft">
                <s.icon className="w-7 h-7 text-brand" />
                <h3 className="mt-5 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm">{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI FAIRE APPEL À NOUS */}
      <section className="container-x py-20">
        <h2 className="text-3xl md:text-4xl max-w-3xl">Pourquoi faire appel à nous</h2>
        <p className="mt-6 max-w-2xl text-lg">
          Faire appel à un bureau d'études externe, c'est bien. Travailler avec une entreprise qui installe, contrôle et conseille depuis 1968 sur le même territoire, c'est une garantie supplémentaire. Nous connaissons les contraintes du terrain, les exigences des SIG et les normes en vigueur à Genève.
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
          <h2 className="text-3xl md:text-4xl text-white">
            Un projet sans architecte ni direction de travaux ?
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-white/90">
            Nos techniciens prennent en charge la coordination technique et vous accompagnent de A à Z.
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
