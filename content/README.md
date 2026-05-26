# Conteúdo (Nuxt Content + Studio)

**Referência no repositório:** 1 projeto (`projects/hollow-crown-realms.yml`) e 1 depoimento (`reviews/sarah-mitchell.yml`). Duplique estes ficheiros no Studio para adicionar trabalhos reais.

### Studio e a galeria — como funciona

| O quê | Papel |
|--------|--------|
| **`content/projects/*.yml`** | Fonte de verdade — cada ficheiro = um projeto na galeria |
| **Nuxt Studio (`/_studio`)** | Edita esses YAML (e grava no Git em produção) |
| **`public/images/projects/{slug}/`** | Fotos referenciadas no YAML (`images[].src`) |
| **Pasta `.data/`** | Índice local do Nuxt Content (cache). Limpar: `npm run content:reset` |

### Cache e galeria “fantasma”

Várias camadas podem mostrar dados antigos:

| Camada | Sintoma | Solução |
|--------|---------|---------|
| **Índice `.data/`** | Projetos que já não têm YAML | `npm run content:reset` |
| **Payload Nuxt / `useAsyncData`** | Lista antiga após editar no Studio | Reiniciar dev ou `npm run dev:clean`; hard refresh (Cmd+Shift+R) |
| **HMR** | `published` alterado mas grelha igual | Código atualizado recarrega ao gravar YAML; mudar de separador e voltar à home |
| **Imagens `.thumb.*`** | Fotos antigas no browser | Cache longo em `/images/**` — hard refresh ou janela anónima |
| **Produção `swr`** | Home desatualizada ~1h após deploy | Removido SWR longo na home; novo deploy atualiza de imediato |

Em **dev**, a galeria lê só `content/projects/*.yml` (não o SQLite).

A galeria **não** lê uma base de dados separada que substitui o `content/` — lê a coleção **Projects** gerada a partir dos YAML.

## Projetos da galeria

Cada arquivo em `projects/{slug}.yml` é um projeto da home.

- **slug** = nome do arquivo (ex.: `hollow-crown-realms.yml`)
- **published** = `true` mostra na galeria; `false` oculta (rascunho)
- **highlight** = `true` fixa o projeto **no topo** da secção Maps ou More (destaque)
- **category** = secção da galeria: `maps` ou `more`
- **tags** = classificação livre (filtro dinâmico: só aparecem chips usados em algum projeto da secção)
  - Ex.: `travel`, `desert`, `fantasy-maps` — texto livre; gravamos como slug (`Desert` → `desert`)
  - Tradução opcional em `i18n` → `tags.desert`
- **Pasta de imagens**: `public/images/projects/{slug}/` (uma pasta por projeto — não deixar JPGs soltos na raiz)
- **Capa na grelha**: primeira entrada de `images`, ou por padrão `{slug}/01.jpg`
- **Várias fotos no modal**: `01.jpg`, `02.jpg`, `03.jpg`… no Studio (media picker); ordem = slideshow
- **Descrição do modal** (`description.en` / `description.pt`) — textarea no Studio; suporta **Markdown** (`**negrito**`, `*itálico*`, parágrafos com linha em branco)
- **links** = botões no modal (1 ou mais): `label.en` / `label.pt` + `url` (Behance, site do cliente, loja, etc.)

### Exemplo YAML

```yaml
published: true
highlight: false
title: Meu projeto
subtitle: Mapa de viagem
category: maps
tags:
  - travel
year: 2025
links:
  - label:
      en: View on Behance
      pt: Ver no Behance
    url: https://www.behance.net/gallery/123456789
  - label:
      en: Client website
      pt: Site do cliente
    url: https://example.com
description:
  en: English description with **bold** highlights for the modal.
  pt: Descrição em português com **negrito** no modal.
images:
  - src: /images/projects/meu-projeto/01.jpg
  - src: /images/projects/meu-projeto/02.jpg
layout: wide
```

Ao gravar `content/projects/meu-projeto.yml`, a pasta `public/images/projects/meu-projeto/` é criada automaticamente. **Apagar o YAML** remove essa pasta (e imagens). No Studio, media picker → `images/projects/meu-projeto/`. Favicons e loading ficam em **`public/design/`** (não misturar com projetos). `npm run projects:ensure-dirs` sincroniza pastas em falta e remove órfãs.

Um projeto pode ter **várias tags** (ex.: `tags: [travel, fantasy-maps]` só se ambas fizerem sentido na mesma secção `category`).

### Editar no Studio

