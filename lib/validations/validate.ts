import { z } from 'zod';
import { NextResponse } from 'next/server';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  response?: NextResponse;
}

export function validateInput<T>(schema: z.ZodSchema<T>, body: unknown): ValidationResult<T> {
  const result = schema.safeParse(body);
  if (!result.success) {
    const formattedErrors = result.error.errors.map((err) => ({
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
