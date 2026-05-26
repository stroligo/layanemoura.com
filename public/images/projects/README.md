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
