# Novos trabalhos (More)

Coloque aqui **só** os ficheiros JPG, PNG ou GIF de projetos novos da secção **More** (capas, editorial, etc.).

## Nomes dos ficheiros

Igual a `NOVOS MAPAS/` e `MAPAS/`:

| Ficheiro | Significado |
|----------|-------------|
| `Título - Subtítulo 1.jpg` | Título + subtítulo, imagem 1 |
| `Nome do Projeto 2.png` | Mesmo projeto, imagem 2 |

## Comando

```bash
npm run more:import-novos
```

O script:

1. Cria `public/images/projects/{slug}/` com `NN.webp`, `NN.thumb.webp`, `NN.display.webp`
2. Cria ou atualiza `content/projects/{slug}.yml` com **`category: more`**
3. **Apaga** os ficheiros desta pasta após sucesso

Pré-visualizar:

```bash
npm run more:import-novos:dry
```
