import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { leadSchema } from '@/lib/validations/schemas';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const stage = searchParams.get('stage') || '';

    const where: any = { deletedAt: null };
    if (search) {
      where.OR = [
        { customer: { name: { contains: search } } },
        { customer: { institution: { contains: search } } },
        { interest: { contains: search } },
      ];
    }
    if (stage) where.stage = stage;

    const leads = await prisma.lead.findMany({
      where,
      include: {
        customer: true,
        owner: true,
        activities: { orderBy: { createdAt: 'desc' }, take: 5 },
        notesList: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: leads });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = leadSchema.parse(body);

    // Create or find customer
    let customer = await prisma.customer.findFirst({
      where: { phone: validated.phone, deletedAt: null } as any,
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: validated.customerName,
          institution: validated.institution,
          email: validated.email,
          phone: validated.phone,
          location: validated.location,
        },
      });
    }

    const lead = await prisma.lead.create({
      data: {
        customerId: customer.id,
        interest: validated.interest,
        source: validated.source,
        stage: validated.stage,
        estimatedValue: validated.estimatedValue,
        notes: validated.notes,
        ownerId: validated.ownerId || null,
        activities: {
          create: {
            type: 'STAGE_CHANGE',
            title: 'Lead Created',
            details: `Prospek dibuat dengan stage ${validated.stage}`,
            actorName: 'Admin System',
          },
        },
      },
      include: { customer: true, owner: true },
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        resource: 'Lead',
        details: `Created lead for "${customer.name}" (${lead.id})`,
      },
    });

    return NextResponse.json({ success: true, data: lead });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Lead ID required' }, { status: 400 });

    const body = await req.json();
    const { stage, notes, estimatedValue, ownerId } = body;

    const existingLead = await prisma.lead.findUnique({ where: { id } });
    if (!existingLead) return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 444 });

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        stage: stage || existingLead.stage,
        notes: notes !== undefined ? notes : existingLead.notes,
        estimatedValue: estimatedValue !== undefined ? estimatedValue : existingLead.estimatedValue,
        ownerId: ownerId !== undefined ? ownerId : existingLead.ownerId,
      },
      include: { customer: true, owner: true },
    });

    if (stage && stage !== existingLead.stage) {
      await prisma.leadActivity.create({
        data: {
          leadId: id,
          type: 'STAGE_CHANGE',
          title: 'Tahap Prospek Berubah',
          details: `Berubah dari ${existingLead.stage} ke ${stage}`,
          actorName: 'Admin System',
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        resource: 'Lead',
        details: `Updated lead ID ${id} to stage ${updated.stage}`,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Lead ID required' }, { status: 400 });

    await prisma.lead.update({
      where: { id },
      data: { deletedAt: new Date(), stage: 'LOST' } as any,
    });

    await prisma.auditLog.create({
      data: {
        action: 'ARCHIVE',
        resource: 'Lead',
        details: `Archived lead ID ${id}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
