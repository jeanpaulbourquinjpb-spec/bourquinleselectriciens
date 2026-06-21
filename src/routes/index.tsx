import { useEffect, useState, useMemo, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PartnersCarousel } from "@/components/PartnersCarousel";
import { SponsoringSection } from "@/components/SponsoringSection";
import { listSponsoringEntries } from "@/lib/sponsoring.functions";
import { ProjectGalleryCard } from "@/components/ProjectGalleryCard";
import { ActualiteSection } from "@/components/ActualiteSection";
import {
  Lightbulb, Shield, Tv, Wrench, Zap, Network, ClipboardCheck, HeadphonesIcon,
  Home, BatteryCharging,
  ArrowRight, Phone, Mail, MapPin, Clock, Linkedin, Facebook, Instagram, ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GoogleRatingBadge } from "@/components/GoogleRatingBadge";

import heroImg from "@/assets/hero.webp";
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
    context.queryClient.prefetchQuery(articlesQueryOptions);
    await Promise.all([
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
    links: [
      { rel: "preload", as: "image", href: heroImg, fetchpriority: "high" },
      { rel: "canonical", href: "https://bourquinelectricite.ch/" },
    ],
  }),
});

/* ----------------------------- Data ----------------------------- */

const services = [
  { icon: ClipboardCheck, title: "Étude, conseil & contrôle", text: "Analyse, conception et contrôle de vos installations électriques par notre équipe d'experts certifiés." },
  { icon: HeadphonesIcon, title: "Maintenance & dépannage", text: "Intervention rapide et entretien régulier de tous types d'installations électriques." },
  { icon: Wrench, title: "Rénovation", text: "Modernisation de vos installations existantes, mise aux normes et rénovation complète d'appartements et bâtiments." },
  { icon: Lightbulb, title: "Éclairage", text: "Confort lumineux : technique électrique qui économise du temps, accroît le confort et permet une ambiance lumineuse parfaite sur pression d'un bouton." },
  { icon: Zap, title: "Efficience énergétique", text: "Solutions électriques durables pour votre sécurité, votre confort et votre efficience énergétique. Partenaire éco21 certifié." },
  { icon: Network, title: "Télécommunications", text: "Câblage cuivre et fibre, réseaux informatiques, téléphonie. Partenaire Swisscom Business Gold." },
  { icon: Shield, title: "Sécurité", text: "Installations haute technologie : contrôle d'accès, vidéosurveillance, interphonie, biométrie." },
  { icon: Home, title: "Domotique", text: "Confort intelligent : pilotez l'éclairage, les stores, le chauffage et la sécurité de votre bâtiment depuis un seul système, compatible avec les grands écosystèmes connectés." },
  { icon: BatteryCharging, title: "E-Mobility", text: "Installation de bornes de recharge pour véhicules électriques, adaptées à votre usage résidentiel, commercial ou collectif." },
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
  const { data: articlesData, isLoading: articlesLoading } = useQuery(articlesQueryOptions);
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
          loading="eager"
          fetchPriority="high"
          decoding="async"
          sizes="100vw"
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

          <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap items-start gap-3">
            <a
              href="https://www.google.com/maps/place/?q=place_id:ChIJfS2J5zZljEcREXY9RXGNl_I"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer inline-flex"
            >
              <GoogleRatingBadge />
            </a>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/25 px-4 py-2 text-sm font-medium text-white">
              Trois générations de savoir-faire
            </span>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <Link to="/contact" className="btn-brand justify-center sm:justify-start">
              Contactez-nous
            </Link>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/70 px-5 py-2.5 text-sm font-medium text-white hover:bg-white hover:text-black transition-colors"
            >
              Nos services
            </a>
          </div>
        </div>
      </section>

      {/* ============================== À PROPOS ============================== */}
      <section id="a-propos" className="scroll-mt-20">
        <div className="container-x py-24">
          <p className="eyebrow">Présentation</p>
          <h2 className="mt-3 text-3xl md:text-5xl">bourquin les électriciens à Genève</h2>
          <p className="mt-6 text-lg max-w-3xl">
            Entreprise d'électricité générale active depuis 1968 à Genève.
          </p>
          <p className="mt-6 max-w-3xl">
            Fondée à Genève en 1968, l'entreprise familiale incarne 3 générations de savoir-faire et de passion.
            Elle perpétue cet héritage tout en adoptant une vision moderne et dynamique. Elle offre des solutions
            innovantes et durables, alliant sécurité, confort, et efficience énergétique, à une clientèle
            institutionnelle, commerciale et privée.
          </p>
        </div>

        <div className="pt-8 pb-16">
          <PartnersCarousel />
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
            {services.map((s) => {
              const isDepannage = s.title === "Maintenance & dépannage";
              const isRenovation = s.title === "Rénovation";
              const isEtude = s.title === "Étude, conseil & contrôle";
              const isEclairage = s.title === "Éclairage";
              const isEfficience = s.title === "Efficience énergétique";
              const isTelecom = s.title === "Télécommunications";
              const isSecurite = s.title === "Sécurité";
              const isDomotique = s.title === "Domotique";
              const isEMobility = s.title === "E-Mobility";
              const content = (
                <>
                  <s.icon className="w-7 h-7 text-brand" />
                  <h3 className="mt-5 text-xl">{s.title}</h3>
                  <p className="mt-2 text-sm">{s.text}</p>
                </>
              );
              if (isDepannage) {
                return (
                  <Link key={s.title} to="/depannage" className="card-soft block no-underline min-h-48 md:min-h-56">
                    {content}
                  </Link>
                );
              }
              if (isRenovation) {
                return (
                  <Link key={s.title} to="/renovation" className="card-soft block no-underline min-h-48 md:min-h-56">
                    {content}
                  </Link>
                );
              }
              if (isEtude) {
                return (
                  <Link key={s.title} to="/etude-conseil-controle" className="card-soft block no-underline min-h-48 md:min-h-56">
                    {content}
                  </Link>
                );
              }
              if (isEclairage) {
                return (
                  <Link key={s.title} to="/eclairage" className="card-soft block no-underline min-h-48 md:min-h-56">
                    {content}
                  </Link>
                );
              }
              if (isEfficience) {
                return (
                  <Link key={s.title} to="/efficience-energetique" className="card-soft block no-underline min-h-48 md:min-h-56">
                    {content}
                  </Link>
                );
              }
              if (isTelecom) {
                return (
                  <Link key={s.title} to="/telecoms" className="card-soft block no-underline min-h-48 md:min-h-56">
                    {content}
                  </Link>
                );
              }
              if (isSecurite) {
                return (
                  <Link key={s.title} to="/securite" className="card-soft block no-underline min-h-48 md:min-h-56">
                    {content}
                  </Link>
                );
              }
              if (isDomotique) {
                return (
                  <Link key={s.title} to="/domotique" className="card-soft block no-underline min-h-48 md:min-h-56">
                    {content}
                  </Link>
                );
              }
              if (isEMobility) {
                return (
                  <Link key={s.title} to="/e-mobility" className="card-soft block no-underline min-h-48 md:min-h-56">
                    {content}
                  </Link>
                );
              }
              return (
                <article key={s.title} className="card-soft min-h-48 md:min-h-56">
                  {content}
                </article>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============================== ACTUALITÉ ============================== */}
      <section id="actualite" className="scroll-mt-20 bg-[color:var(--surface-muted)]">
        <div className="container-x py-24">
          <p className="eyebrow">Notre actualité</p>
          <h2 className="mt-2 text-3xl md:text-5xl">À la une</h2>
          <ActualiteSection articles={articlesData?.articles ?? []} isLoading={articlesLoading} />
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

      <SiteFooter />
    </div>
  );
}

/* ----------------------------- Sub-sections ----------------------------- */

type Filter = (typeof CATEGORIES)[number] | "all";

function ProjetsContent({ projects }: { projects: ProjectDTO[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const isMobile = useIsMobile();
  const filtered = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );
  const availableCategories = useMemo(
    () => CATEGORIES.filter((c) => projects.some((p) => p.category === c)),
    [projects],
  );
  const filters: { label: string; value: Filter }[] = [
    { label: "Tous les projets", value: "all" },
    ...availableCategories.map((c) => ({ label: c, value: c })),
  ];

  // Desktop shows max 6; mobile carousel (filter=all) shows up to 6 swipeable
  const useCarousel = isMobile && filter === "all";
  const displayed = useCarousel ? filtered.slice(0, 6) : filtered.slice(0, 6);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (!useCarousel) return;
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setActiveSlide(i);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [useCarousel]);

  const scrollToSlide = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <>
      <div className="relative mt-10 -mx-4 md:mx-0">
        <div className="flex gap-2 overflow-x-auto md:flex-wrap px-4 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "shrink-0 whitespace-nowrap px-4 py-2 rounded-full border text-sm transition-colors",
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
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent md:hidden" />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 text-center text-[color:var(--muted-foreground)]">
          <p>Aucun projet à afficher pour le moment.</p>
        </div>
      ) : useCarousel ? (
        <div className="mt-10">
          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {displayed.map((p) => (
              <div key={p.id} className="snap-center shrink-0 w-full">
                <ProjectGalleryCard p={p} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {displayed.map((_, i) => (
              <button
                key={i}
                aria-label={`Aller au projet ${i + 1}`}
                onClick={() => scrollToSlide(i)}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  i === activeSlide ? "bg-[#ff6633]" : "bg-[color:var(--border)]",
                )}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((p) => (
            <ProjectGalleryCard key={p.id} p={p} />
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link
          to="/projets"
          className="inline-flex items-center justify-center px-6 py-3 rounded-md border text-sm font-medium transition-colors border-[#ff6633] text-[#ff6633] bg-transparent hover:bg-[#ff6633] hover:text-white"
        >
          Voir tous nos projets
        </Link>
      </div>
    </>
  );
}
