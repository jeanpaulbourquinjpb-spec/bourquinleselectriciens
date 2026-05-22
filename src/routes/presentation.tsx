import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SponsoringTimeline } from "@/components/SponsoringTimeline";
import { ExternalLink, FileText, Award } from "lucide-react";

export const Route = createFileRoute("/presentation")({
  component: PresentationPage,
  head: () => ({
    meta: [
      { title: "Présentation — bourquin les électriciens à Genève" },
      {
        name: "description",
        content:
          "Entreprise d'électricité générale à Genève depuis 1968. Trois générations de savoir-faire : étude, conseil, contrôle, rénovation, éclairage, télécom, maintenance & dépannage.",
      },
    ],
  }),
});

const associations = [
  { name: "Association Achats Electro (AAE)", href: "https://www.eev.ch/fr" },
  { name: "Electrosuisse", href: "https://www.electrosuisse.ch/de/" },
  { name: "Association des métiers techniques du bâtiment Tech-Bat", href: "https://www.tech-bat.ch/" },
];

const partenariats = [
  { name: "Services Industriels de Genève (SIG)", href: "http://www.sig-ge.ch/" },
  { name: "Swisscom SA", href: "http://www.swisscom.ch/" },
  { name: "Reichle & De-Massari", href: "http://www.rdm.com/en/co/about-us/home.aspx" },
];

const certificats = [
  {
    name: "Certificat Swisscom Business Platin Partner 2019",
    href: "https://de.cdn-website.com/196019cf1a714e1ea0eb1424eaebc914/files/uploaded/SwisscomBusinessGoldPartner2020%20(2).pdf",
  },
  {
    name: "Certificat éco21 partenaire engagé 2019",
    href: "https://de.cdn-website.com/196019cf1a714e1ea0eb1424eaebc914/files/uploaded/CertificatSIGco21Partenaireengag2020%20(2).pdf",
  },
];

const cgv = [
  { name: "Temps d'intervention — Principe", href: "https://de.cdn-website.com/196019cf1a714e1ea0eb1424eaebc914/files/uploaded/Letempsdintervention-Principe.pdf" },
  { name: "Changements de prix du côté de nos fournisseurs", href: "https://de.cdn-website.com/196019cf1a714e1ea0eb1424eaebc914/files/uploaded/Changementsdeprixducotedenosfournisseurs2022FR.pdf" },
  { name: "CGV — Conditions générales de vente", href: "https://de.cdn-website.com/196019cf1a714e1ea0eb1424eaebc914/files/uploaded/ConditionsgnralesdeventeCGV-Edition23.08.2022.pdf" },
  { name: "CGV Annexe 1 — Solutions électriques", href: "https://de.cdn-website.com/196019cf1a714e1ea0eb1424eaebc914/files/uploaded/Annexe1-Solutionslecctriques-ComplmentnosconditionsgnralesdeventeCGV.pdf" },
  { name: "CGV Annexe 2 — Percements", href: "https://de.cdn-website.com/196019cf1a714e1ea0eb1424eaebc914/files/uploaded/Annexe2-Percements-ComplmentnosconditionsgnralesdeventeCGV.pdf" },
  { name: "CGV Annexe 3 — Installations d'éclairage", href: "https://de.cdn-website.com/196019cf1a714e1ea0eb1424eaebc914/files/uploaded/Annexe_3_-_Installations_d-%C3%A9clairage_-_Compl%C3%A9ment_%C3%A0_nos_conditions_g%C3%A9n%C3%A9rales_de_vente_CGV.pdf" },
  { name: "CGV — Infos plaque de finitions métalliques", href: "https://de.cdn-website.com/196019cf1a714e1ea0eb1424eaebc914/files/uploaded/CGV-Infos-Plaquesdefinitionsmtalliques.pdf" },
  { name: "Prix d'interventions", href: "https://de.cdn-website.com/196019cf1a714e1ea0eb1424eaebc914/files/uploaded/Les+prix+d-interventions+01.01.2026.pdf" },
];

