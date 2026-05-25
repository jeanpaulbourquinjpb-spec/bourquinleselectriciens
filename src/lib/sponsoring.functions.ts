import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { deleteWithStorage, deleteRowsWithStorage } from "./storage.server";

export const SPONSORING_CATEGORIES = [
  "Équitation",
  "Basketball",
  "Course à pied",
  "Football",
] as const;

export type SponsoringPhotoDTO = {
  id: string;
  url: string;
  is_cover: boolean;
  sort_order: number;
};

export type SponsoringEntryDTO = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string;
  sort_order: number;
  created_at: string;
  photos: SponsoringPhotoDTO[];
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

export const listSponsoringEntries = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("sponsoring_entries")
    .select("id, title, description, category, image_url, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("listSponsoringEntries error:", error);
    return { entries: [] as SponsoringEntryDTO[] };
  }
  const entries = (data ?? []) as Omit<SponsoringEntryDTO, "photos">[];
  const ids = entries.map((e) => e.id);
  const photosByEntry = new Map<string, SponsoringPhotoDTO[]>();
  if (ids.length > 0) {
    const { data: photos } = await supabaseAdmin
      .from("sponsoring_photos")
      .select("id, entry_id, url, is_cover, sort_order, created_at")
      .in("entry_id", ids)
      .order("is_cover", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    for (const row of photos ?? []) {
      const arr = photosByEntry.get(row.entry_id) ?? [];
      arr.push({
        id: row.id,
        url: row.url,
        is_cover: row.is_cover,
        sort_order: row.sort_order,
      });
      photosByEntry.set(row.entry_id, arr);
    }
  }
  const result: SponsoringEntryDTO[] = entries.map((e) => {
    const photos = photosByEntry.get(e.id) ?? [];
    const finalPhotos =
      photos.length > 0
        ? photos
        : e.image_url
          ? [{ id: `legacy-${e.id}`, url: e.image_url, is_cover: true, sort_order: 0 }]
          : [];
    return { ...e, photos: finalPhotos };
  });
  return { entries: result };
});

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  category: z.string().trim().min(1).max(100),
  image_url: z.string().url().max(2000),
});

export const createSponsoringEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => createSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: row, error } = await supabaseAdmin
      .from("sponsoring_entries")
      .insert({
        title: data.title,
        description: data.description ?? null,
        category: data.category,
        image_url: data.image_url,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    if (row) {
      await supabaseAdmin.from("sponsoring_photos").insert({
        entry_id: row.id,
        url: row.image_url,
        is_cover: true,
        sort_order: 0,
      });
    }
    return { entry: row };
  });

const updateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  category: z.string().trim().min(1).max(100).optional(),
});

export const updateSponsoringEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => updateSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { id, ...patch } = data;
    const { error } = await supabaseAdmin.from("sponsoring_entries").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteSponsoringEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    await deleteWithStorage({
      table: "sponsoring_entries",
      id: data.id,
      bucket: "sponsoring-photos",
      urlColumns: ["image_url"],
      childCleanup: async () => {
        await deleteRowsWithStorage({
          table: "sponsoring_photos",
          filterColumn: "entry_id",
          filterValue: data.id,
          bucket: "sponsoring-photos",
          urlColumn: "url",
        });
      },
    });
    return { ok: true };
  });

export const addSponsoringPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        entry_id: z.string().uuid(),
        url: z.string().url().max(2000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { count } = await supabaseAdmin
      .from("sponsoring_photos")
      .select("id", { count: "exact", head: true })
      .eq("entry_id", data.entry_id);
    const { error } = await supabaseAdmin.from("sponsoring_photos").insert({
      entry_id: data.entry_id,
      url: data.url,
      is_cover: false,
      sort_order: count ?? 0,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteSponsoringPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    await deleteWithStorage({
      table: "sponsoring_photos",
      id: data.id,
      bucket: "sponsoring-photos",
      urlColumns: ["url"],
    });
    return { ok: true };
  });

export const reorderSponsoringEntries = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ ids: z.array(z.string().uuid()).min(1).max(500) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    for (let i = 0; i < data.ids.length; i++) {
      await supabaseAdmin
        .from("sponsoring_entries")
        .update({ sort_order: i })
        .eq("id", data.ids[i]);
    }
    return { ok: true };
  });

export const reorderSponsoringPhotos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        entry_id: z.string().uuid(),
        photo_ids: z.array(z.string().uuid()).min(1).max(100),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    for (let i = 0; i < data.photo_ids.length; i++) {
      await supabaseAdmin
        .from("sponsoring_photos")
        .update({ sort_order: i, is_cover: i === 0 })
        .eq("id", data.photo_ids[i]);
    }
    const { data: cover } = await supabaseAdmin
      .from("sponsoring_photos")
      .select("url")
      .eq("id", data.photo_ids[0])
      .maybeSingle();
    if (cover?.url) {
      await supabaseAdmin
        .from("sponsoring_entries")
        .update({ image_url: cover.url })
        .eq("id", data.entry_id);
    }
    return { ok: true };
  });
