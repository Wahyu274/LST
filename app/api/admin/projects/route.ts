import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { projectSchema } from '@/lib/validations/schemas';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const where: any = { deletedAt: null };
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { clientName: { contains: search } },
        { location: { contains: search } },
      ];
    }
    if (status) where.status = status;

    const projects = await prisma.project.findMany({
      where,
      include: {
        pic: true,
        updates: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = projectSchema.parse(body);

    const project = await prisma.project.create({
      data: {
        title: validated.title,
        clientName: validated.clientName,
        sector: validated.sector,
        location: validated.location,
        value: validated.value,
        picId: validated.picId || null,
        progress: validated.progress,
        paymentStatus: validated.paymentStatus,
        startDate: new Date(validated.startDate),
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        status: validated.status,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        resource: 'Project',
        details: `Created project "${project.title}" for ${project.clientName}`,
      },
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Project ID required' }, { status: 400 });

    const body = await req.json();
    const { progress, status, updateNote } = body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        progress: progress !== undefined ? progress : undefined,
        status: status || undefined,
        updates: updateNote
          ? {
              create: {
                note: updateNote,
                progress: progress || 0,
              },
            }
          : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        resource: 'Project',
        details: `Updated project "${project.title}" progress to ${project.progress}%`,
      },
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