const sponsoring = [
  { text: "Fédération Equestre Internationale, Dressage European Championship Crozet 2025 — 27 au 31.08.25 — Crozet, France" },
  { text: "Generali Genève Marathon, association Speed 4 ALS — 11.05.25 — Genève" },
  { text: "Concours de dressage international 5★ Jiva Hill Stables — 28.08.24 au 01.09.24 — Crozet, France" },
  { text: "Concours de dressage international 5★ Jiva Hill Stables — 28.08.24 au 01.09.24 — Crozet, France" },
  { text: "Concours de dressage international de Jiva Hill Stables — 02 au 06.08.23 — Crozet, France" },
  { text: "Concours de dressage international de Jiva Hill Stables — 25 au 28.08.22 — Crozet, France" },
  { text: "Club partner's de l'équipe de basketball des Lions de Genève — soirée de Gala — Palexpo, Grand-Saconnex, Genève" },
  { text: "Concours de dressage international de Jiva Hill Stables — 20 au 22.08.21 — Crozet, France" },
  { text: "Membre du Golden Lions Club GLC et sponsor de l'équipe de basketball des « Lions de Genève » — saison 2020" },
  { text: "Concours de dressage international de Jiva Hill Stables — 08 au 11.08.19 — Crozet, France" },
  { text: "Club partner's de l'équipe de basketball des Lions de Genève — saison 2019 — Grand-Saconnex, Genève" },
  { text: "Concours de dressage international de Jiva Hill Stables — 10 au 12.08.18 — Crozet, France" },
  { text: "Coureur Paulo Dos Santos sur 80 km pour la 1ère de l'EcoTrail Genève — 2018 — Place des Nations, Genève" },
  { text: "Club partner's de l'équipe de basketball des Lions de Genève — saison 2018 — Grand-Saconnex, Genève" },
  { text: "Concours de dressage international de Jiva Hill Stables — 03 au 04.08.17 — Crozet, France" },
  { text: "Club partner's de l'équipe de basketball des Lions de Genève — saison 2017 — Grand-Saconnex, Genève" },
  { text: "Manifestation de course à pied Run4Science, prônant les méthodes alternatives à l'expérimentation animale — 12.06.16 — Refuge de Darwin, Bernex à Genève" },
  { text: "Club partner's de l'équipe de basketball des Lions de Genève — saison 2016 — Grand-Saconnex, Genève" },
];

function PresentationPage() {
  return (
    <div>
      <SiteHeader />

      <section className="container-x py-20">
        <p className="eyebrow">Présentation</p>
        <h1 className="mt-3 text-4xl md:text-5xl">bourquin les électriciens à Genève</h1>
        <p className="mt-6 text-lg max-w-3xl">
          Entreprise d'électricité générale active depuis 60 ans à Genève.
        </p>
        <p className="mt-6 max-w-3xl">
          Fondée à Genève en 1968, l'entreprise familiale incarne 3 générations de savoir-faire et de passion.
          Elle perpétue cet héritage tout en adoptant une vision moderne et dynamique. Elle offre des solutions
          innovantes et durables, alliant sécurité, confort, et efficience énergétique, à une clientèle
          institutionnelle, commerciale et privée.
        </p>
        <p className="mt-4 max-w-3xl">
          À disposition et écoute de ses clients pour l'entretien de tous types d'installations électriques
          dans les domaines suivants&nbsp;:
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 max-w-2xl">
          {["étude, conseil et contrôle", "rénovation", "éclairage", "télécommunications", "maintenance & dépannage"].map((d) => (
            <li key={d} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              <span className="capitalize">{d}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="py-20 bg-[color:var(--surface-muted)]">
        <div className="container-x grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl">Associations</h2>
            <ul className="mt-6 space-y-3">
              {associations.map((a) => (
                <li key={a.name}>
                  <a href={a.href} target="_blank" rel="noreferrer" className="link-brand inline-flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" /> {a.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl">Partenariats</h2>
            <ul className="mt-6 space-y-3">
              {partenariats.map((p) => (
                <li key={p.name}>
                  <a href={p.href} target="_blank" rel="noreferrer" className="link-brand inline-flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" /> {p.name}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-6 space-y-3">
              {certificats.map((c) => (
                <li key={c.name}>
                  <a href={c.href} target="_blank" rel="noreferrer" className="link-brand inline-flex items-center gap-2">
                    <Award className="w-4 h-4" /> {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <h2 className="text-2xl">Prix et conditions générales de vente</h2>
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {cgv.map((c) => (
            <li key={c.name}>
              <a href={c.href} target="_blank" rel="noreferrer" className="card-soft flex items-start gap-3 p-5">
                <FileText className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{c.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section id="scroll_to_bottom" className="py-20 bg-[color:var(--surface-muted)] overflow-hidden">
        <div className="container-x">
          <p className="eyebrow">Engagement</p>
          <h2 className="mt-3 text-3xl md:text-4xl">Sponsoring</h2>
          <p className="mt-4 max-w-2xl text-sm">
            Une chronologie de nos engagements sportifs, culturels et associatifs.
          </p>
        </div>

        <SponsoringTimeline items={sponsoring} />

        <div className="container-x">
          <p className="mt-10 text-sm">
            Toute l'actualité sur nos pages{" "}
            <a className="link-brand" href="https://www.facebook.com/bourquinelectricite/" target="_blank" rel="noreferrer">Facebook</a>,{" "}
            <a className="link-brand" href="https://www.instagram.com/bourquinleselectriciens/" target="_blank" rel="noreferrer">Instagram</a>{" "}
            et{" "}
            <a className="link-brand" href="https://www.linkedin.com/company/3612995/admin/" target="_blank" rel="noreferrer">LinkedIn</a>
            , Bourquin les électriciens.
          </p>
        </div>
      </section>

      <section className="container-x py-20 text-center">
        <h2 className="text-3xl">Un projet, une question ?</h2>
        <p className="mt-4 max-w-xl mx-auto">Nous sommes à votre écoute pour toute installation, rénovation ou intervention.</p>
        <Link to="/contact" className="btn-brand mt-8">Nous contacter</Link>
      </section>

      <SiteFooter />
    </div>
  );
}
