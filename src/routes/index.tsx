import { useEffect, useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { GoogleReviewsSection } from "@/components/GoogleReviewsSection";
import { PartnersCarousel } from "@/components/PartnersCarousel";
import { SponsoringTimeline } from "@/components/SponsoringTimeline";
import { ContactForm } from "@/components/ContactForm";
import {
  Lightbulb, Shield, Tv, Wrench, Zap, Network, ClipboardCheck, HeadphonesIcon,
  ArrowRight, FileText, Phone, Mail, MapPin, Clock, Linkedin, Facebook, Instagram, ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import sloganImg from "@/assets/slogan-bourquin.png";
import { getArticles, type ArticleDTO } from "@/lib/articles.functions";
import { listProjects, CATEGORIES, type ProjectDTO } from "@/lib/projects.functions";

const articlesQueryOptions = queryOptions({
  queryKey: ["articles"],
  queryFn: () => getArticles(),
});
const projectsQueryOptions = queryOptions({
  queryKey: ["projects"],
  queryFn: () => listProjects(),
});

export const Route = createFileRoute("/")({
  component: HomePage,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(articlesQueryOptions),
      context.queryClient.ensureQueryData(projectsQueryOptions),
    ]);
  },
  head: () => ({
    meta: [
      { title: "bourquin les électriciens — Électricité, télécom & sécurité à Genève" },
      {
        name: "description",
        content:
          "Entreprise d'électricité générale à Genève depuis 1968. Étude, rénovation, éclairage, télécom, sécurité, dépannage. « Entre nous le courant passe ».",
      },
    ],
  }),
});

/* ----------------------------- Data ----------------------------- */

const services = [
  { icon: ClipboardCheck, title: "Étude, conseil & contrôle", text: "Analyse, conception et contrôle de vos installations électriques par notre équipe d'experts certifiés." },
  { icon: HeadphonesIcon, title: "Maintenance & dépannage", text: "Intervention rapide et entretien régulier de tous types d'installations électriques." },
  { icon: Wrench, title: "Rénovation", text: "Modernisation de vos installations existantes, mise aux normes et rénovation complète d'appartements et bâtiments." },
  { icon: Lightbulb, title: "Éclairage", text: "Confort lumineux : technique électrique qui économise du temps, accroît le confort et permet une ambiance lumineuse parfaite sur pression d'un bouton." },
  { icon: Network, title: "Télécommunications", text: "Câblage cuivre et fibre, réseaux informatiques, téléphonie. Partenaire Swisscom Business Platin." },
  { icon: Shield, title: "Sécurité", text: "Installations haute technologie : contrôle d'accès, vidéosurveillance, interphonie, biométrie." },
  { icon: Tv, title: "Audiovisuel", text: "Des experts pour toutes vos installations audiovisuelles : télévision, son et vidéo à la hauteur de vos exigences." },
  { icon: Zap, title: "Efficience énergétique", text: "Solutions électriques durables pour votre sécurité, votre confort et votre efficience énergétique. Partenaire éco21 certifié." },
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
  { text: "Manifestation de course à pied Run4Science — 12.06.16 — Refuge de Darwin, Bernex à Genève" },
  { text: "Club partner's de l'équipe de basketball des Lions de Genève — saison 2016 — Grand-Saconnex, Genève" },
];

/* ----------------------------- Helpers ----------------------------- */

function useHashScroll() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("fr-CH", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return null;
  }
}

/* ----------------------------- Page ----------------------------- */

