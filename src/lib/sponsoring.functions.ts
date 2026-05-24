import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const SPONSORING_CATEGORIES = [
  "Équitation",
  "Basketball",
  "Course à pied",
  "Football",
] as const;

export type SponsoringCategory = (typeof SPONSORING_CATEGORIES)[number];

export type SponsoringPhotoDTO = {
  id: string;
  category: SponsoringCategory;
  url: string;
  sort_order: number;
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

export const listSponsoringPhotos = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("sponsoring_photos")
    .select("id, category, url, sort_order")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) {
    console.error("listSponsoringPhotos error:", error);
    return { photos: [] as SponsoringPhotoDTO[] };
  }
  return { photos: (data ?? []) as SponsoringPhotoDTO[] };
});

export const addSponsoringPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        category: z.enum(SPONSORING_CATEGORIES),
        url: z.string().url().max(2000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { count } = await supabaseAdmin
      .from("sponsoring_photos")
      .select("id", { count: "exact", head: true })
      .eq("category", data.category);
    const { error } = await supabaseAdmin.from("sponsoring_photos").insert({
      category: data.category,
      url: data.url,
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
    const { data: row } = await supabaseAdmin
      .from("sponsoring_photos")
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
    const { error } = await supabaseAdmin.from("sponsoring_photos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderSponsoringPhotos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        category: z.enum(SPONSORING_CATEGORIES),
        ids: z.array(z.string().uuid()).min(1).max(500),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    for (let i = 0; i < data.ids.length; i++) {
      await supabaseAdmin
        .from("sponsoring_photos")
        .update({ sort_order: i })
        .eq("id", data.ids[i])
        .eq("category", data.category);
    }
    return { ok: true };
  });
