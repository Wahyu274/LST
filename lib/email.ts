import nodemailer from 'nodemailer';
import { prisma } from '@/lib/db/prisma';

export interface SendLeadNotificationParams {
  customerName: string;
  phone: string;
  email?: string | null;
  institution?: string | null;
  interest: string;
  location?: string | null;
  notes?: string | null;
}

export async function sendLeadEmailNotification(params: SendLeadNotificationParams) {
  try {
    // 1. Get all recipient emails and SMTP settings from database
    const recipients: string[] = [];
    let smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
    let smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    let smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || '';
    let smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || '';

    try {
      const settingsObj = await prisma.pageContent.findUnique({
        where: { pageKey: 'company_settings' },
      });
      if (settingsObj?.contentJson) {
        const json = JSON.parse(settingsObj.contentJson);

        // Add Email Resmi (Umum)
        if (json.email && typeof json.email === 'string' && json.email.trim()) {
          recipients.push(json.email.trim());
        }

        // Add Email Support
        if (json.supportEmail && typeof json.supportEmail === 'string' && json.supportEmail.trim()) {
          const supp = json.supportEmail.trim();
          if (!recipients.includes(supp)) {
            recipients.push(supp);
          }
        }

        // SMTP Credentials from DB Settings
        if (json.smtpHost && typeof json.smtpHost === 'string' && json.smtpHost.trim()) {
          smtpHost = json.smtpHost.trim();
        }
        if (json.smtpPort) {
          smtpPort = parseInt(String(json.smtpPort), 10);
        }
        if (json.smtpUser && typeof json.smtpUser === 'string' && json.smtpUser.trim()) {
          smtpUser = json.smtpUser.trim();
        }
        if (json.smtpPass && typeof json.smtpPass === 'string' && json.smtpPass.trim()) {
          smtpPass = json.smtpPass.trim();
        }
      }
    } catch (e) {
      console.warn('Could not fetch target email or SMTP config from settings:', e);
    }

    // Always ensure lifesolutiont@gmail.com is included in recipients
    if (!recipients.includes('lifesolutiont@gmail.com')) {
      recipients.push('lifesolutiont@gmail.com');
    }

    const smtpFrom = process.env.SMTP_FROM || `"LST Website Contact" <${smtpUser || 'support@lifesolution.co.id'}>`;

    if (!smtpUser || !smtpPass) {
      console.warn(`[SMTP Warning] Credentials missing in Admin Settings / Env. Notification for ${params.customerName} saved in database, but SMTP dispatch to ${recipients.join(', ')} requires SMTP Password in Admin Settings.`);
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lifesolution.co.id';

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; rounded: 12px; padding: 24px; background-color: #ffffff;">
        <div style="background-color: #071426; padding: 16px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <h2 style="color: #60a5fa; margin: 0; font-size: 20px;">Pesan Baru dari Halaman Kontak LST</h2>
        </div>
        
        <p style="font-size: 14px; color: #334155;">Ada prospek/pesan baru terkirim melalui formulir website <strong>lifesolution.co.id</strong>:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px; color: #64748b; font-weight: bold; width: 35%;">Nama Lengkap:</td>
            <td style="padding: 10px; color: #0f172a; font-weight: 600;">${params.customerName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px; color: #64748b; font-weight: bold;">No. WhatsApp / HP:</td>
            <td style="padding: 10px; color: #0f172a;"><a href="https://wa.me/${params.phone.replace(/\D/g, '')}" style="color: #2563eb; text-decoration: none;">${params.phone} (Hubungi WA)</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px; color: #64748b; font-weight: bold;">Email Customer:</td>
            <td style="padding: 10px; color: #0f172a;">${params.email || '-'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px; color: #64748b; font-weight: bold;">Instansi / Sekolah:</td>
            <td style="padding: 10px; color: #0f172a;">${params.institution || 'Perorangan'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px; color: #64748b; font-weight: bold;">Solusi / Kebutuhan:</td>
            <td style="padding: 10px; color: #1769e0; font-weight: 600;">${params.interest}</td>
          </tr>
          ${params.location ? `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px; color: #64748b; font-weight: bold;">Lokasi:</td>
            <td style="padding: 10px; color: #0f172a;">${params.location}</td>
          </tr>
          ` : ''}
          ${params.notes ? `
          <tr>
            <td style="padding: 10px; color: #64748b; font-weight: bold;">Pesan / Catatan:</td>
            <td style="padding: 10px; color: #0f172a; white-space: pre-wrap;">${params.notes}</td>
          </tr>
          ` : ''}
        </table>

        <div style="margin-top: 24px; text-align: center;">
          <a href="${appUrl}/admin/leads" style="display: inline-block; background-color: #1769e0; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">Buka CRM Leads Admin</a>
        </div>

        <hr style="margin-top: 30px; border: none; border-top: 1px solid #e2e8f0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">Email ini dikirim otomatis oleh Sistem CV Life Solution Technology (LST).</p>
      </div>
    `;

    await transporter.sendMail({
      from: smtpFrom,
      to: recipients.join(', '),
      subject: `[PROSPEK BARU] ${params.customerName} - ${params.interest}`,
      html: htmlBody,
    });

    console.log(`[Email Notification] Lead notification successfully sent to ${recipients.join(', ')}`);
    return true;
  } catch (error) {
    console.error('[Email Notification Error]:', error);
    return false;
  }
}
