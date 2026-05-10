import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArrowRight, Lightbulb, Shield, Tv, Wrench, Zap, Network } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import sloganImg from "@/assets/slogan-bourquin.png";
import elecImg from "@/assets/service-electricity.jpg";
import secImg from "@/assets/service-security.jpg";
import avImg from "@/assets/service-av.jpg";
import telImg from "@/assets/service-telecom.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "bourquin les électriciens — Électricité, télécom & sécurité à Genève" },
      {
        name: "description",
        content:
          "Entreprise d'électricité générale à Genève depuis 1968. Étude, rénovation, éclairage, télécommunications, sécurité et dépannage. « Entre nous le courant passe ».",
      },
      { property: "og:title", content: "bourquin les électriciens — Genève" },
      { property: "og:description", content: "Électricité, télécom, sécurité, dépannage à Genève." },
    ],
  }),
});

const slides = [
  {
    title: "Confort lumineux",
    text: "Aujourd'hui déjà, on attend de la technique électrique qu'elle fonctionne, mais aussi qu'elle économise du temps et accroisse le confort. Cela vaut particulièrement dans le domaine de l'éclairage. Intégré à un processus automatisé, il rend possible une ambiance lumineuse parfaite sur pression d'un bouton.",
    img: heroImg,
  },
  {
    title: "Entreprise d'électricité générale à Genève",
    text: "Entre nous le courant passe...",
    img: elecImg,
  },
  {
    title: "Sécurité, confort et efficience énergétique",
    text: "Grâce à notre équipe d'électriciens, de télématiciens, de contrôleurs, de conseillers en sécurité et de formateurs.",
    img: secImg,
  },
  {
    title: "Des installations haute technologie dans le domaine de la sécurité",
    text: "Contrôle d'accès, vidéosurveillance, interphonie, biométrie...",
    img: secImg,
  },
  {
    title: "Des experts pour toutes vos installations audiovisuelles",
    text: "Télévision, son et vidéo à la hauteur de vos exigences.",
    img: avImg,
  },
];

const services = [
  { icon: Lightbulb, title: "Étude, conseil & contrôle", text: "Accompagnement complet de la conception à la conformité." },
  { icon: Wrench, title: "Rénovation", text: "Modernisation et mise aux normes des installations électriques." },
  { icon: Zap, title: "Éclairage", text: "Conception lumineuse et solutions d'éclairage automatisées." },
  { icon: Network, title: "Télécommunications", text: "Câblage, réseaux et solutions télécom professionnelles." },
  { icon: Shield, title: "Sécurité", text: "Contrôle d'accès, vidéosurveillance, interphonie, biométrie." },
  { icon: Tv, title: "Audiovisuel", text: "Télévision, son et vidéo à la hauteur de vos exigences." },
];

