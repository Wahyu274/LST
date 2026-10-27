import { z } from 'zod';
import { NextResponse } from 'next/server';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  response?: NextResponse;
}

/**
 * Memeriksa apakah ada array dalam objek payload yang melebihi batas aman (mencegah memory exhaustion/OOM).
 */
function hasOversizedArray(obj: unknown, maxElements: number = 200): boolean {
  if (!obj || typeof obj !== 'object') return false;
  if (Array.isArray(obj)) {
    if (obj.length > maxElements) return true;
    for (const item of obj) {
      if (hasOversizedArray(item, maxElements)) return true;
    }
  } else {
    for (const val of Object.values(obj)) {
      if (hasOversizedArray(val, maxElements)) return true;
    }
  }
  return false;
}

export function validateInput<T>(schema: z.ZodSchema<T>, body: unknown): ValidationResult<T> {
  // Pre-validation guard: tolak langsung jika ada array tak terbatas yang dikirim attacker
  if (hasOversizedArray(body, 200)) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'Ukuran data array masukan melebihi batas aman yang diizinkan (maksimal 200 elemen).',
        },
        { status: 400 }
      ),
    };
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    const formattedErrors = result.error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'Validasi data masukan tidak sesuai.',
          details: formattedErrors,
        },
        { status: 400 }
      ),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}
