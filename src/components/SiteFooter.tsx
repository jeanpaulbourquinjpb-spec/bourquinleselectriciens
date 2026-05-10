import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Linkedin, Facebook, Instagram } from "lucide-react";
import logomark from "@/assets/logomark-bourquin.png";
import slogan from "@/assets/slogan-bourquin.png";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[color:var(--line)] bg-[color:var(--surface-muted)]">
      <div className="container-x pt-12 pb-4 flex justify-center">
        <img src={logomark} alt="" aria-hidden="true" className="h-10 w-auto opacity-80" />
      </div>
      <div className="container-x pb-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold mb-3">bourquin les électriciens</h3>
          <img src={slogan} alt="entre nous, le courant passe…" className="h-5 w-auto" />
          <p className="mt-4 max-w-md text-sm">
            Entreprise d'électricité générale active depuis 60 ans à Genève.
            Solutions innovantes et durables alliant sécurité, confort et efficience énergétique.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <a href="https://ch.linkedin.com/company/bourquin-les-electriciens" target="_blank" rel="noreferrer" className="p-2 rounded-full border border-[color:var(--line)] hover:border-brand hover:text-brand transition" aria-label="LinkedIn"><Linkedin className="w-4 h-4" /></a>
            <a href="https://instagram.com/bourquinleselectriciens/" target="_blank" rel="noreferrer" className="p-2 rounded-full border border-[color:var(--line)] hover:border-brand hover:text-brand transition" aria-label="Instagram"><Instagram className="w-4 h-4" /></a>
            <a href="https://facebook.com/bourquinelectricite/" target="_blank" rel="noreferrer" className="p-2 rounded-full border border-[color:var(--line)] hover:border-brand hover:text-brand transition" aria-label="Facebook"><Facebook className="w-4 h-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Infos pratiques</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><Phone className="w-4 h-4 text-brand shrink-0 mt-0.5" /><a href="tel:0228498333" className="hover:text-brand">022 849 83 33</a></li>
            <li className="flex gap-2"><Mail className="w-4 h-4 text-brand shrink-0 mt-0.5" /><a href="mailto:info@bourquinelectricite.ch" className="hover:text-brand break-all">info@bourquinelectricite.ch</a></li>
            <li className="flex gap-2"><MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" /><a href="https://maps.app.goo.gl/Lupi2EoHQWR2himFA" target="_blank" rel="noreferrer" className="hover:text-brand">Rue Henri-Blanvalet 21<br/>1207 Genève</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Horaires</h4>
          <ul className="space-y-1 text-sm">
            <li>Lun – Ven</li>
            <li className="text-[color:var(--body)]/80">07:30 – 12:00</li>
            <li className="text-[color:var(--body)]/80">13:30 – 16:00</li>
            <li className="pt-2">Sam – Dim <span className="text-brand">Fermé</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[color:var(--line)]">
        <div className="container-x py-6 flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
          <p>© {new Date().getFullYear()} Bourquin Jean-Yves SA — Tous droits réservés.</p>
          <div className="flex gap-5">
            <Link to="/mentions-legales" className="hover:text-brand">Mentions légales</Link>
            <Link to="/privacy" className="hover:text-brand">Protection des données</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
