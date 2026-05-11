import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/actualite")({
  component: ActualitePage,
  head: () => ({
    meta: [
      { title: "Notre actualité — bourquin les électriciens" },
      {
        name: "description",
        content:
          "Actualités et conseils de bourquin les électriciens : aspirateur central, énergie solaire, sécurité électrique et plus.",
      },
      { property: "og:title", content: "Notre actualité — bourquin les électriciens" },
      {
        property: "og:description",
        content: "Actualités et conseils de bourquin les électriciens.",
      },
    ],
  }),
});

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

function ActualitePage() {
  return (
    <div>
      <SiteHeader />
      <section className="py-24">
        <div className="container-x">
          <p className="eyebrow">Notre actualité</p>
          <h1 className="mt-2 text-3xl md:text-4xl">À la une</h1>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => (
              <article key={n.title} className="card-soft flex flex-col">
                <h3 className="text-lg">{n.title}</h3>
                <p className="mt-3 text-sm flex-1">{n.excerpt}</p>
                <a
                  href={n.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-brand mt-5 inline-flex items-center gap-1 text-sm font-semibold"
                >
                  Vers l'article <ArrowRight className="w-4 h-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
