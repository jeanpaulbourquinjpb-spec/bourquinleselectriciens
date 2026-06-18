import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ExternalLink, FileText } from "lucide-react";

type Job = {
  id: string;
  title: string;
  category: "cadre" | "technicien" | "apprentissage" | "admin" | null;
  contract_type: "CDI" | "CDD" | "Apprentissage" | null;
  description: string | null;
  requirements: string | null;
  pdf_url: string | null;
  is_active: boolean;
  published_at: string;
};

const CATEGORY_LABELS: Record<NonNullable<Job["category"]>, string> = {
  cadre: "Cadres & Chefs de projet",
  technicien: "Techniciens",
  apprentissage: "Apprentissage",
  admin: "Administration",
};

const FILTERS: Array<{ key: "all" | NonNullable<Job["category"]>; label: string }> = [
  { key: "all", label: "Tous" },
  { key: "cadre", label: "Cadres & Chefs de projet" },
  { key: "technicien", label: "Techniciens" },
  { key: "apprentissage", label: "Apprentissage" },
  { key: "admin", label: "Administration" },
];

export const Route = createFileRoute("/carrieres")({
  component: CarrieresPage,
  head: () => ({
    meta: [
      { title: "Carrières — bourquin les électriciens" },
      {
        name: "description",
        content:
          "Rejoignez bourquin les électriciens à Genève. Offres d'emploi, apprentissage CFC électricien et candidatures spontanées.",
      },
      { property: "og:title", content: "Carrières — bourquin les électriciens" },
      {
        property: "og:description",
        content:
          "Rejoignez une entreprise formatrice genevoise depuis 1968. Offres d'emploi et apprentissage en électricité.",
      },
    ],
  }),
});

function CarrieresPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [selected, setSelected] = useState<Job | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select(
          "id, title, category, contract_type, description, requirements, pdf_url, is_active, published_at",
        )
        .eq("is_active", true)
        .order("published_at", { ascending: false });
      if (cancelled) return;
      if (error) console.error("listJobs error:", error);
      setJobs((data ?? []) as Job[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? jobs : jobs.filter((j) => j.category === filter)),
    [jobs, filter],
  );

  function scrollToApply() {
    setSelected(null);
    setTimeout(() => {
      const el = document.getElementById("candidature");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  return (
    <div>
      <SiteHeader />

      {/* Bloc 1 — Entreprise formatrice */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-x max-w-4xl">
          <p className="eyebrow">Carrières</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-[#54544b]">
            Rejoignez l'équipe
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-[#54544b]">
            Depuis 1968, bourquin les électriciens forme et fait grandir ses
            collaborateurs. Reconnue en 2008 parmi les meilleures entreprises
            formatrices du secteur Construction à Genève, l'entreprise accompagne
            chaque année des apprentis dans la filière CFC électricien de montage,
            avec la possibilité en 3ème année d'une année complémentaire pour
            obtenir le titre d'installateur électricien. Rejoindre notre équipe,
            c'est intégrer une structure à taille humaine, avec des projets variés
            et une culture du métier bien faite.
          </p>
          <a
            href="https://youtu.be/fpUZ6m_wAEs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 mt-6 text-sm text-[#666666] underline underline-offset-4 hover:text-[#ff6633] transition-colors"
          >
            Découvrir les métiers de l'électricité
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Bloc 2 — Offres actives */}
      <section className="py-20 md:py-24" style={{ backgroundColor: "#f9f9f9" }}>
        <div className="container-x">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#54544b]">
            Nos offres d'emploi
          </h2>

          <div className="mt-8 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={
                  "px-4 py-2 rounded-full text-sm font-medium border transition-colors " +
                  (filter === f.key
                    ? "bg-[#ff6633] text-white border-[#ff6633]"
                    : "bg-white text-[#54544b] border-[color:var(--border)] hover:border-[#ff6633] hover:text-[#ff6633]")
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="mt-10">
            {loading ? (
              <Loader2 className="animate-spin text-[#ff6633]" />
            ) : jobs.length === 0 ? (
              <p className="text-[#54544b]">
                Aucun poste ouvert actuellement. Déposez une candidature spontanée
                ci-dessous.
              </p>
            ) : filtered.length === 0 ? (
              <p className="text-[#54544b]">
                Aucune offre dans cette catégorie pour le moment.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((job) => (
                  <article
                    key={job.id}
                    className="bg-white rounded-lg p-6 border border-[color:var(--border)] flex flex-col"
                  >
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.category && (
                        <span className="px-2.5 py-1 rounded-full bg-[#54544b]/10 text-[#54544b] text-xs font-medium">
                          {CATEGORY_LABELS[job.category]}
                        </span>
                      )}
                      {job.contract_type && (
                        <span className="px-2.5 py-1 rounded-full bg-[#ff6633]/10 text-[#ff6633] text-xs font-medium">
                          {job.contract_type}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-[#54544b] mb-2">
                      {job.title}
                    </h3>
                    <p className="text-xs text-[#666666] mb-5">
                      Publié le{" "}
                      {new Date(job.published_at).toLocaleDateString("fr-CH", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <Button
                      type="button"
                      onClick={() => setSelected(job)}
                      className="mt-auto bg-[#ff6633] hover:bg-[#e55a2b] text-white"
                    >
                      Voir le détail
                    </Button>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bloc 3 — Candidature spontanée */}
      <section id="candidature" className="bg-white py-20 md:py-28">
        <div className="container-x max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#54544b]">
            Candidature spontanée
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[#54544b]">
            Vous ne trouvez pas le poste qui vous correspond ? Envoyez nous votre
            CV et lettre de motivation directement par email. Nous lisons chaque
            candidature.
          </p>
          <a
            href="mailto:rh@bourquinelectricite.ch?subject=Candidature%20spontan%C3%A9e"
            className="inline-flex items-center justify-center mt-8 px-8 py-3 rounded-md font-medium text-white transition-colors"
            style={{ backgroundColor: "#ff6633" }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e55a2b")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff6633")}
          >
            Envoyer ma candidature
          </a>
          <p className="mt-4 text-sm" style={{ color: "#666666" }}>
            Joignez votre CV et lettre de motivation en PDF à votre email.
          </p>
        </div>
      </section>

      <SiteFooter />

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selected.category && (
                    <span className="px-2.5 py-1 rounded-full bg-[#54544b]/10 text-[#54544b] text-xs font-medium">
                      {CATEGORY_LABELS[selected.category]}
                    </span>
                  )}
                  {selected.contract_type && (
                    <span className="px-2.5 py-1 rounded-full bg-[#ff6633]/10 text-[#ff6633] text-xs font-medium">
                      {selected.contract_type}
                    </span>
                  )}
                </div>
                <DialogTitle className="text-2xl text-[#54544b]">
                  {selected.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4 text-[#54544b]">
                {selected.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="whitespace-pre-line leading-relaxed">
                      {selected.description}
                    </p>
                  </div>
                )}
                {selected.requirements && (
                  <div>
                    <h4 className="font-semibold mb-2">Exigences</h4>
                    <p className="whitespace-pre-line leading-relaxed">
                      {selected.requirements}
                    </p>
                  </div>
                )}
                {selected.pdf_url && (
                  <a
                    href={selected.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[#ff6633] underline underline-offset-4 hover:text-[#e55a2b]"
                  >
                    <FileText className="w-4 h-4" /> Télécharger l'annonce (PDF)
                  </a>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  type="button"
                  onClick={scrollToApply}
                  className="bg-[#ff6633] hover:bg-[#e55a2b] text-white"
                >
                  Postuler
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
