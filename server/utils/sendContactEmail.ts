import nodemailer from 'nodemailer';
import { stripControlChars } from '../../utils/security';

export interface ContactEmailPayload {
  name: string;
  email: string;
  message: string;
  locale?: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function isContactEmailConfigured() {
  const config = useRuntimeConfig();
  return Boolean(
    config.smtpHost?.trim() &&
      config.smtpUser?.trim() &&
      config.smtpPass?.trim() &&
      config.contactToEmail?.trim(),
  );
}

export async function sendContactEmail(payload: ContactEmailPayload) {
  if (!isContactEmailConfigured()) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Contact email is not configured',
    });
  }

  const config = useRuntimeConfig();
  const name = stripControlChars(payload.name);
  const email = stripControlChars(payload.email);
  const message = stripControlChars(payload.message);
  const locale = payload.locale === 'pt' ? 'pt' : 'en';

  const subject =
    locale === 'pt'
      ? `Consulta do site — ${name}`
      : `Website inquiry — ${name}`;

  const text = [
    locale === 'pt' ? 'Nova mensagem pelo site layanemoura.com' : 'New message from layanemoura.com',
    '',
    locale === 'pt' ? `Nome: ${name}` : `Name: ${name}`,
    `${locale === 'pt' ? 'E-mail' : 'Email'}: ${email}`,
    '',
    message,
  ].join('\n');

  const html = `
    <p>${locale === 'pt' ? 'Nova mensagem pelo formulário de contacto.' : 'New message from the contact form.'}</p>
    <p><strong>${locale === 'pt' ? 'Nome' : 'Name'}:</strong> ${escapeHtml(name)}</p>
    <p><strong>${locale === 'pt' ? 'E-mail' : 'Email'}:</strong> ${escapeHtml(email)}</p>
    <p><strong>${locale === 'pt' ? 'Mensagem' : 'Message'}:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort) || 587,
    secure: Boolean(config.smtpSecure),
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });

  const fromName = config.contactFromName?.trim() || 'Layane Moura Website';
  const fromAddress = config.contactFromEmail?.trim() || config.smtpUser;

  await transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to: config.contactToEmail,
    replyTo: email,
    subject,
    text,
    html,
  });
}
