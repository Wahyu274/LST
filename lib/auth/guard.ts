import { NextRequest, NextResponse } from 'next/server';
import { getSession, UserSessionPayload } from './session';
import { hasPermission, UserRole } from './rbac';
import { handleSafeError } from '@/lib/security/dto';

export type AuthenticatedRouteHandler = (
  req: NextRequest,
  session: UserSessionPayload,
  context?: any
) => Promise<NextResponse> | NextResponse;

/**
 * Reusable Higher-Order Wrapper for Authenticated API Endpoints
 */
export function withAuth(handler: AuthenticatedRouteHandler) {
  return async (req: NextRequest, context?: any) => {
    try {
      const session = await getSession(req);
      if (!session) {
        return NextResponse.json(
          { success: false, error: 'Otentikasi diperlukan. Sesi Anda telah berakhir.' },
          { status: 401 }
        );
      }
      return await handler(req, session, context);
    } catch (error: any) {
      return handleSafeError(error, 'Terjadi kesalahan internal pada layanan server.');
    }
  };
}

/**
 * Reusable Higher-Order Wrapper for Permission-Restricted API Endpoints
 */
export function withPermission(permission: string, handler: AuthenticatedRouteHandler) {
  return withAuth(async (req: NextRequest, session: UserSessionPayload, context?: any) => {
    if (!hasPermission(session, permission)) {
      return NextResponse.json(
        { success: false, error: `Akses ditolak. Membutuhkan hak akses "${permission}".` },
        { status: 403 }
      );
    }
    return await handler(req, session, context);
  });
}

/**
 * Reusable Higher-Order Wrapper for Role-Restricted API Endpoints
 */
export function withRole(allowedRoles: UserRole[], handler: AuthenticatedRouteHandler) {
  return withAuth(async (req: NextRequest, session: UserSessionPayload, context?: any) => {
    if (!allowedRoles.includes(session.role as UserRole) && session.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak. Role Anda tidak berhak mengakses rute ini.' },
        { status: 403 }
      );
    }
    return await handler(req, session, context);
  });
}