const news = [
  {
    title: "Aspirateur central – propreté assurée",
    excerpt:
      "Propreté sans bactéries, pas d'appareil encombrant à traîner derrière soi, aspiration sans câble, ménagement du dos et presqu'aucun entretien : voici les avantages de l'aspirateur central. De plus, l'installer après coup ne pose aucun problème, et ce, même dans un appartement en location.",
    href: "https://www.e-tec.swiss/fr/installation-de-base/aspirateur-central?member=1108",
  },
  {
    title: "L'électricité, une marchandise locale",
    excerpt:
      "L'approvisionnement énergétique devient de plus en plus renouvelable et décentralisé. Les producteurs privés peuvent désormais choisir d'injecter leur électricité solaire dans le réseau ou de la distribuer directement dans leur quartier.",
    href: "https://www.e-tec.swiss/fr/energies-alternatives/modeles-commercialisation-electricite-solaire?member=1108",
  },
  {
    title: "Une planification précoce pour un confort supplémentaire",
    excerpt:
      "La réforme prévue de la valeur locative pourrait limiter fortement les déductions fiscales dès 2028. Pour les propriétaires, il devient judicieux de planifier et regrouper les travaux de rénovation dans les deux prochaines années afin de maintenir la valeur du bien tout en profitant encore des avantages fiscaux actuels. Une planification anticipée permet aussi d'améliorer le confort et de coordonner efficacement les installations techniques.",
    href: "https://www.e-tec.swiss/fr/installation-de-base/valeur-locative?member=1108",
  },
  {
    title: "Panneaux solaires défectueux – que faire ?",
    excerpt:
      "Produisant de l'électricité à faibles émissions de CO₂ pendant plusieurs décennies, les installations photovoltaïques contribuent notablement à la protection du climat. Mais que faire lorsqu'un module est défectueux ? Réparer, réutiliser et recycler ! Actuellement, les trois-quarts d'un module restent ainsi dans le cycle des matières.",
    href: "https://www.e-tec.swiss/fr/energies-alternatives/panneaux-solaires-defectueux?member=1108",
  },
  {
    title: "La sécurité électrique à la maison sauve des vies",
    excerpt:
      "Moteur invisible, pratique et irremplaçable de notre quotidien, l'électricité comporte cependant des risques sous-estimés. Selon le Centre d'information pour la prévention des incendies (CIPI), près de 3000 incendies sont directement causés par l'électricité chaque année en Suisse. Environ 600 personnes par an sont victimes d'accidents liés à une mauvaise utilisation de l'électricité (source ESTI). Nous vous montrons comment vous protéger chez vous.",
    href: "https://www.e-tec.swiss/fr/securite/securite-sous-tension?member=1108",
  },
];

function HomePage() {
  return (
    <div>
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
        </div>
        <div className="relative container-x py-28 md:py-40 max-w-3xl">
          <p className="eyebrow text-[color:var(--brand)]">Genève · depuis 1968</p>
          <h1 className="mt-4 text-4xl md:text-6xl text-white">
            <span className="text-brand">bourquin</span> les électriciens
          </h1>
          <img src={sloganImg} alt="entre nous, le courant passe…" className="mt-5 h-6 md:h-7 w-auto" />
          <p className="mt-6 text-white/80 text-lg max-w-xl">
            Électricité · Télécom · Sécurité · Dépannage. Une entreprise familiale,
            trois générations de savoir-faire au service de votre confort et de votre sécurité.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/services" className="btn-brand">
              Nos services <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="btn-outline" style={{ color: "white", borderColor: "white" }}>
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* SLIDES */}
      <section className="py-24">
        <div className="container-x">
          <p className="eyebrow">Nos univers</p>
          <h2 className="mt-2 text-3xl md:text-4xl max-w-2xl">
            Des solutions complètes, du courant fort au pilotage intelligent.
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {slides.map((s) => (
              <article key={s.title} className="card-soft overflow-hidden p-0">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={s.img} alt={s.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                </div>
                <div className="p-7">
                  <h3 className="text-xl">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed">{s.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 bg-[color:var(--surface-muted)]">
        <div className="container-x">
          <p className="eyebrow">Domaines d'intervention</p>
          <h2 className="mt-2 text-3xl md:text-4xl">À votre disposition pour l'entretien de toutes vos installations.</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="card-soft">
                <s.icon className="w-7 h-7 text-brand" />
                <h3 className="mt-5 text-lg">{s.title}</h3>
                <p className="mt-2 text-sm">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section className="py-24">
        <div className="container-x">
          <p className="eyebrow">Notre actualité</p>
          <h2 className="mt-2 text-3xl md:text-4xl">À la une</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => (
              <article key={n.title} className="card-soft flex flex-col">
                <h3 className="text-lg">{n.title}</h3>
                <p className="mt-3 text-sm flex-1">{n.excerpt}</p>
                <a href={n.href} target="_blank" rel="noreferrer" className="link-brand mt-5 inline-flex items-center gap-1 text-sm font-semibold">
                  Vers l'article <ArrowRight className="w-4 h-4" />
                </a>
              </article>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/presentation" className="btn-outline">
              Découvrir notre sponsoring
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
