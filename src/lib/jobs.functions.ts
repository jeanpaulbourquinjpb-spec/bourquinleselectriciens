import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const JOB_CATEGORIES = ["cadre", "technicien", "apprentissage", "admin"] as const;
export const JOB_CONTRACT_TYPES = ["CDI", "CDD", "Apprentissage"] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number];
export type JobContractType = (typeof JOB_CONTRACT_TYPES)[number];

export type JobDTO = {
  id: string;
  title: string;
  category: JobCategory | null;
  contract_type: JobContractType | null;
  description: string | null;
  requirements: string | null;
  pdf_url: string | null;
  is_active: boolean;
  published_at: string;
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

export const listJobs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("jobs")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) {
      console.error("listJobs error:", error);
      return { jobs: [] as JobDTO[] };
    }
    return { jobs: (data ?? []) as JobDTO[] };
  });

const createSchema = z.object({
  title: z.string().trim().min(1).max(300),
  category: z.enum(JOB_CATEGORIES).nullable().optional(),
  contract_type: z.enum(JOB_CONTRACT_TYPES).nullable().optional(),
  description: z.string().trim().max(10000).nullable().optional(),
  requirements: z.string().trim().max(10000).nullable().optional(),
  pdf_url: z.string().trim().url().max(2000).nullable().optional(),
  is_active: z.boolean().optional(),
});

export const createJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => createSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: row, error } = await supabaseAdmin
      .from("jobs")
      .insert({
        title: data.title,
        category: data.category ?? null,
        contract_type: data.contract_type ?? null,
        description: data.description ?? null,
        requirements: data.requirements ?? null,
        pdf_url: data.pdf_url ?? null,
        is_active: data.is_active ?? true,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { job: row as JobDTO };
  });

const updateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(300).optional(),
  category: z.enum(JOB_CATEGORIES).nullable().optional(),
  contract_type: z.enum(JOB_CONTRACT_TYPES).nullable().optional(),
  description: z.string().trim().max(10000).nullable().optional(),
  requirements: z.string().trim().max(10000).nullable().optional(),
  pdf_url: z.string().trim().url().max(2000).nullable().optional(),
  is_active: z.boolean().optional(),
});

export const updateJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => updateSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { id, ...patch } = data;
    const { error } = await supabaseAdmin.from("jobs").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("jobs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
