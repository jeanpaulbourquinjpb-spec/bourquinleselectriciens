import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [{ title: "Connexion — bourquin les électriciens" }, { name: "robots", content: "noindex" }],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin/projets" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin/projets` },
        });
        if (error) throw error;
        toast.success("Compte créé. Vous pouvez vous connecter.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin/projets" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur d'authentification");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SiteHeader />
      <section className="py-24">
        <div className="container-x max-w-md">
          <p className="eyebrow">Espace administrateur</p>
          <h1 className="mt-2 text-3xl">{mode === "signin" ? "Connexion" : "Créer un compte"}</h1>
          <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">
            Réservé à l'administrateur du site.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Patientez…" : mode === "signin" ? "Se connecter" : "Créer le compte"}
            </Button>
          </form>
          <p className="mt-6 text-sm text-[color:var(--muted-foreground)]">
            {mode === "signin" ? (
              <>
                Premier accès ?{" "}
                <button onClick={() => setMode("signup")} className="underline">
                  Créer un compte
                </button>{" "}
                (le premier compte créé devient administrateur).
              </>
            ) : (
              <button onClick={() => setMode("signin")} className="underline">
                J'ai déjà un compte
              </button>
            )}
          </p>
          <p className="mt-8 text-xs text-[color:var(--muted-foreground)]">
            <Link to="/">Retour au site</Link>
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
