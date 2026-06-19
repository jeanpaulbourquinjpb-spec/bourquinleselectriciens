import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/mentions-legales")({
  component: MentionsPage,
  head: () => ({
    meta: [{ title: "Mentions légales — bourquin les électriciens" }],
    links: [{ rel: "canonical", href: "https://bourquinelectricite.ch/mentions-legales" }],
  }),
});

function MentionsPage() {
  return (
    <div>
      <SiteHeader />
      <section className="container-x py-20 max-w-3xl">
        <p className="eyebrow">Informations</p>
        <h1 className="mt-3 text-4xl">Mentions légales</h1>

        <dl className="mt-10 grid gap-4">
          <div><dt className="text-brand font-semibold">Nom ou raison sociale</dt><dd>Bourquin Jean-Yves SA</dd></div>
          <div><dt className="text-brand font-semibold">Adresse</dt><dd>Rue Henri-Blanvalet 21, 1207 Genève</dd></div>
          <div><dt className="text-brand font-semibold">Téléphone</dt><dd><a className="link-brand" href="tel:0228498333">022 849 83 33</a></dd></div>
          <div><dt className="text-brand font-semibold">Adresse électronique</dt><dd><a className="link-brand" href="mailto:info@bourquinelectricite.ch">info@bourquinelectricite.ch</a></dd></div>
        </dl>

        <h2 className="mt-12 text-2xl">Informations juridiques</h2>
        <p className="mt-4">
          Ce site Internet utilise des cookies. Les cookies sont de petits fichiers textes qui sont enregistrés
          sur votre ordinateur, lors de la visite du site, de façon temporaire ou durable. Le but des cookies
          est en particulier d'analyser l'utilisation du site, en vue d'une exploitation statistique, ainsi que
          d'améliorations continues. Les cookies peuvent être à tout moment désactivés dans les paramètres de
          votre navigateur web, partiellement ou en totalité. En désactivant les cookies, certaines
          fonctionnalités de ce site peuvent éventuellement ne plus être disponibles.
        </p>

        <p className="mt-10 text-sm">
          © 2024 Réalisé par{" "}
          <a className="link-brand" href="https://www.localsearch.ch/fr" target="_blank" rel="noreferrer">localsearch.ch</a>
        </p>
        <p className="mt-2 text-sm">
          Vers nos inscriptions{" "}
          <a className="link-brand" href="http://yellow.local.ch/d/QbbhlplxqNNLktIM41RMfg" target="_blank" rel="noreferrer">local.ch</a>
        </p>
      </section>
      <SiteFooter />
    </div>
  );
}
