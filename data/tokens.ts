/** Referência dos tokens (valores em src/css/tokens.css) */

export const fonts = [
  {
    name: 'Delius',
    token: 'delius',
    role: 'Logo / assinatura',
    source: 'Google Fonts',
  },
  {
    name: 'Cormorant Garamond',
    token: 'cormorant',
    role: 'Títulos editoriais',
    source: 'Google Fonts',
  },
  {
    name: 'Inter',
    token: 'inter',
    role: 'UI, textos, formulários',
    source: 'Google Fonts',
  },
] as const;

export const colors = [
  { name: 'Terracotta', token: 'terracotta', hex: '#C45A2A' },
  { name: 'Ochre', token: 'ochre', hex: '#D69A3C' },
  { name: 'Olive', token: 'olive', hex: '#6F7A3E' },
  { name: 'Forest', token: 'forest', hex: '#2F5E56' },
  { name: 'Cocoa', token: 'cocoa', hex: '#5A3E2B' },
  { name: 'Surface', token: 'surface', hex: '#F2E8DA' },
  { name: 'Border', token: 'border', hex: '#DDD6C7' },
  { name: 'Paper', token: 'paper', hex: '#FAF8F4' },
] as const;

export const shadows = [
  { level: 0, class: 'shadow-elevation-0', label: 'Nível 0 — flat' },
  { level: 1, class: 'shadow-elevation-1', label: 'Nível 1' },
  { level: 2, class: 'shadow-elevation-2', label: 'Nível 2' },
  { level: 3, class: 'shadow-elevation-3', label: 'Nível 3' },
] as const;

export const typography = [
  {
    name: 'Delius',
    sample: 'layane moura',
    class: 'font-delius text-5xl text-cocoa',
    spec: 'Logo — assinatura orgânica (Google Fonts)',
  },
  {
    name: 'Cormorant Garamond',
    sample: 'Layane Moura',
    class: 'font-cormorant text-4xl text-cocoa',
    spec: 'Títulos — Medium / SemiBold',
  },
  {
    name: 'Inter',
    sample: 'Ilustradora & Map Maker',
    class: 'font-inter text-lg text-cocoa',
    spec: 'Textos e descrições — Regular',
  },
  {
    name: 'Inter',
    sample: 'HOME · GET IN TOUCH!',
    class: 'font-inter text-xs uppercase tracking-[0.2em] text-cocoa',
    spec: 'UI — menu, botões, labels',
  },
] as const;
