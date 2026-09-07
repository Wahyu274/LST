import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { quotationSchema } from '@/lib/validations/schemas';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    const where: any = { deletedAt: null };
    if (search) {
      where.OR = [
        { code: { contains: search } },
        { clientName: { contains: search } },
      ];
    }

    const quotations = await prisma.quotation.findMany({
      where,
      include: {
        items: { include: { product: true } },
        lead: { include: { customer: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: quotations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = quotationSchema.parse(body);

    const quotation = await prisma.quotation.create({
      data: {
        code: validated.code,
        clientName: validated.clientName,
        leadId: validated.leadId || null,
        totalAmount: validated.totalAmount,
        status: validated.status,
        validUntil: new Date(validated.validUntil),
        notes: validated.notes,
        items: {
          create: validated.items.map((item) => ({
            itemTitle: item.itemTitle,
            productId: item.productId || null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
      include: { items: true },
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        resource: 'Quotation',
        details: `Created quotation ${quotation.code} for "${quotation.clientName}"`,
      },
    });

    return NextResponse.json({ success: true, data: quotation });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Quotation ID required' }, { status: 400 });

    const body = await req.json();

    if (body.clientName) {
      // Full Update
      const validated = quotationSchema.parse(body);
      
      const updated = await prisma.quotation.update({
        where: { id },
        data: {
          clientName: validated.clientName,
          leadId: validated.leadId || null,
          totalAmount: validated.totalAmount,
          status: validated.status,
          validUntil: new Date(validated.validUntil),
          notes: validated.notes,
          items: {
            deleteMany: {},
            create: validated.items.map((item) => ({
              itemTitle: item.itemTitle,
              productId: item.productId || null,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
            })),
          },
        },
        include: { items: true },
      });

      await prisma.auditLog.create({
        data: {
          action: 'UPDATE',
          resource: 'Quotation',
          details: `Updated full quotation ${updated.code} for "${updated.clientName}"`,
        },
      });

      // Automatically create a SaleTransaction if approved
      if (updated.status === 'APPROVED') {
        const existingSale = await prisma.saleTransaction.findUnique({
          where: { code: updated.code },
        });

        if (!existingSale) {
          await prisma.saleTransaction.create({
            data: {
              code: updated.code,
              clientName: updated.clientName,
              totalRevenue: updated.totalAmount,
              category: 'IT Equipment',
              paymentStatus: 'UNPAID',
              status: 'COMPLETED',
              items: {
                create: updated.items.map((item) => ({
                  productId: item.productId,
                  productName: item.itemTitle,
                  quantity: item.quantity,
                  price: item.unitPrice,
                })),
              },
            },
          });
        }
      }

      return NextResponse.json({ success: true, data: updated });
    } else {
      // Partial update (Status/Notes only)
      const { status, notes } = body;

      const updated = await prisma.quotation.update({
        where: { id },
        data: {
          status,
          notes,
        },
        include: {
          items: true,
        },
      });

      // Automatically create a SaleTransaction if approved
      if (status === 'APPROVED') {
        const existingSale = await prisma.saleTransaction.findUnique({
          where: { code: updated.code },
        });

        if (!existingSale) {
          await prisma.saleTransaction.create({
            data: {
              code: updated.code,
              clientName: updated.clientName,
              totalRevenue: updated.totalAmount,
              category: 'IT Equipment',
              paymentStatus: 'UNPAID',
              status: 'COMPLETED',
              items: {
                create: updated.items.map((item) => ({
                  productId: item.productId,
                  productName: item.itemTitle,
                  quantity: item.quantity,
                  price: item.unitPrice,
                })),
              },
            },
          });
        }
      }

      await prisma.auditLog.create({
        data: {
          action: 'UPDATE',
          resource: 'Quotation',
          details: `Updated quotation ${updated.code} status to ${updated.status}`,
        },
      });

      return NextResponse.json({ success: true, data: updated });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
