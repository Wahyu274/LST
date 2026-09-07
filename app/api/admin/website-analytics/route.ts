import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';
import { canAccessAdmin } from '@/lib/auth/rbac';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || !canAccessAdmin(session)) {
      return NextResponse.json({ success: false, error: 'Akses ditolak.' }, { status: 403 });
    }

    // 1. Total Unique Visitors (All time or last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // In PostgreSQL, we can use distinct for counting unique visitorIds
    const uniqueVisitorsResult = await prisma.websiteEvent.findMany({
      where: {
        eventType: 'PAGE_VIEW',
        createdAt: { gte: thirtyDaysAgo }
      },
      select: { visitorId: true },
      distinct: ['visitorId']
    });
    const uniqueVisitors = uniqueVisitorsResult.length;

    // 2. Total Page Views
    const totalPageViews = await prisma.websiteEvent.count({
      where: { eventType: 'PAGE_VIEW' }
    });

    // 3. Online Now (Active in the last 5 minutes)
    const fiveMinsAgo = new Date();
    fiveMinsAgo.setMinutes(fiveMinsAgo.getMinutes() - 5);
    const onlineNowResult = await prisma.websiteEvent.findMany({
      where: {
        createdAt: { gte: fiveMinsAgo }
      },
      select: { visitorId: true },
      distinct: ['visitorId']
    });
    const onlineNow = onlineNowResult.length;

    // 4. WhatsApp CTA Clicks
    const waClicks = await prisma.websiteEvent.count({
      where: { eventType: 'WA_CLICK' }
    });

    return NextResponse.json({
      success: true,
      data: {
        uniqueVisitors,
        totalPageViews,
        onlineNow,
        waClicks,
        topPage: '/solutions/smart-classroom' // Hardcoded for now as aggregation on strings needs raw query
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
