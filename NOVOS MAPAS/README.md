# Novos mapas

Coloque aqui **só** os ficheiros JPG, PNG ou GIF de projetos novos (ou imagens extra de um projeto existente).

## Nomes dos ficheiros

Igual à pasta `MAPAS/`:

| Ficheiro | Significado |
|----------|-------------|
| `The Island 1.jpg` | Projeto *The Island*, imagem 1 |
| `The Island 2.png` | Mesmo projeto, imagem 2 |
| `Título - Subtítulo 1.jpg` | Título + subtítulo, imagem 1 |

## Comando

```bash
npm run mapas:import-novos
```

O script:

1. Cria `public/images/projects/{slug}/` com `NN.webp`, `NN.thumb.webp`, `NN.display.webp`
2. Cria ou atualiza `content/projects/{slug}.yml`
3. **Apaga** os ficheiros desta pasta após sucesso

Pré-visualizar sem alterar nada:

```bash
npm run mapas:import-novos:dry
```

Para a secção **More**, use a pasta [`NOVOS MORE/`](../NOVOS%20MORE/) e `npm run more:import-novos`.
