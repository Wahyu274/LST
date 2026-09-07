import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await prisma.pageContent.findUnique({
      where: { pageKey: 'company_settings' },
    });

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
      instagram: 'https://instagram.com/lst.technology',
      facebook: 'https://facebook.com/lst.technology',
      linkedin: 'https://linkedin.com/company/lst-technology',
      youtube: 'https://youtube.com/@lst.technology',
      tiktok: 'https://tiktok.com/@lst.technology',
    };

    const data = settings ? { ...defaultContent, ...JSON.parse(settings.contentJson) } : defaultContent;

    return NextResponse.json(
      {
        success: true,
        data,
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

