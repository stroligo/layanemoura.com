/**
 * Testa variáveis SMTP do .env (sem enviar e-mail real, a menos que --send).
 * Uso: npm run contact:test-smtp
 *      npm run contact:test-smtp -- --send
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import nodemailer from 'nodemailer';

function loadDotEnv() {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) {
    console.error('❌ Ficheiro .env não encontrado. Copie .env.example → .env');
    process.exit(1);
  }

  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

function required(name: string) {
  return process.env[name]?.trim() || '';
}

async function main() {
  loadDotEnv();

  const config = {
    host: required('SMTP_HOST'),
    port: Number(required('SMTP_PORT') || '587'),
    secure: required('SMTP_SECURE') === 'true',
    user: required('SMTP_USER'),
    pass: required('SMTP_PASS'),
    to: required('CONTACT_TO_EMAIL'),
    from: required('CONTACT_FROM_EMAIL') || required('SMTP_USER'),
  };

  const missing = [
    !config.host && 'SMTP_HOST',
    !config.user && 'SMTP_USER',
    !config.pass && 'SMTP_PASS',
    !config.to && 'CONTACT_TO_EMAIL',
  ].filter(Boolean);

  if (missing.length) {
    console.error('❌ Variáveis em falta no .env:', missing.join(', '));
    process.exit(1);
  }

  console.log('✓ Variáveis SMTP presentes');
  console.log(`  Host: ${config.host}:${config.port} (secure=${config.secure})`);
  console.log(`  User: ${config.user}`);
  console.log(`  To:   ${config.to}`);

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
  });

  console.log('\nA verificar ligação SMTP…');
  await transporter.verify();
  console.log('✓ Ligação SMTP OK');

  if (!process.argv.includes('--send')) {
    console.log('\nPara enviar e-mail de teste: npm run contact:test-smtp -- --send');
    return;
  }

  await transporter.sendMail({
    from: `"Layane Moura Website" <${config.from}>`,
    to: config.to,
    subject: 'Teste SMTP — layanemoura.com',
    text: 'Se recebeu isto, o formulário de contacto pode enviar e-mails.',
  });

  console.log('✓ E-mail de teste enviado para', config.to);
}

main().catch((error) => {
  console.error('❌ Falha SMTP:', error instanceof Error ? error.message : error);
  process.exit(1);
});
