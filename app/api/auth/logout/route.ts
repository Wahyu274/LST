import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await clearSession();
    return NextResponse.json({ success: true, redirectUrl: '/login' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
