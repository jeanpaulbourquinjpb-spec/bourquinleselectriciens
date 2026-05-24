import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ProjectPhotoDTO = {
  id: string;
  url: string;
  is_cover: boolean;
  sort_order: number;
};

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
  photos: ProjectPhotoDTO[];
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
  const projects = (data ?? []) as Omit<ProjectDTO, "photos">[];
  const ids = projects.map((p) => p.id);
  let photosByProject = new Map<string, ProjectPhotoDTO[]>();
  if (ids.length > 0) {
    const { data: photos } = await supabaseAdmin
      .from("project_photos")
      .select("id, project_id, url, is_cover, sort_order")
      .in("project_id", ids)
      .order("is_cover", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    for (const row of photos ?? []) {
      const arr = photosByProject.get(row.project_id) ?? [];
      arr.push({
        id: row.id,
        url: row.url,
        is_cover: row.is_cover,
        sort_order: row.sort_order,
      });
      photosByProject.set(row.project_id, arr);
    }
  }
  const result: ProjectDTO[] = projects.map((p) => {
    const photos = photosByProject.get(p.id) ?? [];
    // Fallback: if no photos rows yet (legacy), synthesize from image_url
    const finalPhotos =
      photos.length > 0
        ? photos
        : p.image_url
          ? [{ id: `legacy-${p.id}`, url: p.image_url, is_cover: true, sort_order: 0 }]
          : [];
    return { ...p, photos: finalPhotos };
  });
  return { projects: result };
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
    // Auto-create cover photo row
    if (row) {
      await supabaseAdmin.from("project_photos").insert({
        project_id: row.id,
        url: row.image_url,
        is_cover: true,
        sort_order: 0,
      });
    }
    return { project: { ...(row as Omit<ProjectDTO, "photos">), photos: [] } };
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

export const addProjectPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        project_id: z.string().uuid(),
        url: z.string().url().max(2000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { count } = await supabaseAdmin
      .from("project_photos")
      .select("id", { count: "exact", head: true })
      .eq("project_id", data.project_id);
    const { error } = await supabaseAdmin.from("project_photos").insert({
      project_id: data.project_id,
      url: data.url,
      is_cover: false,
      sort_order: count ?? 0,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderProjects = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ ids: z.array(z.string().uuid()).min(1).max(500) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    for (let i = 0; i < data.ids.length; i++) {
      await supabaseAdmin.from("projects").update({ sort_order: i }).eq("id", data.ids[i]);
    }
    return { ok: true };
  });

export const reorderProjectPhotos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        project_id: z.string().uuid(),
        photo_ids: z.array(z.string().uuid()).min(1).max(100),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    // Update sort_order and set first as cover
    for (let i = 0; i < data.photo_ids.length; i++) {
      await supabaseAdmin
        .from("project_photos")
        .update({ sort_order: i, is_cover: i === 0 })
        .eq("id", data.photo_ids[i]);
    }
    // Sync project.image_url to the new cover
    const { data: cover } = await supabaseAdmin
      .from("project_photos")
      .select("url")
      .eq("id", data.photo_ids[0])
      .maybeSingle();
    if (cover?.url) {
      await supabaseAdmin
        .from("projects")
        .update({ image_url: cover.url })
        .eq("id", data.project_id);
    }
    return { ok: true };
  });

export const deleteProjectPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: row } = await supabaseAdmin
      .from("project_photos")
      .select("url")
      .eq("id", data.id)
      .maybeSingle();
    if (row?.url) {
      const marker = "/storage/v1/object/public/project-photos/";
      const idx = row.url.indexOf(marker);
      if (idx >= 0) {
        const path = row.url.slice(idx + marker.length);
        await supabaseAdmin.storage.from("project-photos").remove([path]);
      }
    }
    const { error } = await supabaseAdmin.from("project_photos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setCoverPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ project_id: z.string().uuid(), photo_id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    await supabaseAdmin
      .from("project_photos")
      .update({ is_cover: false })
      .eq("project_id", data.project_id);
    const { data: photo, error } = await supabaseAdmin
      .from("project_photos")
      .update({ is_cover: true })
      .eq("id", data.photo_id)
      .select("url")
      .single();
    if (error) throw new Error(error.message);
    if (photo?.url) {
      await supabaseAdmin
        .from("projects")
        .update({ image_url: photo.url })
        .eq("id", data.project_id);
    }
    return { ok: true };
  });
