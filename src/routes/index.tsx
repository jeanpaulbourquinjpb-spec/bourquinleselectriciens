import { useEffect, useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { GoogleReviewsSection } from "@/components/GoogleReviewsSection";
import { PartnersCarousel } from "@/components/PartnersCarousel";
import { SponsoringSection } from "@/components/SponsoringSection";
import { listSponsoringEntries } from "@/lib/sponsoring.functions";
import { ProjectGalleryCard } from "@/components/ProjectGalleryCard";
import { ContactForm } from "@/components/ContactForm";
import { ActualiteSection } from "@/components/ActualiteSection";
import {
  Lightbulb, Shield, Tv, Wrench, Zap, Network, ClipboardCheck, HeadphonesIcon,
  ArrowRight, FileText, Phone, Mail, MapPin, Clock, Linkedin, Facebook, Instagram, ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GoogleRatingBadge } from "@/components/GoogleRatingBadge";
import sloganImg from "@/assets/slogan-bourquin.png";
import heroImg from "@/assets/hero.png";
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
const sponsoringQueryOptions = queryOptions({
  queryKey: ["sponsoring-entries"],
  queryFn: () => listSponsoringEntries(),
});

export const Route = createFileRoute("/")({
  component: HomePage,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(articlesQueryOptions),
      context.queryClient.ensureQueryData(projectsQueryOptions),
      context.queryClient.ensureQueryData(sponsoringQueryOptions),
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
  const { data: sponsoringData } = useSuspenseQuery(sponsoringQueryOptions);

  return (
    <div>
      <SiteHeader />

      <section id="accueil" className="scroll-mt-20 relative w-full overflow-hidden">

        <img
          src={heroImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
        <div className="relative container-x py-24 md:py-36 text-white">
          <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: "#ff6633" }}>
            GENÈVE DEPUIS 1968
          </p>
          <h1 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span style={{ color: "#ff6633" }}>bourquin</span>{" "}
            <span className="text-white">les électriciens</span>
          </h1>
          <p className="mt-5 text-xl md:text-2xl italic" style={{ color: "#ff6633" }}>
            entre nous, le courant passe…
          </p>
          <p className="mt-4 text-base md:text-lg text-white">
            Électricité · Télécom · Sécurité · Domotique · Dépannage
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <GoogleRatingBadge />
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/25 px-4 py-2 text-sm font-medium text-white">
              Trois générations de savoir-faire
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#contact" className="btn-brand">
              Contactez-nous
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/70 px-5 py-2.5 text-sm font-medium text-white hover:bg-white hover:text-black transition-colors"
            >
              Nos services
            </a>
          </div>
        </div>
      </section>

      <section className="pt-16">
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
              Nos engagements sportifs aux côtés des équipes et événements qui nous tiennent à cœur.
            </p>
          </div>
          <SponsoringSection entries={sponsoringData.entries} />
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
          <ActualiteSection articles={articlesData.articles} />
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

        </div>

        <GoogleReviewsSection />

        <SiteFooter />
      </section>
    </div>
  );
}

/* ----------------------------- Sub-sections ----------------------------- */

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
            <ProjectGalleryCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </>
  );
}
