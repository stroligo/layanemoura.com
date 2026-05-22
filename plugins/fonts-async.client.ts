/**
 * Carrega Google Fonts sem bloquear o primeiro render (print → all).
 * Fallback tipográfico em tokens.css até as fontes chegarem.
 */
const GOOGLE_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Delius&family=Inter:wght@400;500;600&display=swap';

export default defineNuxtPlugin(() => {
  const id = 'lm-google-fonts';
  if (document.getElementById(id)) return;

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = GOOGLE_FONTS_HREF;
  link.media = 'print';
  link.onload = () => {
    link.media = 'all';
  };
  document.head.appendChild(link);
});
