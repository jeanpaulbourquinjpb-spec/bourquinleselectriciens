import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactForm } from "@/components/ContactForm";
import { GoogleReviewsSection } from "@/components/GoogleReviewsSection";

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

      <section id="contact" className="scroll-mt-20 bg-[color:var(--surface-muted)]">
        <div className="container-x py-24">
          <p className="eyebrow">Infos pratiques</p>
          <h2 className="mt-3 text-4xl md:text-5xl">Contactez-nous</h2>
          <div className="mt-12 max-w-3xl">
            <p className="text-xl md:text-2xl text-[color:var(--muted-foreground)]">
              Une question ? Un projet ? Nous sommes là.
            </p>
            <p className="mt-6">Utilisez le formulaire ci-dessous pour nous contacter par email.</p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>

        <GoogleReviewsSection />
      </section>

      <SiteFooter />
    </div>
  );
}
