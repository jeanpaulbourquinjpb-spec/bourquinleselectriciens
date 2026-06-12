import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type DocumentDTO = {
  id: string;
  title: string;
  file_url: string;
  display_order: number;
  updated_at: string;
};

async function assertAdmin(userId: string) {
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden: admin role required");
}

export const listDocuments = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("documents")
    .select("id, title, file_url, display_order, updated_at")
    .order("display_order", { ascending: true })
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("listDocuments error:", error);
    return { documents: [] as DocumentDTO[] };
  }
  return { documents: (data ?? []) as DocumentDTO[] };
});

const createSchema = z.object({
  title: z.string().trim().min(1).max(300),
  file_url: z.string().trim().min(1).max(2000),
  display_order: z.number().int().min(0).max(100000).optional(),
});

export const createDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => createSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: row, error } = await supabaseAdmin
      .from("documents")
      .insert({
        title: data.title,
        file_url: data.file_url,
        display_order: data.display_order ?? 0,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { document: row };
  });

const updateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(300).optional(),
  file_url: z.string().trim().min(1).max(2000).optional(),
  display_order: z.number().int().min(0).max(100000).optional(),
});

export const updateDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => updateSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { id, ...patch } = data;
    const { error } = await supabaseAdmin.from("documents").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    // Try to remove the file from storage if it lives in our bucket.
    const { data: row } = await supabaseAdmin
      .from("documents")
      .select("file_url")
      .eq("id", data.id)
      .maybeSingle();
    if (row?.file_url) {
      const path = extractDocumentsPath(row.file_url);
      if (path) {
        const { error: rmErr } = await supabaseAdmin.storage.from("documents").remove([path]);
        if (rmErr) console.error("documents storage remove error:", rmErr.message);
      }
    }

    const { error } = await supabaseAdmin.from("documents").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Issue a long-lived signed URL for an uploaded object path in the documents bucket. */
export const signDocumentUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ path: z.string().trim().min(1).max(1000) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    // 10 years
    const expiresIn = 60 * 60 * 24 * 365 * 10;
    const { data: signed, error } = await supabaseAdmin.storage
      .from("documents")
      .createSignedUrl(data.path, expiresIn);
    if (error || !signed) throw new Error(error?.message ?? "Sign error");
    return { url: signed.signedUrl };
  });

function extractDocumentsPath(url: string): string | null {
  // Handle public-style and signed URLs:
  // .../storage/v1/object/public/documents/<path>
  // .../storage/v1/object/sign/documents/<path>?token=...
  const publicMarker = "/storage/v1/object/public/documents/";
  const signMarker = "/storage/v1/object/sign/documents/";
  let idx = url.indexOf(publicMarker);
  if (idx >= 0) return decodeURIComponent(url.slice(idx + publicMarker.length).split("?")[0]);
  idx = url.indexOf(signMarker);
  if (idx >= 0) return decodeURIComponent(url.slice(idx + signMarker.length).split("?")[0]);
  return null;
}
