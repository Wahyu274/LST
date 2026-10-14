import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventType, path, metaJson } = body;

    if (!eventType || !path) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Get IP address from request headers or NextRequest ip property
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    
    let visitorId = (req as any).ip || 
                    (forwardedFor ? forwardedFor.split(',')[0].trim() : null) || 
                    realIp || 
                    'unknown-ip';

    // Create response
    const response = NextResponse.json({ success: true });

    await prisma.websiteEvent.create({
      data: {
        eventType,
        path,
        visitorId,
        metaJson: metaJson ? JSON.stringify(metaJson) : null,
      },
    });

    return response;
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