1. `npm run dev`
2. A galeria lê **`content/projects/*.yml`** (o que editas no Studio). Apagar só imagens em `public/` **não** remove obras da galeria. Se aparecerem projetos que já não existem nos YAML, pare o servidor, corra **`npm run content:reset`** (limpa o índice local em `.data/`) e volte a `npm run dev`.
3. Abra **http://localhost:3000** (ou a porta do terminal) e use o **botão flutuante** no canto inferior esquerdo
4. Em desenvolvimento, `/_studio` redireciona para a home (middleware) — OAuth não é necessário no modo dev
5. Em produção: configure `STUDIO_GITHUB_*` no `.env` (ver `.env.example`), deploy com SSR (`nuxt build`), e aceda a `/_studio`

### Sincronizar a partir do mock legado

Se alterar `data/projects.ts` (script de seed):

```bash
npm run content:sync
```

Isso regenera os YAML em `content/projects/`.

## Depoimentos (reviews)

Cada arquivo em `reviews/{id}.yml` é um depoimento do carousel na home.

- **slug** = nome do arquivo a partir de quem fez o depoimento (ex.: `sarah-mitchell.yml` para Sarah Mitchell)
- **published** = `true` mostra no carousel; `false` oculta
- **order** = ordem no carousel (menor = primeiro)
- **quote** = texto do depoimento (`en` / `pt`)
- **clientName** = nome de quem fez o depoimento (ex.: Sarah Mitchell) — use o mesmo nome para o ficheiro
- **clientRole** = cargo (`en` / `pt`)
- **clientCompany** = empresa (opcional, mesmo texto nos dois idiomas)
- **projectType** = tipo de projeto sob o autor (opcional, `en` / `pt`)

### Exemplo YAML

```yaml
published: true
order: 10
quote:
  en: Layane captured the spirit of our destination…
  pt: A Layane capturou o espírito do nosso destino…
clientName: Sarah Mitchell
clientRole:
  en: Creative Director
  pt: Diretora criativa
clientCompany: Horizon Travel Co.
projectType:
  en: Travel illustration
  pt: Ilustração de viagem
```

Edite no **Nuxt Studio** (mesmo fluxo dos projetos): botão flutuante em `npm run dev`.

### Sincronizar a partir do mock legado

Se alterar `data/reviews.ts`:

```bash
npm run content:sync-reviews
```

Isso regenera os YAML em `content/reviews/`.

## Páginas (Pages)

Ficheiros em `pages/*.yml` — coleção **Pages** no Studio (não aparece em “Files”).

### Get in touch

`pages/get-in-touch.yml` — página de contacto.

- **photo** — imagem (media picker) + alt EN/PT (`{name}` = nome no site)
- **email** — e-mail de contacto
- **eyebrow**, **title**, **heading** — títulos EN/PT
- **about** — biografia (parágrafos separados por linha em branco)
- **aboutEmail** — linha com `{email}`
- Rótulos do formulário ficam em `i18n/locales/*.json` (`contact.form.*`), não no Studio

Assunto/corpo do `mailto:` continuam em `i18n` (`contact.mailSubject`, `contact.mailBody`).

### Sincronizar mock legado

```bash
npm run content:sync-contact
```

## Home (secções da página inicial)

### `home.yml`

Coleção **Home** no Studio — textos das secções Map making, Services (cabeçalho) e About (rótulos).

- **mapsAbout** — secção de mapas (foto, títulos, texto, botão)
- **servicesHeader** — eyebrow, título e CTA da grelha de serviços (os cards vêm da coleção Services)
- **aboutTeaser** — eyebrow e botão da secção sobre; biografia, foto e contacto vêm de **Get in touch**

Cada bloco tem **published** — desligar oculta a secção na home.

### `services/*.yml`

Coleção **Services** — um ficheiro por card de serviço na home.

- **published** — mostrar ou ocultar
- **order** (Posição na página) — `1` = primeiro card, `2` = segundo, `3` = terceiro…
- **icon** — ícone do card (`fantasyMaps`, `travelMaps`, `bookCovers`, `editorial`, `commercial`, `commissions`)
- **title**, **description** — EN/PT

### Sincronizar mock legado

```bash
npm run content:sync-home
npm run content:sync-services
```

## Redes sociais

Cada arquivo em `social/{slug}.yml` é um link (footer e página de contacto).

- **slug** = nome do ficheiro (ex.: `instagram.yml`) — deve coincidir com o **icon**
- **published** = mostrar ou ocultar
- **order** = ordem (menor = primeiro)
- **href** = URL do perfil
- **icon** = rede social (`behance`, `instagram`, `threads`, `whatsapp`, `email`, …) — o **nome no site** (aria-label) é automático: `instagram` → Instagram, `email` → Email, etc.
- Ficheiro = `instagram.yml` com `icon: instagram` (slug = ícone)

Para uma rede nova: SVG em `assets/images/icons/`, entrada em `socialDisplayNames` em `types/social.ts`, e ficheiro `nova-rede.yml`.

### Sincronizar mock legado

```bash
npm run content:sync-social
```
