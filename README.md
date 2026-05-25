# layanemoura.com

Portfólio de **Layane Moura** — Nuxt 4 + Tailwind CSS 4.

## Páginas

| Rota | Conteúdo |
| --- | --- |
| `/` | **Home** — galeria orgânica (só imagens), filtro no topo, modal com detalhes do projeto |
| `/get-in-touch` | Foto, about, contactos e formulário |

Página interna: `/uikit` (design system).

## Comandos

```bash
npm install
npm run dev
npm run build
```

## Formulário de contacto (SMTP)

O formulário em `/get-in-touch` envia e-mail pelo servidor (`POST /api/contact`). Sem SMTP configurado → erro **503** na UI.

1. Copie `.env.example` para `.env` (ou use o `.env` já criado no projeto)
2. Preencha **`SMTP_PASS`** com a senha da caixa `hi@layanemoura.com` (Hostinger → E-mails)
3. Reinicie `npm run dev`
4. Teste: `npm run contact:test-smtp` (ligaçao) ou `npm run contact:test-smtp -- --send` (envia teste)

Guia completo: [Projeto/email-hostinger.md](./Projeto/email-hostinger.md)

### Aviso no WhatsApp (opcional)

Depois de cada envio com sucesso, o servidor pode mandar a mesma mensagem para o WhatsApp da Layane:

| Variável | Uso |
| --- | --- |
| `WHATSAPP_NOTIFY_ENABLED` | `true` para ativar |
| `WHATSAPP_NOTIFY_PHONE` | `5563992429380` (código do país + número, sem `+`) |
| `CALLMEBOT_API_KEY` | [CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/) — grátis; Layane regista o bot uma vez e copia a chave |
| `WHATSAPP_NOTIFY_WEBHOOK` | Alternativa: URL POST (Make/n8n) em vez de CallMeBot |

Se o WhatsApp falhar, o e-mail **continua enviado** — o erro só aparece no log do servidor.

## Projetos (Nuxt Content + Studio)

A galeria lê os projetos de **`content/projects/*.yml`**, editáveis com [Nuxt Studio](https://nuxt.studio/setup).

| Comando | Uso |
| --- | --- |
| `npm run dev` | Site + botão do Studio (edição local, sync com os ficheiros) |
| `npm run content:sync` | Gera YAML a partir de `data/projects.ts` (mock / seed) |

Capas em `public/images/projects/{slug}.jpg`. Ver `content/README.md` e `.env.example` para publicar em produção (GitHub OAuth + SSR).

Foto da artista: `public/images/layane.jpg` (substituir quando houver retrato final).

## Segurança

- **HTTP headers** em todas as respostas (`server/middleware/security-headers.ts`): CSP, HSTS (produção), `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, etc.
- **CSP** permite fontes Google, imagens `https:`, `form-action` com `mailto:` (formulário de contacto)
- **URLs validadas** em projetos, redes sociais e content (`utils/security.ts`) — bloqueia `javascript:`, `data:`, etc.
- **Markdown do modal** escapado; padrões perigosos (`<script`, `on*=`) mostrados como texto
- **Formulário de contacto** envia e-mail via API (`POST /api/contact`) + SMTP (ver `.env.example`)
- **Cookie de idioma** com `Secure` em produção
- **Segredos** só em `.env` (nunca `NUXT_PUBLIC_` para OAuth do Studio)
- **`/.well-known/security.txt`** — contacto para reporte responsável

## Performance

- Fontes Google carregadas de forma **assíncrona** (`plugins/fonts-async.client.ts`) — primeiro paint com fallbacks do sistema
- Galeria: **8 primeiras capas** com prioridade (`eager` / `preload`); restantes `lazy`
- Cache longo em `/images/**`, favicons e `/_nuxt/**` (ver `routeRules` em `nuxt.config.ts`)
- Páginas públicas com **SWR** (revalidação ~1 h)
- Assets públicos comprimidos no build (`nitro.compressPublicAssets`)

## Erros

- `error.vue` — 404, 500 e erros genéricos (layout do site, EN/PT)
- `pages/[...slug].vue` — rotas inexistentes → 404
- `ErrorState` — falha ao carregar galeria ou página de contacto (botão “Tentar novamente”)

## Acessibilidade

- Link **Saltar para o conteúdo** (teclado)
- Foco visível (`:focus-visible`) em controlos interativos
- Modal com focus trap, Escape, `aria-labelledby` no título
- Filtros com `aria-pressed`; itens filtrados desativados na galeria
- Carrosséis: setas só com foco no componente; autoplay desligado com `prefers-reduced-motion`
- Hierarquia de headings (H1 home, H2 galeria/reviews, H1 contacto)

## Deploy (Hostinger)

Este site é **Nuxt SSR** (não é só HTML estático). Precisa de plano com **Node.js** (ex.: *Business Web Hosting* / *VPS* / *Node.js Web App*), não só alojamento PHP.

| Passo | Ação |
| --- | --- |
| 1 | No painel Hostinger, cria app Node ou configura VPS com **Node 20** |
| 2 | Deploy do repositório Git (ou upload) com `npm ci` → `npm run build` |
| 3 | Comando de arranque: `npm run start` (corre `node .output/server/index.mjs`) |
| 4 | Variáveis de ambiente: copiar `.env.example` (SMTP, `NUXT_PUBLIC_SITE_URL`, Studio) |
| 5 | DNS do domínio `layanemoura.com`: registo **A** ou nameservers apontando para a **Hostinger** (não Locaweb) |

**Nuxt Studio (`/_studio`)** — ver [Projeto/studio-hostinger.md](./Projeto/studio-hostinger.md). Resumo:

- Defina `STUDIO_REPOSITORY_*` e `STUDIO_GITHUB_*` **antes** de `npm run build`
- Diagnóstico: `/api/studio-status` · ajuda se falhar: `/studio-setup`

**SMTP:** `SMTP_HOST=smtp.hostinger.com` (ou o que o painel indicar para o domínio).

Não uses pasta `build` como raiz do site — o Nitro gera `.output/public` + `.output/server`.

## SEO

- Meta tags, Open Graph e Twitter Card via `useSiteSeo` (por página)
- `hreflang` + canonical (`@nuxtjs/i18n`); URLs corrigidas se `.env` tiver localhost
- JSON-LD (`Person`, `WebSite`, `ContactPage`, `Review`)
- `/sitemap.xml` e `/robots.txt` dinâmicos (não commitar `public/sitemap.xml`)
- Produção: `NUXT_PUBLIC_SITE_URL=https://layanemoura.com` **antes** de `npm run build` (ver `.env.example`)
- Preview local do sitemap: `npm run sitemap:generate` → `sitemap.preview.xml`

## Analytics

- Google Analytics 4 (`G-75RXBJWSZC`) via `plugins/gtag.client.ts`
- Ativo em **produção**; em dev: `NUXT_PUBLIC_GTAG_DEV=true`
- Desligar: `NUXT_PUBLIC_GTAG_ID=` (vazio)

## Tokens

`src/css/tokens.css` — cores e tipografia (**Delius**, **Cormorant Garamond**, **Inter** via Google Fonts).

## Documentação

- [Cliente.md](./Cliente.md)
- [manual_identidade_visual_layane_moura_base.md](./manual_identidade_visual_layane_moura_base.md)
