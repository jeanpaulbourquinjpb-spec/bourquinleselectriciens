import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactForm } from "@/components/ContactForm";
import { Phone, Mail, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — bourquin les électriciens à Genève" },
      {
        name: "description",
        content:
          "Contactez bourquin les électriciens à Genève. Rue Henri-Blanvalet 21, 1207 Genève. Tél. 022 849 83 33.",
      },
      { property: "og:title", content: "Contact — bourquin les électriciens" },
      {
        property: "og:description",
        content: "Notre équipe vous répond dans les plus brefs délais.",
      },
    ],
    links: [{ rel: "canonical", href: "https://bourquinelectricite.ch/contact" }],
  }),
});

function ContactPage() {
  return (
    <div>
      <SiteHeader />

      {/* Hero */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-x max-w-4xl">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-[#54544b]">
            Contactez-nous
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#54544b]">
            Notre équipe vous répond dans les plus brefs délais.
          </p>
        </div>
      </section>

      {/* Infos */}
      <section className="py-16 md:py-20" style={{ backgroundColor: "#f9f9f9" }}>
        <div className="container-x grid gap-8 md:grid-cols-3">
          <a
            href="tel:+41228498333"
            className="flex items-start gap-4 rounded-lg bg-white p-6 border border-[color:var(--border)] hover:border-[#ff6633] transition-colors"
          >
            <Phone className="w-6 h-6 text-[#ff6633] shrink-0" />
            <div>
              <p className="text-sm text-[#666666]">Téléphone</p>
              <p className="mt-1 font-medium text-[#54544b]">022 849 83 33</p>
            </div>
          </a>
          <a
            href="mailto:info@bourquinelectricite.ch"
            className="flex items-start gap-4 rounded-lg bg-white p-6 border border-[color:var(--border)] hover:border-[#ff6633] transition-colors"
          >
            <Mail className="w-6 h-6 text-[#ff6633] shrink-0" />
            <div>
              <p className="text-sm text-[#666666]">Email</p>
              <p className="mt-1 font-medium text-[#54544b] break-all">
                info@bourquinelectricite.ch
              </p>
            </div>
          </a>
          <div className="flex items-start gap-4 rounded-lg bg-white p-6 border border-[color:var(--border)]">
            <MapPin className="w-6 h-6 text-[#ff6633] shrink-0" />
            <div>
              <p className="text-sm text-[#666666]">Adresse</p>
              <p className="mt-1 font-medium text-[#54544b]">
                Rue Henri-Blanvalet 21
                <br />
                1207 Genève
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section className="bg-white py-20 md:py-24">
        <div className="container-x max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#54544b]">
            Écrivez-nous
          </h2>
          <p className="mt-4 text-[#54544b]">
            Utilisez le formulaire ci-dessous pour nous contacter par E-mail.
          </p>
          <div className="mt-10">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Carte */}
      <section className="pb-20 md:pb-24">
        <div className="container-x">
          <div className="rounded-lg overflow-hidden border border-[color:var(--border)]">
            <iframe
              title="Carte — bourquin les électriciens"
              src="https://www.google.com/maps?q=Rue+Henri-Blanvalet+21,+1207+Gen%C3%A8ve&output=embed"
              width="100%"
              height="450"
              style={{ border: 0, display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
