import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo-bourquin.png";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const nav = [
    { to: "/", label: "Accueil" },
    { to: "/presentation", label: "Présentation" },
    { to: "/services", label: "Services" },
    { to: "/actualite", label: "Actualité" },
    { to: "/nos-projets", label: "Nos Projets" },
    { to: "/contact", label: "Contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-[color:var(--line)]">
      <div className="container-x flex items-center justify-between h-20">
        <Link to="/" className="flex items-center" aria-label="bourquin les électriciens">
          <img src={logo} alt="bourquin les électriciens" className="h-12 md:h-14 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium hover:text-brand transition-colors"
              activeProps={{ className: "text-brand" }}
            >
              {n.label}
            </Link>
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
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-1 text-sm font-medium"
                activeProps={{ className: "text-brand" }}
              >
                {n.label}
              </Link>
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
