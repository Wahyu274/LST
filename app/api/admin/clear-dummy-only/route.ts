import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Akses Ditolak. Hanya Super Admin.' }, { status: 403 });
    }

    console.log('Clearing SPECIFIC dummy data...');

    // 1. Delete Dummy CRM Lead & Customer
    const dummyCust = await prisma.customer.findFirst({
      where: { email: 'hendra@sman2magelang.sch.id' }
    });

    if (dummyCust) {
      // Find leads to delete their activities first
      const leads = await prisma.lead.findMany({ where: { customerId: dummyCust.id } });
      for (const l of leads) {
        await prisma.leadActivity.deleteMany({ where: { leadId: l.id } });
        await prisma.leadNote.deleteMany({ where: { leadId: l.id } });
        await prisma.lead.delete({ where: { id: l.id } });
      }

      // Delete conversations and messages for this customer
      const conversations = await prisma.conversation.findMany({ where: { customerId: dummyCust.id } });
      for (const conv of conversations) {
        await prisma.message.deleteMany({ where: { conversationId: conv.id } });
        await prisma.conversationAssignment.deleteMany({ where: { conversationId: conv.id } });
        await prisma.aIConversationMetric.deleteMany({ where: { conversationId: conv.id } });
        await prisma.conversation.delete({ where: { id: conv.id } });
      }

      // Finally delete the dummy customer
      await prisma.customer.delete({ where: { id: dummyCust.id } });
    }

    // 2. Delete Dummy Sales Transactions
    const dummyInvoices = ['INV-2026-0801', 'INV-2026-0805'];
    for (const code of dummyInvoices) {
      const sale = await prisma.saleTransaction.findUnique({ where: { code } });
      if (sale) {
        await prisma.saleItem.deleteMany({ where: { transactionId: sale.id } });
        await prisma.saleTransaction.delete({ where: { id: sale.id } });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Data dummy bawaan sistem (Dr. Hendra & Invoice INV-2026-0801, 0805) berhasil dihapus tanpa menyentuh data real!' 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
