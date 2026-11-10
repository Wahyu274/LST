import { prisma } from '@/lib/db/prisma';

export const DEFAULT_COMPANY_SETTINGS = {
  companyName: 'CV Life Solution Technology',
  positioning: 'Technology Solution & Digital Transformation Partner',
  email: 'info@lst.co.id',
  supportEmail: 'support@lst.co.id',
  whatsappCS: '6281463821758',
  whatsappTechSoftware: '6285729637816',
  whatsappTechHardware: '6282138388856',
  address: 'Kasihan, Mudal, Kec. Temanggung, Kabupaten Temanggung, Jawa Tengah 54119',
  kbli: '26220, 46511, 62090',
  instagram: 'https://instagram.com/lst.technology',
  facebook: 'https://facebook.com/lst.technology',
  linkedin: 'https://linkedin.com/company/lst-technology',
  youtube: 'https://youtube.com/@lst.technology',
  tiktok: 'https://tiktok.com/@lst.technology',
};

/**
 * Normalize any Indonesian phone input ("0821-...", "+62 821 ...", "821...") to the
 * international digits-only format wa.me requires ("62821...").
 */
export function toWhatsAppNumber(raw: string | null | undefined, fallback: string): string {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return fallback;
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('8')) return `62${digits}`;
  return digits;
}

/** Display format for visitors: "6281463821758" -> "0814-6382-1758" */
export function formatPhoneDisplay(waNumber: string): string {
  const local = waNumber.startsWith('62') ? `0${waNumber.slice(2)}` : waNumber;
  return local.replace(/^(\d{4})(\d{4})(\d+)$/, '$1-$2-$3');
}

/**
 * Public company settings: DB values from Admin > Pengaturan Sistem merged over defaults,
 * with WhatsApp numbers normalized and the displayed phone derived from WhatsApp CS.
 * Never exposes SMTP or other secret fields.
 */
export async function getPublicCompanySettings() {
  let stored: Record<string, unknown> = {};
  try {
    const row = await prisma.pageContent.findUnique({ where: { pageKey: 'company_settings' } });
    if (row?.contentJson) stored = JSON.parse(row.contentJson);
  } catch (error) {
    console.error('Failed to load company settings:', error);
  }

  const pick = (key: keyof typeof DEFAULT_COMPANY_SETTINGS) => {
    const value = stored[key];
    return typeof value === 'string' && value.trim() ? value.trim() : DEFAULT_COMPANY_SETTINGS[key];
  };

  const whatsappCS = toWhatsAppNumber(pick('whatsappCS'), DEFAULT_COMPANY_SETTINGS.whatsappCS);

  return {
    companyName: pick('companyName'),
    positioning: pick('positioning'),
    email: pick('email'),
    supportEmail: pick('supportEmail'),
    whatsappCS,
    whatsappTechSoftware: toWhatsAppNumber(pick('whatsappTechSoftware'), DEFAULT_COMPANY_SETTINGS.whatsappTechSoftware),
    whatsappTechHardware: toWhatsAppNumber(pick('whatsappTechHardware'), DEFAULT_COMPANY_SETTINGS.whatsappTechHardware),
    phone: formatPhoneDisplay(whatsappCS),
    address: pick('address'),
    kbli: pick('kbli'),
    instagram: pick('instagram'),
    facebook: pick('facebook'),
    linkedin: pick('linkedin'),
    youtube: pick('youtube'),
    tiktok: pick('tiktok'),
  };
}
