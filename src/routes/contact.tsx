import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Phone, Mail, MapPin, Clock, Linkedin, Facebook, Instagram, FileText } from "lucide-react";
import sloganImg from "@/assets/slogan-bourquin.png";
import { ContactForm } from "@/components/ContactForm";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — bourquin les électriciens à Genève" },
      { name: "description", content: "Contactez bourquin les électriciens à Genève. Rue Henri-Blanvalet 21, 1207 Genève. Tél. 022 849 83 33." },
    ],
  }),
});

function ContactPage() {
  return (
    <div>
      <SiteHeader />
      <section className="container-x py-20">
        <p className="eyebrow">Infos pratiques</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Contact</h1>
        <img src={sloganImg} alt="entre nous, le courant passe…" className="mt-5 h-6 md:h-7 w-auto" />

        <div className="mt-12 max-w-3xl">
          <p className="eyebrow">Écrivez-nous</p>
          <h2 className="mt-3 text-3xl md:text-4xl">Formulaire de contact</h2>
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
                  <h2 className="text-lg">Téléphone</h2>
                  <a href="tel:0228498333" className="link-brand text-base mt-1 inline-block">022 849 83 33</a>
                </div>
              </div>
            </div>

            <div className="card-soft">
              <div className="flex gap-4">
                <Mail className="w-6 h-6 text-brand shrink-0" />
                <div>
                  <h2 className="text-lg">E-mail</h2>
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
                  <h2 className="text-lg">Adresse</h2>
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
                  <h2 className="text-lg">Horaires</h2>
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
      </section>

      <section className="container-x pb-20">
        <p className="eyebrow">Écrivez-nous</p>
        <h2 className="mt-3 text-3xl md:text-4xl">Formulaire de contact</h2>
        <div className="mt-8 max-w-3xl">
          <ContactForm />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
