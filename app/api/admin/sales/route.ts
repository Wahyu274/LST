import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  try {
    const transactions = await prisma.saleTransaction.findMany({
      orderBy: { saleDate: 'desc' },
      include: { items: true },
    });
    return NextResponse.json({ success: true, data: transactions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const sale = await prisma.saleTransaction.create({
      data: {
        code: body.code || `TRX-LST-${Date.now().toString().slice(-6)}`,
        clientName: body.clientName,
        totalRevenue: body.totalRevenue,
        category: body.category || 'IT Equipment',
        paymentStatus: body.paymentStatus || 'UNPAID',
        status: 'COMPLETED',
        items: {
          create: body.items?.map((item: any) => ({
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
          })) || [],
        },
      },
      include: { items: true },
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        resource: 'SaleTransaction',
        details: `Created manual sale transaction ${sale.code} for "${sale.clientName}"`,
      },
    });

    return NextResponse.json({ success: true, data: sale });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
