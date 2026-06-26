import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Phone,
  BadgeCheck,
  Cable,
  PhoneCall,
  Video,
} from "lucide-react";

export const Route = createFileRoute("/telecoms")({
  component: TelecomsPage,
  head: () => ({
    meta: [
      { title: "Installation télécom & câblage réseau à Genève | bourquin les électriciens" },
      {
        name: "description",
        content:
          "Câblage structuré, fibre optique, VoIP, interphonie et téléphonie d'entreprise à Genève. Partenaire Swisscom Business Gold. Devis gratuit : 022 849 83 33.",
      },
      {
        property: "og:title",
        content: "Installation télécom & câblage réseau à Genève | bourquin les électriciens",
      },
      {
        property: "og:description",
        content:
          "Câblage structuré, fibre optique, VoIP, interphonie et téléphonie d'entreprise à Genève.",
      },
      { property: "og:url", content: "https://bourquinelectricite.ch/telecoms" },
    ],
    links: [{ rel: "canonical", href: "https://bourquinelectricite.ch/telecoms" }],
  }),
});

const telephonie = [
  "Téléphonie fixe et mobile",
  "VoIP / SIP Networking",
  "IP Phone et Softphone",
  "Voicemail et CTI",
  "Call centres",
  "Unified Communications",
];

const cablage = [
  "Câblage structuré (cuivre Cat6 / Cat7)",
  "Câblage multimédia pour habitation",
  "Fibre optique (tirage, épissure, mesure OTDR)",
];

const interphonie = [
  "Vidéo-interphonie",
  "Systèmes filaires et sans fil",
  "Installations pour immeubles et régies",
];

function PillList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {items.map((i) => (
        <li
          key={i}
          className="rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm"
        >
          {i}
        </li>
      ))}
    </ul>
  );
}

function TelecomsPage() {
  return (
    <div>
      <SiteHeader />

      {/* HERO */}
      <section className="container-x py-20">
        <p className="eyebrow">Télécoms</p>
        <h1 className="mt-3 text-4xl md:text-5xl max-w-3xl">
          Télécoms & câblage réseau à Genève
        </h1>
        <p className="mt-6 max-w-2xl text-lg">
          De la prise téléphonique à l'infrastructure fibre optique,
          bourquin les électriciens conçoit et installe vos réseaux de
          communication — pour les particuliers, les entreprises et les
          grandes infrastructures.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[color:var(--surface-muted)] px-4 py-2 text-sm font-medium">
          <BadgeCheck className="w-4 h-4 text-brand" />
          Swisscom Business Gold Partner
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="tel:0228498333" className="btn-brand">
            <Phone className="w-4 h-4" /> 022 849 83 33
          </a>
          <Link to="/contact" className="btn-outline">Envoyer une demande</Link>
        </div>
      </section>


      {/* TÉLÉPHONIE */}
      <section className="py-20 bg-[color:var(--surface-muted)]">
        <div className="container-x">
          <div className="flex items-center gap-3">
            <PhoneCall className="w-7 h-7 text-brand" />
            <h2 className="text-3xl md:text-4xl">Téléphonie fixe, mobile et VoIP</h2>
          </div>
          <p className="mt-6 max-w-3xl text-lg">
            Que vous équipiez un bureau, un call centre ou une infrastructure
            multi-sites, nous déployons des solutions de téléphonie adaptées à
            vos usages.
          </p>
          <PillList items={telephonie} />
        </div>
      </section>

      {/* CÂBLAGE */}
      <section className="container-x py-20">
        <div className="flex items-center gap-3">
          <Cable className="w-7 h-7 text-brand" />
          <h2 className="text-3xl md:text-4xl">Câblage structuré et fibre optique</h2>
        </div>
        <p className="mt-6 max-w-3xl text-lg">
          Une infrastructure réseau fiable commence par un câblage bien conçu.
          Nous réalisons le câblage structuré pour réseaux informatiques et
          télécom, le câblage multimédia pour habitations, et le tirage de
          fibres optiques, certifiés selon les normes suisses et européennes.
        </p>
        <PillList items={cablage} />
      </section>

      {/* INTERPHONIE */}
      <section className="py-20 bg-[color:var(--surface-muted)]">
        <div className="container-x">
          <div className="flex items-center gap-3">
            <Video className="w-7 h-7 text-brand" />
            <h2 className="text-3xl md:text-4xl">Interphonie et vidéo-interphonie</h2>
          </div>
          <p className="mt-6 max-w-3xl text-lg">
            Pour les immeubles résidentiels, les entreprises et les régies
            immobilières, nous installons des systèmes d'interphonie filaire
            et sans fil, avec ou sans vidéo, du simple portier au système
            multi-entrées centralisé.
          </p>
          <PillList items={interphonie} />
        </div>
      </section>

      {/* RÉFÉRENCE ÉVÉNEMENTIELLE */}
      <section className="container-x py-20">
        <div className="rounded-2xl border-2 border-brand/30 bg-brand/5 p-8 md:p-12">
          <p className="eyebrow">Référence</p>
          <h2 className="mt-3 text-3xl md:text-4xl max-w-3xl">
            Quand les caméras du monde entier comptent sur nous
          </h2>
          <p className="mt-6 max-w-3xl text-lg">
            Lors de grandes compétitions internationales organisées en Suisse
            Romande, nos équipes ont déployé l'intégralité de l'infrastructure
            de câblage data nécessaire à la retransmission télévisée : lignes
            informatiques haute densité, gestion des flux caméras, coordination
            avec les équipes de broadcast. Des installations réalisées sous
            contrainte de temps, de fiabilité et de visibilité internationale.
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-brand text-white">
        <div className="container-x py-20 text-center">
          <h2 className="text-3xl md:text-4xl text-white">Un projet télécom à Genève ?</h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-white/90">
            Parlons de votre infrastructure : nos équipes vous conseillent
            et établissent un devis adapté à vos besoins.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-brand font-semibold hover:bg-white/90 transition"
            >
              Nous contacter
            </a>
            <a
              href="tel:0228498333"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white text-white font-semibold hover:bg-white/10 transition"
            >
              <Phone className="w-4 h-4" /> 022 849 83 33
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
