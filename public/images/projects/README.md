# Imagens dos projetos (mock)

Capas geradas a partir de `ARQUIVOS/` via:

```bash
node scripts/seed-mock-from-arquivos.mjs
```

Cada ficheiro: `{slug}.jpg` — nomes fictícios (ex.: `elderfen-coast-chart.jpg`).

Para regenerar o mock após adicionar imagens em `ARQUIVOS/`, volte a correr o script.

## Variantes para o site (WebP + JPEG)

As variantes (`*.thumb.*`, `*.lg.*`) são geradas **automaticamente** em `npm run build` (só imagens novas ou alteradas).

Manual (opcional):

```bash
npm run images:optimize
npm run images:optimize -- --force
```

O **modal** e o **zoom** usam sempre o JPG original. A **grelha** usa as variantes `.thumb`.