function HomePage() {
  useHashScroll();
  const { data: articlesData } = useSuspenseQuery(articlesQueryOptions);
  const { data: projectsData } = useSuspenseQuery(projectsQueryOptions);

  return (
    <div>
      <SiteHeader />

      {/* ============================== ACCUEIL ============================== */}
      <section id="accueil" className="scroll-mt-20 pt-16">
        <div className="container-x">
          <p className="eyebrow">Domaines d'intervention</p>
          <h1 className="mt-2 text-3xl md:text-5xl">À votre disposition pour l'entretien de toutes vos installations.</h1>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s) => (
              <div key={s.title} className="card-soft">
                <s.icon className="w-7 h-7 text-brand" />
                <h3 className="mt-5 text-lg">{s.title}</h3>
                <p className="mt-2 text-sm">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <GoogleReviewsSection />
        </div>

        <PartnersCarousel />
      </section>

      {/* ============================== À PROPOS ============================== */}
      <section id="a-propos" className="scroll-mt-20">
        <div className="container-x py-24">
          <p className="eyebrow">Présentation</p>
          <h2 className="mt-3 text-3xl md:text-5xl">bourquin les électriciens à Genève</h2>
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
        </div>

        <div className="py-20 bg-[color:var(--surface-muted)] overflow-hidden">
          <div className="container-x">
            <p className="eyebrow">Engagement</p>
            <h3 className="mt-3 text-3xl md:text-4xl">Sponsoring</h3>
            <p className="mt-4 max-w-2xl text-sm">
              Une chronologie de nos engagements sportifs, culturels et associatifs.
            </p>
          </div>
          <SponsoringTimeline items={sponsoring} />
        </div>
      </section>

      {/* ============================== SERVICES ============================== */}
      <section id="services" className="scroll-mt-20">
        <div className="container-x py-24">
          <p className="eyebrow">Nos services</p>
          <h2 className="mt-3 text-3xl md:text-5xl max-w-3xl">
            Sécurité, confort et efficience énergétique.
          </h2>
          <p className="mt-6 max-w-2xl text-lg">
            Grâce à notre équipe d'électriciens, de télématiciens, de contrôleurs, de conseillers en sécurité
            et de formateurs, nous prenons en charge tous les aspects de vos installations électriques.
          </p>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <article key={s.title} className="card-soft">
                <s.icon className="w-7 h-7 text-brand" />
                <h3 className="mt-5 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm">{s.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="container-x pb-24">
          <h3 className="text-2xl md:text-3xl">Prix et conditions générales de vente</h3>
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
        </div>
      </section>

      {/* ============================== ACTUALITÉ ============================== */}
      <section id="actualite" className="scroll-mt-20 bg-[color:var(--surface-muted)]">
        <div className="container-x py-24">
          <p className="eyebrow">Notre actualité</p>
          <h2 className="mt-2 text-3xl md:text-5xl">À la une</h2>
          <ActualiteContent articles={articlesData.articles} />
        </div>
      </section>

      {/* ============================== NOS PROJETS ============================== */}
      <section id="nos-projets" className="scroll-mt-20">
        <div className="container-x py-24">
          <p className="eyebrow">Réalisations</p>
          <h2 className="mt-2 text-3xl md:text-5xl">Nos projets</h2>
          <p className="mt-4 max-w-2xl text-[color:var(--muted-foreground)]">
            Une sélection de réalisations qui illustrent notre savoir-faire en électricité,
            éclairage, sécurité et télécommunications.
          </p>
          <ProjetsContent projects={projectsData.projects} />
        </div>
      </section>

      {/* ============================== CONTACT ============================== */}
      <section id="contact" className="scroll-mt-20 bg-[color:var(--surface-muted)]">
        <div className="container-x py-24">
          <p className="eyebrow">Infos pratiques</p>
          <h2 className="mt-3 text-4xl md:text-5xl">Contact</h2>
          <img src={sloganImg} alt="entre nous, le courant passe…" className="mt-5 h-6 md:h-7 w-auto" />

          <div className="mt-12 max-w-3xl">
            <p className="eyebrow">Écrivez-nous</p>
            <h3 className="mt-3 text-2xl md:text-3xl">Formulaire de contact</h3>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <div className="mt-20 grid gap-10 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="card-soft">
                <div className="flex gap-4">
                  <Phone className="w-6 h-6 text-brand shrink-0" />
                  <div>
                    <h3 className="text-lg">Téléphone</h3>
                    <a href="tel:0228498333" className="link-brand text-base mt-1 inline-block">022 849 83 33</a>
                  </div>
                </div>
              </div>
              <div className="card-soft">
                <div className="flex gap-4">
                  <Mail className="w-6 h-6 text-brand shrink-0" />
                  <div>
                    <h3 className="text-lg">E-mail</h3>
                    <a href="mailto:info@bourquinelectricite.ch" className="link-brand text-base mt-1 inline-block break-all">
                      info@bourquinelectricite.ch
                    </a>
                  </div>
                </div>
              </div>
              <div className="card-soft">
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-brand shrink-0" />
                  <div>
                    <h3 className="text-lg">Adresse</h3>
                    <p className="mt-1">bourquin les électriciens<br />Rue Henri-Blanvalet 21<br />1207 Genève</p>
                    <a href="https://maps.app.goo.gl/Lupi2EoHQWR2himFA" target="_blank" rel="noreferrer" className="link-brand mt-3 inline-block text-sm">
                      Voir sur Google Maps →
                    </a>
                  </div>
                </div>
              </div>
              <div className="card-soft">
                <div className="flex gap-4">
                  <Clock className="w-6 h-6 text-brand shrink-0" />
                  <div>
                    <h3 className="text-lg">Horaires</h3>
                    <table className="mt-2 text-sm">
                      <tbody>
                        <tr><td className="pr-6 py-0.5">Lundi – Vendredi</td><td>07:30 – 12:00 · 13:30 – 16:00</td></tr>
                        <tr><td className="pr-6 py-0.5">Samedi – Dimanche</td><td className="text-brand font-semibold">Fermé</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-2xl overflow-hidden border border-[color:var(--line)] aspect-[4/3]">
                <iframe
                  title="Localisation bourquin les électriciens"
                  src="https://www.google.com/maps?q=Rue+Henri-Blanvalet+21,+1207+Gen%C3%A8ve&output=embed"
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="mt-8">
                <h3 className="text-lg">Échangez, partagez</h3>
                <div className="flex gap-3 mt-4">
                  <a href="https://ch.linkedin.com/company/bourquin-les-electriciens" target="_blank" rel="noreferrer" className="btn-outline" aria-label="LinkedIn"><Linkedin className="w-4 h-4" /> LinkedIn</a>
                  <a href="https://instagram.com/bourquinleselectriciens/" target="_blank" rel="noreferrer" className="btn-outline" aria-label="Instagram"><Instagram className="w-4 h-4" /> Instagram</a>
                  <a href="https://facebook.com/bourquinelectricite/" target="_blank" rel="noreferrer" className="btn-outline" aria-label="Facebook"><Facebook className="w-4 h-4" /> Facebook</a>
                </div>
              </div>
              <div className="mt-10">
                <h3 className="text-lg">Téléchargez</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <a href="https://de.cdn-website.com/196019cf1a714e1ea0eb1424eaebc914/files/uploaded/Vive20la20vie.pdf" target="_blank" rel="noreferrer" className="link-brand inline-flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Revue « Vive la vie » des SIG
                    </a>
                  </li>
                  <li>
                    <a href="https://de.cdn-website.com/196019cf1a714e1ea0eb1424eaebc914/files/uploaded/Dunkrevue-articleBourquin.pdf" target="_blank" rel="noreferrer" className="link-brand inline-flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Revue « Dunk » des Lions de Genève
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <SiteFooter />
      </section>
    </div>
  );
}

/* ----------------------------- Sub-sections ----------------------------- */

function ActualiteContent({ articles }: { articles: ArticleDTO[] }) {
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a.id !== featured?.id);

  if (!featured) {
    return (
      <p className="mt-12 text-sm text-muted-foreground">
        Aucun article pour le moment. La prochaine mise à jour automatique aura lieu bientôt.
      </p>
    );
  }

  return (
    <>
      <article className="card-soft mt-12 flex flex-col gap-3 md:p-10">
        {(featured.category || formatDate(featured.published_at)) && (
          <p className="eyebrow">
            {featured.category}
            {featured.category && formatDate(featured.published_at) ? " · " : ""}
            {formatDate(featured.published_at)}
          </p>
        )}
        <h3 className="text-2xl md:text-3xl">{featured.title}</h3>
        {featured.excerpt && <p className="text-base">{featured.excerpt}</p>}
        <a href={featured.url} target="_blank" rel="noreferrer" className="link-brand mt-2 inline-flex items-center gap-1 text-sm font-semibold">
          Lire l'article <ArrowRight className="w-4 h-4" />
        </a>
      </article>

      {rest.length > 0 && (
        <>
          <h3 className="mt-16 text-2xl">Tous les articles</h3>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => {
              const date = formatDate(a.published_at);
              return (
                <article key={a.id} className="card-soft flex flex-col">
                  {(a.category || date) && (
                    <p className="eyebrow mb-2">
                      {a.category}
                      {a.category && date ? " · " : ""}
                      {date}
                    </p>
                  )}
                  <h4 className="text-lg">{a.title}</h4>
                  {a.excerpt && <p className="mt-3 text-sm flex-1">{a.excerpt}</p>}
                  <a href={a.url} target="_blank" rel="noreferrer" className="link-brand mt-5 inline-flex items-center gap-1 text-sm font-semibold">
                    Vers l'article <ArrowRight className="w-4 h-4" />
                  </a>
                </article>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

type Filter = (typeof CATEGORIES)[number] | "all";

function ProjetsContent({ projects }: { projects: ProjectDTO[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );
  const filters: { label: string; value: Filter }[] = [
    { label: "Tous les projets", value: "all" },
    ...CATEGORIES.map((c) => ({ label: c, value: c })),
  ];

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-4 py-2 rounded-full border text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-[color:var(--border)] hover:bg-[color:var(--surface-muted)]",
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 text-center text-[color:var(--muted-foreground)]">
          <p>Aucun projet à afficher pour le moment.</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Link
              key={p.id}
              to="/nos-projets/$projectId"
              params={{ projectId: p.id }}
              className="card-soft overflow-hidden p-0 flex flex-col group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="relative aspect-[4/3] bg-[color:var(--surface-muted)] flex items-center justify-center overflow-hidden">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-[color:var(--muted-foreground)]" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  {p.category && <p className="text-[11px] uppercase tracking-[0.18em] text-white/80">{p.category}</p>}
                  <p className="mt-1 text-white text-base font-medium leading-snug line-clamp-2">{p.title}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
