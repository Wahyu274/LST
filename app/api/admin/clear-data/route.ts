import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    // Hanya Super Admin yang boleh mengakses ini
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Akses Ditolak. Hanya Super Admin.' }, { status: 403 });
    }

    console.log('Clearing dummy data for Analytics, Leads, and CS Chats...');

    // Delete all messages and conversations
    await prisma.message.deleteMany({});
    await prisma.conversationAssignment.deleteMany({});
    await prisma.aIConversationMetric.deleteMany({});
    await prisma.conversation.deleteMany({});

    // Delete all sales items and transactions
    await prisma.saleItem.deleteMany({});
    await prisma.saleTransaction.deleteMany({});

    // Delete all leads, notes, and activities
    await prisma.leadActivity.deleteMany({});
    await prisma.leadNote.deleteMany({});
    await prisma.quotationItem.deleteMany({});
    await prisma.quotation.deleteMany({});
    await prisma.lead.deleteMany({});
    
    // Optionally delete customers created by dummy data or guests
    await prisma.customer.deleteMany({});

    // Delete website events
    await prisma.websiteEvent.deleteMany({});

    return NextResponse.json({ success: true, message: 'Dummy data berhasil dihapus semua!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
