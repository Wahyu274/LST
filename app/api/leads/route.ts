import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { leadSchema } from '@/lib/validations/schemas';
import { validateInput } from '@/lib/validations/validate';
import { sendLeadEmailNotification } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Map fields dynamically for backwards/contact form compatibility
    const rawCustomerName = body.customerName || body.name;
    const rawInterest = body.interest || body.needs || 'Konsultasi IT & Pengadaan';

    const normalizedBody = {
      ...body,
      customerName: rawCustomerName,
      interest: rawInterest,
    };

    const validation = validateInput(leadSchema, normalizedBody);
    if (!validation.success || !validation.data) {
      return validation.response!;
    }

    const { customerName, institution, phone, email, location, interest, source, notes } = validation.data;

    // Find or create customer with explicit field mapping
    let customer = await prisma.customer.findFirst({
      where: { phone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          institution: institution || null,
          phone,
          email: email || null,
          location: location || null,
        },
      });
    }

    // Explicit field allowlist mapping to prevent mass-assignment
    const lead = await prisma.lead.create({
      data: {
        customerId: customer.id,
        interest,
        source: source || 'CONTACT_FORM',
        stage: 'NEW',
        notes: notes || null,
      },
    });

    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: 'STAGE_CHANGE',
        title: 'New Lead Created via ' + (source || 'CONTACT_FORM'),
        details: `Customer: ${customerName} (${institution || 'Individual'}). Need: ${interest}`,
        actorName: 'System / Web Form',
      },
    });

    // Send email notification asynchronously to lifesolutiont@gmail.com
    sendLeadEmailNotification({
      customerName,
      phone,
      email,
      institution,
      interest,
      location,
      notes,
    }).catch((err) => console.error('Background lead email error:', err));

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error) {
    console.error('Lead creation error:', error);
    return NextResponse.json({ success: false, error: 'Gagal membuat data prospek.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      include: { customer: true, owner: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
