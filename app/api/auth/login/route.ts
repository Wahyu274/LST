import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { createSession } from '@/lib/auth/session';
import { verifyPassword } from '@/lib/auth/password';
import { checkRateLimit } from '@/lib/security/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    // Rate limit check: Max 5 login attempts per 15 minutes per IP
    const rateLimit = checkRateLimit(req, { limit: 5, windowMs: 15 * 60 * 1000, identifier: 'auth-login' });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak percobaan login. Silakan tunggu ${rateLimit.retryAfterSec} detik sebelum mencoba kembali.`,
        },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSec) } }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Authenticate user by email from DB
    const user = await prisma.user.findFirst({
      where: {
        email: cleanEmail,
        status: 'ACTIVE',
        deletedAt: null,
      },
    });

    const GENERIC_ERROR = 'Email atau kata sandi tidak valid.';

    if (!user) {
      // Audit log failed attempt without revealing account existence
      await prisma.auditLog.create({
        data: {
          action: 'LOGIN_FAILED',
          resource: 'Auth',
          details: `Failed login attempt for non-existent/inactive email "${cleanEmail}"`,
        },
      });

      return NextResponse.json(
        { success: false, error: GENERIC_ERROR },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'LOGIN_FAILED',
          resource: 'Auth',
          details: `Failed login attempt (invalid password) for user ${user.email}`,
        },
      });

      return NextResponse.json(
        { success: false, error: GENERIC_ERROR },
        { status: 401 }
      );
    }

    // Create session with authenticated user's actual role from DB
    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      mfaEnabled: user.mfaEnabled,
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        resource: 'Auth',
        details: `User ${user.email} successfully logged in with role ${user.role}`,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memproses autentikasi.' },
      { status: 500 }
    );
  }
}
