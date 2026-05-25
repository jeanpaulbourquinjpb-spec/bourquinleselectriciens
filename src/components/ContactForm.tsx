import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitContactForm } from "@/lib/contact.functions";

const MAX_TOTAL_MB = 8;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ContactForm() {
  const submit = useServerFn(submitContactForm);
  const [hasAltAddress, setHasAltAddress] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    const totalBytes = files.reduce((s, f) => s + f.size, 0);
    if (totalBytes > MAX_TOTAL_MB * 1024 * 1024) {
      setError(`Les pièces jointes dépassent ${MAX_TOTAL_MB} Mo au total.`);
      return;
    }

    setSubmitting(true);
    try {
      const attachments = await Promise.all(
        files.map(async (f) => ({ name: f.name, content: await fileToBase64(f) })),
      );

      await submit({
        data: {
          nom: String(fd.get("nom") || ""),
          prenom: String(fd.get("prenom") || ""),
          adresse: String(fd.get("adresse") || ""),
          codePostal: String(fd.get("codePostal") || ""),
          etage: String(fd.get("etage") || ""),
          adresseCorrespondance: hasAltAddress ? String(fd.get("adresseCorrespondance") || "") : "",
          email: String(fd.get("email") || ""),
          telephone: String(fd.get("telephone") || ""),
          message: String(fd.get("message") || ""),
          numeroCompteur: String(fd.get("numeroCompteur") || ""),
          gdpr: true as const,
          attachments,
        },
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="card-soft">
        <p className="text-brand text-lg font-medium">
          Merci ! Nous avons bien reçu votre message et vous répondrons rapidement.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-brand/40";
  const labelCls = "block text-sm mb-1.5";

  return (
    <form onSubmit={onSubmit} className="space-y-5">


      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="nom">Nom *</label>
          <input id="nom" name="nom" required maxLength={100} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="prenom">Prénom *</label>
          <input id="prenom" name="prenom" required maxLength={100} className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="adresse">Adresse et numéro *</label>
        <input id="adresse" name="adresse" required maxLength={255} className={inputCls} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="codePostal">Code postal et commune *</label>
          <input id="codePostal" name="codePostal" required maxLength={150} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="etage">Étage et local *</label>
          <input id="etage" name="etage" required maxLength={150} className={inputCls} />
        </div>
      </div>

      <div className="flex items-start gap-2">
        <input
          id="altAddr"
          type="checkbox"
          checked={hasAltAddress}
          onChange={(e) => setHasAltAddress(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[color:var(--brand)]"
        />
        <label htmlFor="altAddr" className="text-sm">Adresse de correspondance différente ?</label>
      </div>

      {hasAltAddress && (
        <div>
          <label className={labelCls} htmlFor="adresseCorrespondance">Adresse de correspondance</label>
          <input
            id="adresseCorrespondance"
            name="adresseCorrespondance"
            maxLength={500}
            className={inputCls}
          />
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" required maxLength={255} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="telephone">Téléphone *</label>
          <input id="telephone" name="telephone" required maxLength={50} className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="message">Votre message *</label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={5000}
          rows={6}
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls} htmlFor="numeroCompteur">Numéro de compteur électrique</label>
        <input id="numeroCompteur" name="numeroCompteur" maxLength={100} className={inputCls} />
        <p className="text-xs mt-2 text-[color:var(--muted)]">
          Vous pouvez aussi envoyer une photo de votre compteur ou une facture d'électricité en pièce jointe
        </p>
      </div>

      <div>
        <label className={labelCls} htmlFor="files">Pièces jointes</label>
        <input
          id="files"
          name="files"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
          onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 10))}
          className="block w-full text-sm"
        />
        <p className="text-xs mt-2 text-[color:var(--muted)]">
          Photo du problème, compteur ou facture d'électricité
        </p>
        {files.length > 0 && (
          <p className="text-xs mt-2">{files.length} fichier(s) sélectionné(s)</p>
        )}
      </div>

      <div className="flex items-start gap-2">
        <input
          id="gdpr"
          name="gdpr"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 accent-[color:var(--brand)]"
        />
        <label htmlFor="gdpr" className="text-sm">
          J'accepte que Bourquin Électricité conserve mes coordonnées pour me recontacter. *
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-brand">
        {submitting ? "Envoi en cours…" : "Envoyer"}
      </button>
    </form>
  );
}
