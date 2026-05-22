import type { ContactEmailPayload } from './sendContactEmail';

const MAX_WHATSAPP_TEXT = 3000;

function normalizeWhatsAppPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return digits || '';
}

export function buildContactWhatsAppText(payload: ContactEmailPayload) {
  const locale = payload.locale === 'pt' ? 'pt' : 'en';
  const lines =
    locale === 'pt'
      ? [
          'Novo contacto — layanemoura.com',
          '',
          `Nome: ${payload.name}`,
          `E-mail: ${payload.email}`,
          '',
          'Mensagem:',
          payload.message,
        ]
      : [
          'New contact — layanemoura.com',
          '',
          `Name: ${payload.name}`,
          `Email: ${payload.email}`,
          '',
          'Message:',
          payload.message,
        ];

  const text = lines.join('\n');
  if (text.length <= MAX_WHATSAPP_TEXT) return text;
  return `${text.slice(0, MAX_WHATSAPP_TEXT - 1)}…`;
}

export function isWhatsAppNotifyConfigured() {
  const config = useRuntimeConfig();
  if (!config.whatsappNotifyEnabled) return false;

  const phone = normalizeWhatsAppPhone(String(config.whatsappNotifyPhone ?? ''));
  if (!phone) return false;

  return Boolean(
    config.callmebotApiKey?.trim() || config.whatsappNotifyWebhook?.trim(),
  );
}

async function sendViaCallMeBot(phone: string, text: string) {
  const config = useRuntimeConfig();
  const apiKey = config.callmebotApiKey?.trim();
  if (!apiKey) return false;

  await $fetch('https://api.callmebot.com/whatsapp.php', {
    method: 'GET',
    params: {
      phone: `+${phone}`,
      text,
      apikey: apiKey,
    },
    timeout: 12_000,
  });

  return true;
}

async function sendViaWebhook(payload: ContactEmailPayload, text: string) {
  const config = useRuntimeConfig();
  const webhook = config.whatsappNotifyWebhook?.trim();
  if (!webhook) return false;

  await $fetch(webhook, {
    method: 'POST',
    body: {
      phone: normalizeWhatsAppPhone(String(config.whatsappNotifyPhone ?? '')),
      text,
      name: payload.name,
      email: payload.email,
      message: payload.message,
      locale: payload.locale ?? 'en',
      source: 'layanemoura.com/contact',
    },
    timeout: 12_000,
  });

  return true;
}

/** Notifica Layane no WhatsApp. Falhas são só logadas — o e-mail já foi enviado. */
export async function sendWhatsAppNotification(payload: ContactEmailPayload) {
  if (!isWhatsAppNotifyConfigured()) return;

  const config = useRuntimeConfig();
  const phone = normalizeWhatsAppPhone(String(config.whatsappNotifyPhone ?? ''));
  const text = buildContactWhatsAppText(payload);

  try {
    if (config.callmebotApiKey?.trim()) {
      await sendViaCallMeBot(phone, text);
      return;
    }

    if (config.whatsappNotifyWebhook?.trim()) {
      await sendViaWebhook(payload, text);
    }
  } catch (error) {
    console.error('[contact] WhatsApp notification failed', error);
  }
}
