import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo-bourquin.png";

const sections = [
  { hash: "accueil", label: "Accueil" },
  { hash: "a-propos", label: "À propos" },
  { hash: "services", label: "Services" },
  { hash: "actualite", label: "Actualité" },
  { hash: "nos-projets", label: "Nos Projets" },
  { hash: "contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("accueil");
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
    sections.forEach((s) => {
      const el = document.getElementById(s.hash);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  const handleClick = (e: React.MouseEvent, hash: string) => {
    setOpen(false);
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${hash}`);
        setActive(hash);
      }
    } else {
      e.preventDefault();
      navigate({ to: "/", hash });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-[color:var(--line)]">
      <div className="container-x flex items-center justify-between h-20">
        <a href="/#accueil" onClick={(e) => handleClick(e, "accueil")} className="flex items-center" aria-label="bourquin les électriciens">
          <img src={logo} alt="bourquin les électriciens" className="h-12 md:h-14 w-auto" />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {sections.map((s) => (
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
          ))}
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
            {sections.map((s) => (
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
            ))}
            <a href="tel:0228498333" className="btn-brand w-fit mt-2">
              <Phone className="w-4 h-4" /> 022 849 83 33
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
