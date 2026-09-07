import { UserSessionPayload } from './session';

export type UserRole = 'SUPER_ADMIN' | 'SALES' | 'CUSTOMER_SERVICE' | 'CONTENT_EDITOR';

// Granular permission mapping with Deny-By-Default principle
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPER_ADMIN: ['*'],
  SALES: [
    'dashboard:read',
    'product.read',
    'lead.read',
    'lead.create',
    'lead.update',
    'quotation.read',
    'quotation.create',
    'quotation.update',
    'sales.read',
    'sales.manage',
    'project.read',
    'project.manage',
  ],
  CUSTOMER_SERVICE: [
    'conversation.read',
    'conversation.reply',
    'lead.create',
    'customer.read',
  ],
  CONTENT_EDITOR: [
    'product.read',
    'product.create',
    'product.update',
    'content.manage',
    'faq.manage',
    'kb.manage',
  ],
};

/**
 * Server-Side Deny-By-Default Permission Evaluator
 */
export function hasPermission(user: UserSessionPayload | null, requiredPermission: string): boolean {
  if (!user || !user.role) return false; // DENY if unauthenticated
  if (user.role === 'SUPER_ADMIN') return true;

  const permissions = ROLE_PERMISSIONS[user.role as UserRole];
  if (!permissions || !Array.isArray(permissions)) return false; // DENY if role unknown

  return permissions.includes(requiredPermission) || permissions.includes('*');
}

/**
 * Server-Side Object-Level Access Control (BOLA / IDOR Protection)
 */
export function canAccessObject(
  user: UserSessionPayload | null,
  resourceType: 'conversation' | 'lead' | 'quotation' | 'project' | 'customer',
  objectData: any
): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;

  if (resourceType === 'conversation') {
    if (user.role === 'CUSTOMER_SERVICE') {
      // CS can only access assigned conversations or unassigned queue
      const isAssigned = objectData.assignedUserId === user.userId;
      const isUnassignedQueue = !objectData.assignedUserId;
      return isAssigned || isUnassignedQueue;
    }
    return false;
  }

  if (resourceType === 'lead') {
    if (user.role === 'SALES') return true;
    if (user.role === 'CUSTOMER_SERVICE') {
      // CS can only access lead created by or assigned to them
      return objectData.ownerId === user.userId || objectData.createdById === user.userId;
    }
    return false;
  }

  return hasPermission(user, `${resourceType}.read`);
}

export function canAccessAdmin(user: UserSessionPayload | null): boolean {
  if (!user) return false;
  return ['SUPER_ADMIN', 'SALES', 'CONTENT_EDITOR'].includes(user.role);
}

export function canAccessCS(user: UserSessionPayload | null): boolean {
  if (!user) return false;
  return ['SUPER_ADMIN', 'CUSTOMER_SERVICE'].includes(user.role);
}
