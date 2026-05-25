import { supabaseAdmin } from "@/integrations/supabase/client.server";

// The Supabase typed client narrows table names via generics; this helper
// is intentionally generic, so we use an untyped handle for dynamic table access.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

/**
 * Extract a storage object path from its public URL.
 * Returns null if the URL doesn't belong to the given bucket.
 */
export function extractStoragePath(publicUrl: string | null | undefined, bucket: string): string | null {
  if (!publicUrl) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx < 0) return null;
  return publicUrl.slice(idx + marker.length);
}

/**
 * Universal helper: deletes a database row AND its associated file(s) in storage.
 *
 * - `table`: the DB table to delete from
 * - `id`: the row id
 * - `bucket`: the storage bucket name
 * - `urlColumns`: columns that contain a public Storage URL (file removed before row delete)
 * - `childCleanup`: optional async function to remove related rows/files before deletion
 *
 * Usage:
 *   await deleteWithStorage({
 *     table: "partners",
 *     id,
 *     bucket: "partner-logos",
 *     urlColumns: ["logo_url"],
 *   });
 */
export async function deleteWithStorage(opts: {
  table: string;
  id: string;
  bucket: string;
  urlColumns: string[];
  childCleanup?: () => Promise<void>;
}): Promise<void> {
  const { table, id, bucket, urlColumns, childCleanup } = opts;

  // 1. Fetch the row to get file URLs
  const { data: row, error: fetchErr } = await db
    .from(table)
    .select(urlColumns.join(", "))
    .eq("id", id)
    .maybeSingle();
  if (fetchErr) throw new Error(fetchErr.message);

  // 2. Run child cleanup first (e.g. cascade-delete related photos + files)
  if (childCleanup) {
    await childCleanup();
  }

  // 3. Remove files from storage
  const paths: string[] = [];
  if (row) {
    for (const col of urlColumns) {
      const val = (row as Record<string, unknown>)[col];
      const path = extractStoragePath(typeof val === "string" ? val : null, bucket);
      if (path) paths.push(path);
    }
  }
  if (paths.length > 0) {
    const { error: rmErr } = await db.storage.from(bucket).remove(paths);
    if (rmErr) console.error(`Storage remove error (${bucket}):`, rmErr.message);
  }

  // 4. Delete the row
  const { error: delErr } = await db.from(table).delete().eq("id", id);
  if (delErr) throw new Error(delErr.message);
}

/**
 * Bulk-remove rows + their storage files for a given parent.
 * Used by childCleanup to wipe related photos when deleting a parent entry.
 */
export async function deleteRowsWithStorage(opts: {
  table: string;
  filterColumn: string;
  filterValue: string;
  bucket: string;
  urlColumn: string;
}): Promise<void> {
  const { table, filterColumn, filterValue, bucket, urlColumn } = opts;
  const { data: rows } = await db
    .from(table)
    .select(`id, ${urlColumn}`)
    .eq(filterColumn, filterValue);

  const paths: string[] = [];
  for (const r of rows ?? []) {
    const val = (r as Record<string, unknown>)[urlColumn];
    const path = extractStoragePath(typeof val === "string" ? val : null, bucket);
    if (path) paths.push(path);
  }
  if (paths.length > 0) {
    const { error } = await db.storage.from(bucket).remove(paths);
    if (error) console.error(`Storage bulk remove error (${bucket}):`, error.message);
  }
  await db.from(table).delete().eq(filterColumn, filterValue);
}
