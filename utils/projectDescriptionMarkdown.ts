import { isDangerousRichText, stripControlChars } from '~/utils/security';

/** Markdown simples para descrições do modal (sem HTML cru do editor). */
function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineMarkdown(text: string) {
  let html = escapeHtml(text);
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');
  html = html.replace(/\n/g, '<br>');
  return html;
}

export function projectDescriptionToHtml(markdown: string): string {
  const trimmed = stripControlChars(markdown);
  if (!trimmed) return '';

  if (isDangerousRichText(trimmed)) {
    return `<p>${escapeHtml(trimmed)}</p>`;
  }

  return trimmed
    .split(/\n\s*\n/)
    .map((block) => `<p>${inlineMarkdown(block.trim())}</p>`)
    .join('');
}
