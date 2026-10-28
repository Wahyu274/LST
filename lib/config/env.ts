/**
 * Server-Only Environment Configuration & Secret Validator
 * Prevents client-side bundling of server secrets and validates required env keys.
 */

if (typeof window !== 'undefined') {
  throw new Error('FATAL SECURITY ERROR: Server environment module imported into client bundle!');
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: process.env.JWT_SECRET || 'lst-secret-key-change-in-production-2026',
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b:free',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  AI_PROVIDER: process.env.AI_PRIMARY_PROVIDER || process.env.AI_PROVIDER || 'openrouter',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET || 'media',
};

/**
 * Validate that production secrets are properly configured
 */
export function validateServerSecrets(): { valid: boolean; missingKeys: string[] } {
  const missingKeys: string[] = [];

  if (env.NODE_ENV === 'production') {
    if (env.JWT_SECRET === 'lst-secret-key-change-in-production-2026') {
      missingKeys.push('JWT_SECRET (using default dev fallback)');
    }
  }

  return {
    valid: missingKeys.length === 0,
    missingKeys,
  };
}
