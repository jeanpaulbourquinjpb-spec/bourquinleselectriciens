import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ProjectDTO = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string;
  instagram_url: string | null;
  source_type: string;
  sort_order: number;
  created_at: string;
};

export const CATEGORIES = [
  "Éclairage",
  "Sécurité",
  "Rénovation",
  "Grands projets",
  "Résidentiel",
  "Commercial",
] as const;

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) {
    throw new Error("Forbidden: admin role required");
  }
}

export const listProjects = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("id, title, description, category, image_url, instagram_url, source_type, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("listProjects error:", error);
    return { projects: [] as ProjectDTO[] };
  }
  return { projects: (data ?? []) as ProjectDTO[] };
});

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  category: z.enum(CATEGORIES).optional().nullable(),
  image_url: z.string().url().max(2000),
  instagram_url: z.string().url().max(500).optional().nullable(),
  source_type: z.enum(["upload", "instagram"]).default("upload"),
});

export const createProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => createSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: row, error } = await supabaseAdmin
      .from("projects")
      .insert({
        title: data.title,
        description: data.description ?? null,
        category: data.category ?? null,
        image_url: data.image_url,
        instagram_url: data.instagram_url ?? null,
        source_type: data.source_type,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { project: row as ProjectDTO };
  });

const updateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  category: z.enum(CATEGORIES).nullable().optional(),
});

export const updateProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => updateSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { id, ...patch } = data;
    const { error } = await supabaseAdmin.from("projects").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    // Try to remove storage file if it lives in our bucket
    const { data: row } = await supabaseAdmin
      .from("projects")
      .select("image_url, source_type")
      .eq("id", data.id)
      .maybeSingle();
    if (row?.source_type === "upload" && row.image_url) {
      const marker = "/storage/v1/object/public/project-photos/";
      const idx = row.image_url.indexOf(marker);
      if (idx >= 0) {
        const path = row.image_url.slice(idx + marker.length);
        await supabaseAdmin.storage.from("project-photos").remove([path]);
      }
    }
    const { error } = await supabaseAdmin.from("projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const isCurrentUserAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });
