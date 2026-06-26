import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Phone,
  Timer,
  MapPin,
  BadgeCheck,
  Zap,
  PlugZap,
  AlertTriangle,
  ToggleLeft,
  Lightbulb,
  LayoutGrid,
  ShieldAlert,
  Lock,
  RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/depannage")({
  component: DepannagePage,
  head: () => ({
    meta: [
      { title: "Dépannage électrique à Genève — Intervention rapide" },
      {
        name: "description",
        content:
          "Dépannage électrique sur tout le canton de Genève. Intervention rapide visée en 2h pour les urgences par nos électriciens qualifiés depuis 1968.",
      },
      { property: "og:title", content: "Dépannage électrique à Genève — Intervention rapide" },
      {
        property: "og:description",
        content:
          "Intervention rapide sur tout le canton de Genève. Diagnostic et remise en service par nos électriciens qualifiés.",
      },
      { name: "twitter:title", content: "Dépannage électrique à Genève — Intervention rapide" },
      {
        name: "twitter:description",
        content:
          "Intervention rapide sur tout le canton de Genève. Diagnostic et remise en service par nos électriciens qualifiés.",
      },
    ],
    links: [{ rel: "canonical", href: "https://bourquinelectricite.ch/depannage" }],
  }),
});

const pannes = [
  { icon: Zap, title: "Disjoncteur défaillant", text: "Disjoncteur qui saute régulièrement ou tableau électrique à remettre en état." },
  { icon: PlugZap, title: "Panne de courant", text: "Coupure partielle ou totale de l'alimentation, diagnostic et remise en service." },
  { icon: AlertTriangle, title: "Court-circuit", text: "Localisation et résolution de courts-circuits sur votre installation." },
  { icon: ToggleLeft, title: "Prises et interrupteurs", text: "Prises qui ne fonctionnent plus, interrupteurs défectueux ou brûlés." },
  { icon: Lightbulb, title: "Éclairage professionnel", text: "Pannes d'éclairage dans restaurants, hôtels, commerces et espaces de bureau." },
  { icon: LayoutGrid, title: "Tableau électrique", text: "Défaillance, surcharge ou mise aux normes de votre tableau électrique." },
  { icon: ShieldAlert, title: "Installation hors normes", text: "Détection et correction d'installations non conformes suite à un contrôle." },
  { icon: Lock, title: "Sécurité et contrôle d'accès", text: "Pannes sur interphonie, contrôle d'accès et vidéosurveillance." },
  { icon: RefreshCw, title: "Pannes récurrentes", text: "Coupures inexpliquées et répétitives — diagnostic approfondi pour trouver la cause à la source." },
];

const avantages = [
  "Entreprise familiale genevoise depuis 1968",
  "Électriciens qualifiés et assurés",
  "Intervention sur tout le canton de Genève",
  "Certifiés Swisscom Business Gold et partenaire éco21",
];

function DepannagePage() {
  return (
    <div>
      <SiteHeader />

      {/* HERO */}
      <section className="container-x py-20">
        <p className="eyebrow">Dépannage</p>
        <h1 className="mt-3 text-4xl md:text-5xl max-w-3xl">
          Dépannage électrique à Genève
        </h1>
        <p className="mt-4 text-xl text-brand font-medium">
          Intervention rapide sur tout le canton
        </p>
        <p className="mt-6 max-w-2xl text-lg">
          Une panne électrique ne prévient pas. Depuis 1968, notre équipe
          d'électriciens qualifiés intervient sur tout le canton de Genève
          pour rétablir votre installation en toute sécurité.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="tel:0228498333" className="btn-brand">
            <Phone className="w-4 h-4" /> 022 849 83 33
          </a>
          <a href="/contact" className="btn-outline">Envoyer une demande</a>
        </div>
      </section>

      {/* INTERVENTION RAPIDE */}
      <section className="py-20 bg-[color:var(--surface-muted)]">
        <div className="container-x">
          <h2 className="text-3xl md:text-4xl max-w-3xl">Un service de dépannage réactif</h2>
          <p className="mt-6 max-w-2xl text-lg">
            Nos électriciens qualifiés se déplacent sur l'ensemble du canton
            de Genève pour diagnostiquer et résoudre tout type de panne.
            Pour les urgences, nous visons une intervention dans les deux
            heures suivant votre appel.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { icon: Timer, text: "Intervention en 2h pour les urgences" },
              { icon: MapPin, text: "Tout le canton de Genève" },
              { icon: BadgeCheck, text: "Électriciens certifiés depuis 1968" },
            ].map((item) => (
              <div key={item.text} className="card-soft text-center">
                <item.icon className="w-8 h-8 text-brand mx-auto" />
                <p className="mt-4 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PANNES TRAITÉES */}
      <section className="container-x py-20">
        <h2 className="text-3xl md:text-4xl max-w-3xl">Les pannes que nous résolvons</h2>
        <p className="mt-6 max-w-2xl text-lg">
          Particuliers, restaurants, hôtels et entreprises — nos électriciens
          interviennent sur tous types d'installations, des problèmes
          ponctuels aux pannes récurrentes difficiles à identifier.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pannes.map((p) => (
            <article key={p.title} className="card-soft">
              <p.icon className="w-7 h-7 text-brand" />
              <h3 className="mt-5 text-xl">{p.title}</h3>
              <p className="mt-2 text-sm">{p.text}</p>
            </article>
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
          <h2 className="text-3xl md:text-4xl text-white">Une panne ? Appelez-nous.</h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-white/90">
            Nos électriciens se déplacent rapidement sur tout le canton de Genève.
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
              Envoyer une demande
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
