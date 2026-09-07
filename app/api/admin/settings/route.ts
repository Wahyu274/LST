import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await prisma.pageContent.findUnique({
      where: { pageKey: 'company_settings' },
    });

    const envKey = process.env.GEMINI_API_KEY || '';
    const maskedKey = envKey.length > 8 ? `${envKey.slice(0, 6)}********************` : (envKey ? `${envKey.slice(0, 3)}***` : 'Belum Dikonfigurasi');

    const defaultContent = {
      companyName: 'CV Life Solution Technology',
      positioning: 'Technology Solution & Digital Transformation Partner',
      phone: '0821-3555-0007',
      email: 'info@lst.co.id',
      supportEmail: 'support@lst.co.id',
      whatsappCS: '6282135550007',
      whatsappTechSoftware: '6282135550008',
      whatsappTechHardware: '6282135550009',
      address: 'Kasian, Mudal, Temanggung, Jawa Tengah',
      kbli: '26220, 46511, 62090',
      instagram: 'https://instagram.com/lst.technology',
      facebook: 'https://facebook.com/lst.technology',
      linkedin: 'https://linkedin.com/company/lst-technology',
      youtube: 'https://youtube.com/@lst.technology',
      tiktok: 'https://tiktok.com/@lst.technology',
      aiProvider: 'Google Gemini (API Key Active)',
      aiApiKeyMasked: maskedKey,
    };

    const merged = settings ? { ...defaultContent, ...JSON.parse(settings.contentJson) } : defaultContent;
    merged.aiApiKeyMasked = maskedKey; // Always reflect actual env key status

    return NextResponse.json(
      {
        success: true,
        data: merged,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Mask secret keys before saving JSON if present
    const contentJson = JSON.stringify(body);

    const updated = await prisma.pageContent.upsert({
      where: { pageKey: 'company_settings' },
      update: {
        title: 'Company Settings',
        contentJson,
      },
      create: {
        pageKey: 'company_settings',
        title: 'Company Settings',
        contentJson,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        resource: 'Settings',
        details: 'Updated global company and AI settings',
      },
    });

    const envKey = process.env.GEMINI_API_KEY || '';
    const maskedKey = envKey.length > 8 ? `${envKey.slice(0, 6)}********************` : (envKey ? `${envKey.slice(0, 3)}***` : 'Belum Dikonfigurasi');

    const responseData = {
      ...JSON.parse(updated.contentJson),
      aiApiKeyMasked: maskedKey,
    };

    return NextResponse.json(
      { success: true, data: responseData },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

