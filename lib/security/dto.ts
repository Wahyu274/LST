import { NextResponse } from 'next/server';

/**
 * Data Minimization DTO Serializer for Customer Data
 */
export function toCustomerDTO(customer: any) {
  if (!customer) return null;
  return {
    id: customer.id,
    name: customer.name,
    institution: customer.institution || null,
    phone: customer.phone,
    email: customer.email || null,
    location: customer.location || null,
  };
}

/**
 * Data Minimization DTO Serializer for User Data
 */
export function toUserDTO(user: any) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl || null,
    status: user.status,
    mfaEnabled: user.mfaEnabled ?? false,
    createdAt: user.createdAt,
  };
}

/**
 * Centralized Safe Error Response Helper
 */
export function handleSafeError(error: any, customMsg = 'Terjadi kesalahan pada sistem server.'): NextResponse {
  const isProd = process.env.NODE_ENV === 'production';
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  console.error(`[SERVER ERROR ${requestId}]:`, error);

  // Strip internal stack trace & raw DB queries in production
  const safeMessage = isProd ? customMsg : error?.message || customMsg;

  return NextResponse.json(
    {
      success: false,
      error: safeMessage,
      requestId,
    },
    { status: error?.status || 500 }
  );
}
