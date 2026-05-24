import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import sloganImg from "@/assets/slogan-bourquin.png";
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

        <div className="mt-20">
          <GoogleReviewsSection />
        </div>

      </section>


      <SiteFooter />
    </div>
  );
}
