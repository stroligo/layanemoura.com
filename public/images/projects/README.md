# Imagens por projeto

```
meu-projeto/
  01.webp           ← master (upload JPG/PNG convertido no build; lightbox)
  01.thumb.webp     ← grelha + miniaturas do slider (~800px)
  01.display.webp   ← imagem grande do slider (~2000px)
```

| Ficheiro | Onde |
|----------|------|
| `*.thumb.webp` | Grelha da home + miniaturas no modal |
| `*.display.webp` | Imagem principal do slider |
| `NN.webp` | Lightbox (zoom) |

## Upload (Studio)

A cliente pode enviar **`01.jpg`**, **`01.png`**, **`01.gif`** ou **`01.webp`**.

No **`npm run build`** (automático no deploy):

1. JPG/PNG/GIF → `NN.webp` (master WebP; GIF animado usa o primeiro frame)
2. Gera `NN.thumb.webp` e `NN.display.webp`

Em dev, após mudar imagens: `npm run images:optimize`

No YAML, use sempre:

```yaml
images:
  - src: /images/projects/meu-projeto/01.webp
```
