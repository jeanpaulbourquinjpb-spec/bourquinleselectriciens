import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://connector-gateway.lovable.dev/brevo";

const attachmentSchema = z.object({
  name: z.string().min(1).max(255),
  content: z.string().min(1), // base64
});

const inputSchema = z.object({
  nom: z.string().trim().min(1).max(100),
  prenom: z.string().trim().min(1).max(100),
  adresse: z.string().trim().min(1).max(255),
  codePostal: z.string().trim().min(1).max(150),
  etage: z.string().trim().min(1).max(150),
  adresseCorrespondance: z.string().trim().max(500).optional().default(""),
  email: z.string().trim().email().max(255),
  telephone: z.string().trim().min(1).max(50),
  message: z.string().trim().min(1).max(5000),
  gdpr: z.literal(true),
  attachments: z.array(attachmentSchema).max(10).optional().default([]),
});

export const submitContactForm = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!BREVO_API_KEY) throw new Error("BREVO_API_KEY is not configured");

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": BREVO_API_KEY,
    };

    // 1. Save contact in Brevo (upsert)
    const contactRes = await fetch(`${GATEWAY}/contacts`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: data.email,
        updateEnabled: true,
        attributes: {
          NOM: data.nom,
          PRENOM: data.prenom,
          SMS: data.telephone,
          ADRESSE: data.adresse,
          CODE_POSTAL: data.codePostal,
          ETAGE: data.etage,
          ADRESSE_CORRESPONDANCE: data.adresseCorrespondance || "",
        },
      }),
    });
    if (!contactRes.ok && contactRes.status !== 204) {
      const txt = await contactRes.text();
      console.error("Brevo contact save failed", contactRes.status, txt);
    }

    const sender = { name: "Bourquin Électricité", email: "info@bourquinelectricite.ch" };

    // 2. Notify the company with full details + attachments
    const adminHtml = `
      <h2>Nouveau message via le formulaire de contact</h2>
      <p><strong>Nom :</strong> ${escape(data.nom)}</p>
      <p><strong>Prénom :</strong> ${escape(data.prenom)}</p>
      <p><strong>Adresse et numéro :</strong> ${escape(data.adresse)}</p>
      <p><strong>Code postal et commune :</strong> ${escape(data.codePostal)}</p>
      <p><strong>Étage et local :</strong> ${escape(data.etage)}</p>
      ${data.adresseCorrespondance ? `<p><strong>Adresse de correspondance :</strong> ${escape(data.adresseCorrespondance)}</p>` : ""}
      <p><strong>Email :</strong> ${escape(data.email)}</p>
      <p><strong>Téléphone :</strong> ${escape(data.telephone)}</p>
      <p><strong>Message :</strong></p>
      <p>${escape(data.message).replace(/\n/g, "<br>")}</p>
    `;

    await fetch(`${GATEWAY}/smtp/email`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        sender,
        to: [{ email: "info@bourquinelectricite.ch", name: "Bourquin Électricité" }],
        replyTo: { email: data.email, name: `${data.prenom} ${data.nom}` },
        subject: `Nouveau message — ${data.prenom} ${data.nom}`,
        htmlContent: adminHtml,
        attachment: data.attachments.length
          ? data.attachments.map((a) => ({ name: a.name, content: a.content }))
          : undefined,
      }),
    }).catch((e) => console.error("Brevo notify failed", e));

    // 3. Send confirmation to client
    const confirmRes = await fetch(`${GATEWAY}/smtp/email`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        sender,
        to: [{ email: data.email, name: `${data.prenom} ${data.nom}` }],
        subject: "Merci pour votre message",
        htmlContent: `<p>Bonjour ${escape(data.prenom)},</p><p>Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.</p><p>— Bourquin Électricité</p>`,
      }),
    });
    if (!confirmRes.ok) {
      const txt = await confirmRes.text();
      console.error("Brevo confirmation failed", confirmRes.status, txt);
    }

    return { success: true };
  });

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
