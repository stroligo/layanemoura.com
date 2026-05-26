# Imagens por projeto (media / Studio)

Cada projeto tem **a sua pasta** — não misturar JPGs soltos na raiz de `projects/`.

```
projects/
  hollow-crown-realms/
    01.jpg          ← capa (grelha + 1.ª do modal)
    02.jpg          ← 2.ª foto do modal (opcional)
    03.jpg
    01.thumb.webp   ← gerado no build (não editar)
    01.lg.jpg
  outro-projeto/
    01.jpg
    02.jpg
```

## Pasta automática (Studio)

Ao criar ou gravar `content/projects/{slug}.yml`, o servidor cria **`public/images/projects/{slug}/`** (com `.gitkeep` para o Git).

No media picker do Studio, abre essa pasta e faz upload de `01.jpg`, `02.jpg`, etc.

**Apagar o projeto** (`content/projects/{slug}.yml`) remove automaticamente `public/images/projects/{slug}/` (em dev ao gravar; em deploy corre `npm run projects:ensure-dirs` para sincronizar).

```bash
npm run projects:ensure-dirs   # criar pastas em falta manualmente
```

## Regras

| Ficheiro | Função |
|----------|--------|
| `{slug}/01.jpg` | Capa na grelha e primeira imagem do modal |
| `{slug}/02.jpg`, `03.jpg`… | Restantes fotos do slideshow |
| `*.thumb.*` / `*.lg.*` | Gerados por `npm run build` — não apagar, não subir versões antigas à mão |

No YAML (`content/projects/{slug}.yml`), liste os caminhos na ordem do modal; a **primeira** é a capa:

```yaml
images:
  - src: /images/projects/meu-projeto/01.jpg
  - src: /images/projects/meu-projeto/02.jpg
```

Variantes: `npm run images:optimize` (ou automático no `npm run build`).
