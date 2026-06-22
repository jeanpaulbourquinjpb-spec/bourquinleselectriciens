import { useRouterState, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import logo from "@/assets/logo-bourquin.png";

type NavItem =
  | { type: "hash"; hash: string; label: string }
  | { type: "route"; to: string; label: string }
  | { type: "dropdown"; label: string; items: { to: string; label: string }[] };

const servicesItems = [
  { to: "/etude-conseil-controle", label: "Étude, conseil & contrôle" },
  { to: "/depannage", label: "Maintenance & dépannage" },
  { to: "/renovation", label: "Rénovation" },
  { to: "/eclairage", label: "Éclairage" },
  { to: "/efficience-energetique", label: "Efficience énergétique" },
  { to: "/telecoms", label: "Télécommunications" },
  { to: "/securite", label: "Sécurité" },
  { to: "/domotique", label: "Domotique" },
  { to: "/e-mobility", label: "E-Mobility" },
];

const sections: readonly NavItem[] = [
  { type: "hash", hash: "accueil", label: "Accueil" },
  { type: "hash", hash: "a-propos", label: "À propos" },
  { type: "dropdown", label: "Services", items: servicesItems },
  { type: "route", to: "/actualites", label: "Actualité" },
  { type: "route", to: "/projets", label: "Nos projets" },
  { type: "route", to: "/carrieres", label: "Carrières" },
  { type: "route", to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("accueil");
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    const ids = ["accueil", "a-propos", "services", "actualite", "nos-projets"];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  const handleClick = (e: React.MouseEvent, hash: string) => {
    setOpen(false);
    if (isHome) {
      e.preventDefault();
      const el = document.querySelector(`#${hash}`);
      if (el) {
        el.scrollIntoView({ behavior: "instant", block: "start" });
        history.replaceState(null, "", `#${hash}`);
        setActive(hash);
      }
    } else {
      e.preventDefault();
      navigate({ to: "/", hash });
    }
  };

  const isRouteActive = (to: string) =>
    pathname === to || pathname.startsWith(to + "/");

  const serviceRoutes = [
    "/services",
    "/etude-conseil-controle",
    "/depannage",
    "/renovation",
    "/eclairage",
    "/efficience-energetique",
    "/telecoms",
    "/securite",
    "/domotique",
    "/e-mobility",
  ];

  const isServicesActive =
    serviceRoutes.some((route) => isRouteActive(route)) ||
    (isHome && active === "services");

  const routeToSectionId: Record<string, string> = {
    "/actualites": "actualite",
    "/projets": "nos-projets",
  };
  const isRouteNavActive = (to: string) =>
    isRouteActive(to) || (isHome && active === routeToSectionId[to]);

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-[color:var(--line)]">
      <div className="container-x flex items-center justify-between h-20">
        <a href="/#accueil" onClick={(e) => handleClick(e, "accueil")} className="flex items-center" aria-label="bourquin les électriciens">
          <img src={logo} alt="bourquin les électriciens" className="h-12 md:h-14 w-auto" />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {sections.map((s) => {
            if (s.type === "hash") {
              return (
                <a
                  key={s.hash}
                  href={`/#${s.hash}`}
                  onClick={(e) => handleClick(e, s.hash)}
                  className={`text-sm font-medium transition-colors ${
                    isHome && active === s.hash ? "text-brand" : "hover:text-brand"
                  }`}
                >
                  {s.label}
                </a>
              );
            }
            if (s.type === "route") {
              return (
                <Link
                  key={s.to}
                  to={s.to}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium transition-colors ${
                    isRouteActive(s.to) ? "text-brand" : "hover:text-brand"
                  }`}
                >
                  {s.label}
                </Link>
              );
            }
            return (
              <div
                key={s.label}
                ref={servicesRef}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <div className="flex items-center gap-1">
                  <a
                    href="/#services"
                    onClick={(e) => handleClick(e, "services")}
                    className={`text-sm font-medium transition-colors ${
                      isServicesActive ? "text-brand" : "hover:text-brand"
                    }`}
                  >
                    {s.label}
                  </a>
                  <button
                    type="button"
                    onClick={() => setServicesOpen((v) => !v)}
                    className={`flex items-center text-sm font-medium transition-colors ${
                      isServicesActive ? "text-brand" : "hover:text-brand"
                    }`}
                    aria-haspopup="true"
                    aria-expanded={servicesOpen}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
                <div
                  className={`absolute left-0 top-full pt-2 transition-all duration-200 ${
                    servicesOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-1 pointer-events-none"
                  }`}
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                >
                  <div className="min-w-[240px] rounded-lg bg-white shadow-lg border border-gray-100 py-2">
                    {s.items.map((it) => {
                      const isActive = pathname === it.to;
                      return (
                        <Link
                          key={it.to}
                          to={it.to}
                          onClick={() => setServicesOpen(false)}
                          className={`block py-2 px-4 text-sm font-medium transition-colors hover:bg-[#fff5f2] hover:text-[#ff6633] ${
                            isActive
                              ? "text-[#ff6633] bg-[#fff5f2] border-l-2 border-[#ff6633]"
                              : ""
                          }`}
                          style={{ color: isActive ? undefined : "#54544b" }}
                        >
                          {it.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          <a href="tel:0228498333" className="btn-brand">
            <Phone className="w-4 h-4" /> 022 849 83 33
          </a>
        </nav>

        <button
          className="md:hidden p-2 text-brand"
          aria-label="Menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-[color:var(--line)]">
          <div className="container-x py-4 flex flex-col gap-3">
            {sections.map((s) => {
              if (s.type === "hash") {
                return (
                  <a
                    key={s.hash}
                    href={`/#${s.hash}`}
                    onClick={(e) => handleClick(e, s.hash)}
                    className={`py-1 text-sm font-medium ${
                      isHome && active === s.hash ? "text-brand" : ""
                    }`}
                  >
                    {s.label}
                  </a>
                );
              }
              if (s.type === "route") {
                return (
                  <Link
                    key={s.to}
                    to={s.to}
                    onClick={() => setOpen(false)}
                    className={`py-1 text-sm font-medium ${
                      isRouteActive(s.to) ? "text-brand" : ""
                    }`}
                  >
                    {s.label}
                  </Link>
                );
              }
              return (
                <div key={s.label} className="flex flex-col">
                  <div className="flex items-center justify-between py-1">
                    <a
                      href="/#services"
                      onClick={(e) => handleClick(e, "services")}
                      className={`flex-1 text-sm font-medium ${
                        isServicesActive ? "text-brand" : ""
                      }`}
                    >
                      {s.label}
                    </a>
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen((v) => !v)}
                      className={`p-1 ${
                        isServicesActive ? "text-brand" : ""
                      }`}
                      aria-expanded={mobileServicesOpen}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                  {mobileServicesOpen && (
                    <div
                      className="mt-1 ml-2 flex flex-col rounded-lg bg-white shadow-lg border border-gray-100 py-2"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                    >
                      {s.items.map((it) => {
                        const isActive = pathname === it.to;
                        return (
                          <Link
                            key={it.to}
                            to={it.to}
                            onClick={() => {
                              setMobileServicesOpen(false);
                              setOpen(false);
                            }}
                            className={`block py-2 px-4 text-sm font-medium transition-colors hover:bg-[#fff5f2] hover:text-[#ff6633] ${
                              isActive
                                ? "text-[#ff6633] bg-[#fff5f2] border-l-2 border-[#ff6633]"
                                : ""
                            }`}
                            style={{ color: isActive ? undefined : "#54544b" }}
                          >
                            {it.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            <a href="tel:0228498333" className="btn-brand w-fit mt-2">
              <Phone className="w-4 h-4" /> 022 849 83 33
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
