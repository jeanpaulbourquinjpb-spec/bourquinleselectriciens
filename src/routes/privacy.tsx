import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({ meta: [{ title: "Protection des données — bourquin les électriciens" }] }),
});

function PrivacyPage() {
  return (
    <div>
      <SiteHeader />
      <section className="container-x py-20 max-w-3xl">
        <p className="eyebrow">Confidentialité</p>
        <h1 className="mt-3 text-4xl">Déclaration relative à la protection des données</h1>

        <p className="mt-8">
          Nous attachons une grande importance à la protection de vos données personnelles. Les informations
          collectées via ce site sont traitées de manière confidentielle et conformément à la législation
          suisse en vigueur sur la protection des données (LPD).
        </p>

        <h2 className="mt-10 text-2xl">Cookies</h2>
        <p className="mt-4">
          Ce site utilise des cookies à des fins d'analyse statistique et d'amélioration continue. Vous pouvez
          à tout moment désactiver les cookies dans les paramètres de votre navigateur, partiellement ou en
          totalité.
        </p>

        <h2 className="mt-10 text-2xl">Contact</h2>
        <p className="mt-4">
          Pour toute question relative à vos données personnelles, contactez-nous à{" "}
          <a className="link-brand" href="mailto:info@bourquinelectricite.ch">info@bourquinelectricite.ch</a>.
        </p>
      </section>
      <SiteFooter />
    </div>
  );
}
