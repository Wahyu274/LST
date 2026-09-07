import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB Max File Size Limit

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'application/pdf': '.pdf',
  'text/plain': '.txt',
  'application/json': '.json',
  'text/csv': '.csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};

export async function POST(req: NextRequest) {
  try {
    // 1. Session Authentication Check
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Otentikasi diperlukan untuk mengunggah berkas.' }, { status: 401 });
    }

    // 2. Rate Limit Check: Max 10 uploads per 5 minutes per IP
    const rateLimit = checkRateLimit(req, { limit: 10, windowMs: 5 * 60 * 1000, identifier: 'admin-upload' });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak permintaan unggah file. Silakan tunggu ${rateLimit.retryAfterSec} detik.`,
        },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSec) } }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'File tidak ditemukan' }, { status: 400 });
    }

    // 3. File Size Validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Ukuran file melebihi batas maksimal 5 MB.' },
        { status: 400 }
      );
    }

    // 4. MIME Type Allowlist Validation
    const mimeType = file.type.toLowerCase();
    const safeExt = ALLOWED_MIME_TYPES[mimeType];

    if (!safeExt) {
      return NextResponse.json(
        { success: false, error: 'Tipe file tidak diizinkan. Hanya menerima gambar (JPG, PNG, WebP) & dokumen resmi.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 5. Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // 6. Generate Server-Side Randomized Filename
    const randomHash = crypto.randomBytes(8).toString('hex');
    const filename = `upl_${Date.now()}_${randomHash}${safeExt}`;
    const filePath = path.join(uploadsDir, filename);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;

    // 7. Record Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'UPLOAD_FILE',
        resource: 'UploadStorage',
        details: `User ${session.email} uploaded file "${filename}" (${(buffer.length / 1024).toFixed(1)} KB, MIME: ${mimeType})`,
      },
    });

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename,
      size: buffer.length,
      mimeType,
    });
  } catch (error: any) {
    console.error('Secure File Upload Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Gagal mengunggah file' }, { status: 500 });
  }
}
