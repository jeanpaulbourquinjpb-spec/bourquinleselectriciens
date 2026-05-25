import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { deleteWithStorage } from "./storage.server";

export type PartnerDTO = {
  id: string;
  name: string;
  url: string | null;
  logo_url: string | null;
  sort_order: number;
  created_at: string;
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


export const listPartners = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("partners")
    .select("id, name, url, logo_url, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) {
    console.error("listPartners error:", error);
    return { partners: [] as PartnerDTO[] };
  }
  return { partners: (data ?? []) as PartnerDTO[] };
});

const createSchema = z.object({
  name: z.string().trim().min(1).max(200),
  url: z.string().trim().url().max(2000).optional().nullable(),
  logo_url: z.string().trim().url().max(2000).optional().nullable(),
});

export const createPartner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => createSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { count } = await supabaseAdmin
      .from("partners")
      .select("id", { count: "exact", head: true });
    const { data: row, error } = await supabaseAdmin
      .from("partners")
      .insert({
        name: data.name,
        url: data.url ?? null,
        logo_url: data.logo_url ?? null,
        sort_order: count ?? 0,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { partner: row };
  });

const updateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(200).optional(),
  url: z.string().trim().url().max(2000).nullable().optional(),
  logo_url: z.string().trim().url().max(2000).nullable().optional(),
});

export const updatePartner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => updateSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { id, ...patch } = data;
    const { error } = await supabaseAdmin.from("partners").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deletePartner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    await deleteWithStorage({
      table: "partners",
      id: data.id,
      bucket: "partner-logos",
      urlColumns: ["logo_url"],
    });
    return { ok: true };
  });

export const reorderPartners = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ ids: z.array(z.string().uuid()).min(1).max(500) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    for (let i = 0; i < data.ids.length; i++) {
      await supabaseAdmin
        .from("partners")
        .update({ sort_order: i })
        .eq("id", data.ids[i]);
    }
    return { ok: true };
  });
