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

## Imagens dos projetos

Capas dos projetos estão em `public/images/projects/` (baixadas do Behance; ver `scripts/fetch-behance-covers.sh`). Referenciadas em `data/projects.ts` via `image: '/images/projects/{slug}.jpg'`. Sem `image`, a grelha usa gradiente placeholder.

Foto da artista: `public/images/layane.jpg` (substituir quando houver retrato final).

## Tokens

`src/css/tokens.css` — cores e tipografia (**Delius**, **Cormorant Garamond**, **Inter** via Google Fonts).

## Documentação

- [Cliente.md](./Cliente.md)
- [manual_identidade_visual_layane_moura_base.md](./manual_identidade_visual_layane_moura_base.md)
