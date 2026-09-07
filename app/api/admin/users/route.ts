import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';
import { userSchema } from '@/lib/validations/schemas';
import { validateInput } from '@/lib/validations/validate';
import { withPermission } from '@/lib/auth/guard';

export const GET = withPermission('user.manage', async () => {
  try {
    const users = await prisma.user.findMany({
      where: { deletedAt: null } as any,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        mfaEnabled: true,
        isOnline: true,
        createdAt: true,
        updatedAt: true,
      } as any,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});

export const POST = withPermission('user.manage', async (req: NextRequest, session) => {
  try {
    const body = await req.json();
    const validation = validateInput(userSchema, body);
    if (!validation.success || !validation.data) {
      return validation.response!;
    }
    const validated = validation.data;

    const passwordHash = await bcrypt.hash(validated.password || 'LstDefault123!', 10);

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        passwordHash,
        role: validated.role,
        status: validated.status,
        mfaEnabled: validated.mfaEnabled,
      } as any,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      } as any,
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CREATE',
        resource: 'User',
        details: `User ${session.email} created user "${user.name}" with role ${user.role}`,
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
});

export const PUT = withPermission('user.manage', async (req: NextRequest, session) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });

    const body = await req.json();
    const { role, status, mfaEnabled, newPassword } = body;

    const dataToUpdate: any = {};
    if (role) dataToUpdate.role = role;
    if (status) dataToUpdate.status = status;
    if (mfaEnabled !== undefined) dataToUpdate.mfaEnabled = mfaEnabled;
    if (newPassword) {
      dataToUpdate.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const updated: any = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      } as any,
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'ROLE_CHANGE',
        resource: 'User',
        details: `User ${session.email} updated user ID ${id} role to ${updated.role}, status to ${updated.status}`,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
});

export const DELETE = withPermission('user.manage', async (req: NextRequest, session) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });

    if (id === session.userId) {
      return NextResponse.json({ success: false, error: 'Cannot delete your own account' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'DELETE',
        resource: 'User',
        details: `User ${session.email} soft deleted user ID ${id}`,
      },
    });

    return NextResponse.json({ success: true, message: 'User deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
});
