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
      <section className="container-x py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl">Contactez-nous</h1>
          <p className="mt-4 text-xl md:text-2xl text-[color:var(--muted)]">
            Une question ? Un projet ? Nous sommes là.
          </p>
          <p className="mt-6">Utilisez le formulaire ci-dessous pour nous contacter par E-mail.</p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>

        <div className="mt-20">
          <GoogleReviewsSection />
        </div>

      </section>


      <SiteFooter />
    </div>
  );
}
