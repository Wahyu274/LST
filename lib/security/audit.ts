import { prisma } from '@/lib/db/prisma';

export type AuditAction =
  | 'LOGIN'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'CREATE'
  | 'UPDATE'
  | 'ARCHIVE'
  | 'PERMANENT_DELETE'
  | 'PUBLISH'
  | 'UNPUBLISH'
  | 'ROLE_CHANGE'
  | 'PERMISSION_CHANGE'
  | 'ASSIGN'
  | 'VIEW_CONVERSATION'
  | 'VIEW_CS_MONITORING'
  | 'UPLOAD_FILE'
  | 'SECURITY_SETTING_CHANGE'
  | 'AI_TOOL_CALL';

export interface AuditLogOptions {
  userId?: string | null;
  action: AuditAction;
  resource: string;
  details: string;
  ipAddress?: string | null;
}

/**
 * Sensitive field scrub patterns to prevent logging confidential credentials
 */
function sanitizeAuditDetails(details: string): string {
  if (!details) return '';
  return details
    .replace(/"password"\s*:\s*"[^"]*"/gi, '"password":"[REDACTED]"')
    .replace(/"token"\s*:\s*"[^"]*"/gi, '"token":"[REDACTED]"')
    .replace(/"apiKey"\s*:\s*"[^"]*"/gi, '"apiKey":"[REDACTED]"')
    .replace(/sk-proj-[a-zA-Z0-9_-]+/g, 'sk-proj-[REDACTED]');
}

/**
 * Centralized Append-Only Audit Logging Helper
 */
export async function logAudit(options: AuditLogOptions): Promise<void> {
  try {
    const cleanDetails = sanitizeAuditDetails(options.details);

    await prisma.auditLog.create({
      data: {
        userId: options.userId || null,
        action: options.action,
        resource: options.resource,
        details: cleanDetails,
        ipAddress: options.ipAddress || null,
      },
    });
  } catch (error) {
    console.error('Audit Logging Error:', error);
  }
}

// Alias export for backward compatibility
export const recordAuditLog = logAudit;
