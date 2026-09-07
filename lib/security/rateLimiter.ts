import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory sliding window store
const rateLimitMap = new Map<string, RateLimitStore>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  limit: number; // Maximum allowed requests
  windowMs: number; // Time window in milliseconds
  identifier?: string; // Optional custom key prefix
}

/**
 * Reusable Rate Limiter Helper
 */
export function checkRateLimit(
  req: NextRequest,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const { limit, windowMs, identifier = 'global' } = options;

  // Extract client IP address from headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

  const key = `${identifier}:${clientIp}`;
  const now = Date.now();

  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: limit - 1, retryAfterSec: 0 };
  }

  if (record.count >= limit) {
    const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, retryAfterSec: 0 };
}

/**
 * Rate Limiter Response Guard
 */
export function withRateLimit(
  options: RateLimitOptions,
  handler: (req: NextRequest, context?: any) => Promise<NextResponse> | NextResponse
) {
  return async (req: NextRequest, context?: any) => {
    const { allowed, retryAfterSec } = checkRateLimit(req, options);
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak permintaan (Rate limit exceeded). Silakan coba lagi dalam ${retryAfterSec} detik.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfterSec),
          },
        }
      );
    }

    return await handler(req, context);
  };
}
