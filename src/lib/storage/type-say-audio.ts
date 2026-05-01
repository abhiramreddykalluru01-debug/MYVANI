/**
 * Stores Type & Say generated WAV in Supabase Storage and returns a public URL.
 *
 * The bucket name is fixed to `type-say-audio`. Create it in the Supabase
 * dashboard with PUBLIC read access (see migration_scale.sql).
 */

import { createClient } from "@/lib/supabase/server";

const BUCKET = "type-say-audio";

function bytesFromBase64(b64: string): Uint8Array {
  return Buffer.from(b64, "base64");
}

/**
 * Upload a WAV blob and return its public URL.
 * `cacheKey` is used as the storage path so cache hits and storage
 * objects stay one-to-one and we never write the same audio twice.
 */
export async function uploadTypeSayAudio(opts: {
  cacheKey: string;
  audioBase64: string;
  mimeType?: string;
}): Promise<string | null> {
  const supabase = await createClient();
  const path = `${opts.cacheKey}.wav`;
  const bytes = bytesFromBase64(opts.audioBase64);

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, {
      contentType: opts.mimeType ?? "audio/wav",
      upsert: true,
      cacheControl: "31536000, immutable",
    });

  if (upErr) {
    console.warn("[type-say-audio] upload failed:", upErr.message);
    return null;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl ?? null;
}
