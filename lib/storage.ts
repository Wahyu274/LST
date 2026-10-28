/**
 * Persistent File Storage
 * Production: Supabase Storage (survives redeploys, rebuilds & server restarts).
 * Development fallback: local public/uploads when Supabase env keys are not set.
 */
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { env } from '@/lib/config/env';

export function isRemoteStorageEnabled(): boolean {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function saveUploadedFile(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  if (isRemoteStorageEnabled()) {
    const baseUrl = env.SUPABASE_URL.replace(/\/+$/, '');
    const bucket = env.SUPABASE_STORAGE_BUCKET;
    const objectPath = `uploads/${filename}`;

    const res = await fetch(`${baseUrl}/storage/v1/object/${bucket}/${objectPath}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': mimeType,
        'Cache-Control': '31536000',
        'x-upsert': 'false',
      },
      body: new Uint8Array(buffer),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`Gagal menyimpan file ke Supabase Storage (${res.status}): ${detail}`);
    }

    return `${baseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}
