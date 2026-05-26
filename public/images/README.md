# Imagens do site (media / Studio)

| Caminho | Uso |
|---------|-----|
| `projects/{slug}/01.jpg`, `02.jpg`… | Uma pasta por projeto; variantes `.thumb` / `.lg` geradas no build |
| `about.JPG` | Foto na página Contact e secção About na home |
| `og-share.jpg` | Partilha em redes (Open Graph) — gerada com `npm run og:generate` |

**Não colocar** retratos ou OG aqui com variantes manuais — o script de otimização só processa `projects/`.
