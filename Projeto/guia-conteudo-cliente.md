# Guia de conteúdo — layanemoura.com

**Para:** Layane Moura  
**De:** Stroligo (desenvolvimento do site)  
**Objetivo:** Reunir textos, imagens e depoimentos para publicar no portfólio sem precisar editar código.

---

## 1. O que precisamos de si

### Projetos (obras da galeria na página inicial)

Para **cada obra** que quiser publicar:

| Item | Descrição |
|------|-----------|
| Título | Nome curto da obra (ex.: *Bruma*) |
| Subtítulo | Tipo de trabalho (ex.: *Archipelago Map*, *Book Cover*) |
| Secção | **Mapas** ou **Mais** (ilustração, capas, editorial, etc.) |
| Tags | 2 a 4 palavras para filtro (ex.: *travel*, *fantasy-maps*, *book-cover*) |
| Ano | Ano de conclusão (ex.: 2025) |
| Descrição | Texto para o modal — **em inglês e em português** |
| Imagens | Foto de capa + fotos extra (opcional) para o slideshow |
| Links | Behance, site do cliente, loja, etc. (opcional) |
| Destaque | Indicar se é obra principal (fica no topo da secção) |

### Depoimentos (carousel na página inicial)

Para **cada depoimento**:

| Item | Descrição |
|------|-----------|
| Citação | Texto do depoimento — **inglês e português** |
| Nome | Quem escreveu (ex.: Sarah Mitchell) |
| Cargo | Em inglês e português (ex.: Creative Director / Diretora criativa) |
| Empresa | Opcional |
| Tipo de projeto | Linha curta sob o nome (opcional, ex.: *Travel illustration*) |
| Ordem | Qual depoimento deve aparecer primeiro (1.º, 2.º, 3.º…) |
| Autorização | Confirmar que pode publicar nome e texto no site |

### Imagens — regras importantes

- Formato: **JPG** ou **PNG**, boa resolução (idealmente largura mínima ~1200 px).
- Nome do ficheiro: **sem espaços**, sem acentos, palavras separadas por hífen.
- **Capa** (aparece na grelha): `nome-do-projeto.jpg`  
  Ex.: `cedar-lane-atlas.jpg`
- **Fotos extra** (modal): pasta com o mesmo nome + `02.jpg`, `03.jpg`…  
  Ex.: `cedar-lane-atlas/02.jpg`, `cedar-lane-atlas/03.jpg`

O **nome do ficheiro** deve ser o mesmo “apelido” usado no título do projeto (slug).  
Ex.: obra *Cedar Lane — City Atlas* → ficheiros `cedar-lane-atlas.jpg`

---

## 2. Duas formas de nos enviar o conteúdo

### Opção A — Editar no site (recomendado, se tivermos acesso Studio)

Quando o site estiver em modo de edição, pode alterar projetos e depoimentos num **formulário no browser** (botão no canto do ecrã). Nesse caso, só precisa de:

- Textos em EN e PT  
- Upload ou envio das imagens com nomes corretos  
- Indicar destaques e ordem dos depoimentos  

A equipa de desenvolvimento configura o primeiro acesso.

### Opção B — Pasta ou e-mail com ficheiros

Envie uma pasta (Google Drive, Dropbox, WeTransfer) com:

```
layanemoura-conteudo/
├── projetos/
│   ├── cedar-lane-atlas.yml      (um ficheiro por obra)
│   ├── bruma-archipelago.yml
│   └── …
├── depoimentos/
│   ├── sarah-mitchell.yml        (um ficheiro por pessoa)
│   └── …
└── imagens/
    ├── cedar-lane-atlas.jpg
    ├── cedar-lane-atlas/
    │   ├── 02.jpg
    │   └── 03.jpg
    └── …
```

Os ficheiros `.yml` são texto simples (pode copiar os modelos abaixo para Word/Notion e nós convertemos, se preferir).

---

## 3. Modelo — projeto (obra)

**Nome do ficheiro:** `nome-do-projeto.yml` (ex.: `bruma-archipelago.yml`)

```yaml
published: true
highlight: false

title: Bruma
subtitle: Archipelago Map

category: maps
tags:
  - fantasy-maps
  - travel

year: 2023

layout: tall

description:
  en: |
    English description for the project modal. You can use **bold** and *italic*.
    Leave a blank line between paragraphs.
  pt: |
    Descrição em português para o modal. Pode usar **negrito** e *itálico*.
    Linha em branco entre parágrafos.

images:
  - src: /images/projects/bruma-archipelago.jpg
  - src: /images/projects/bruma-archipelago/02.jpg

links:
  - label:
      en: View on Behance
      pt: Ver no Behance
    url: https://www.behance.net/layanemds
```

### Significado dos campos

| Campo | Valores / notas |
|-------|------------------|
| `published` | `true` = publicado · `false` = rascunho (não aparece) |
| `highlight` | `true` = obra em destaque no topo da secção |
| `title` | Título curto |
| `subtitle` | Subtítulo / tipo de obra |
| `category` | `maps` (mapas) ou `more` (outros trabalhos) |
| `tags` | Lista de palavras-chave (filtro da galeria) |
| `year` | Ano (número, ex.: 2025) |
| `layout` | `normal` · `tall` (cartão mais alto) · `wide` (cartão largo) — podemos ajustar depois |
| `description.en` / `description.pt` | Texto longo do modal |
| `images` | Lista por ordem; a **primeira** é a capa na grelha |
| `links` | Botões opcionais (rótulo EN/PT + URL) |

---

## 4. Modelo — depoimento

**Nome do ficheiro:** baseado no nome da pessoa (ex.: `sarah-mitchell.yml`)

```yaml
published: true
order: 10

quote:
  en: Layane captured the spirit of our destination with a map that feels both informative and full of soul.
  pt: A Layane capturou o espírito do nosso destino com um mapa informativo e cheio de alma.

clientName: Sarah Mitchell

clientRole:
  en: Creative Director
  pt: Diretora criativa

clientCompany: Horizon Travel Co.

projectType:
  en: Travel illustration
  pt: Ilustração de viagem
```

### Significado dos campos

| Campo | Notas |
|-------|--------|
| `published` | `true` = visível no site · `false` = oculto |
| `order` | Ordem no carousel: **número menor = aparece primeiro** (ex.: 10, 20, 30) |
| `quote.en` / `quote.pt` | Texto do depoimento |
| `clientName` | Nome de quem deu o depoimento |
| `clientRole` | Cargo em EN e PT |
| `clientCompany` | Opcional |
| `projectType` | Opcional — frase curta sob o autor |

---

## 5. Checklist antes de enviar

### Por projeto

- [ ] Título e subtítulo definidos  
- [ ] Secção: mapas ou mais  
- [ ] Tags (2–4)  
- [ ] Ano  
- [ ] Descrição em **inglês** e **português**  
- [ ] Imagem de capa com nome correto (`slug.jpg`)  
- [ ] Fotos extra na pasta (se houver)  
- [ ] Links (Behance, etc.) — se aplicável  
- [ ] Marcar se é destaque (`highlight: true`)  

### Por depoimento

- [ ] Texto em inglês e português  
- [ ] Nome e cargo (EN/PT)  
- [ ] Empresa e tipo de projeto (se quiser)  
- [ ] Ordem de apresentação  
- [ ] Autorização para publicar  

### Geral

- [ ] Imagens em JPG/PNG, boa qualidade  
- [ ] Nomes de ficheiros sem espaços nem acentos  

---

## 6. Dúvidas frequentes

**Preciso escrever em YAML?**  
Não obrigatoriamente. Pode enviar Word, Google Docs ou tabela com os mesmos campos; nós passamos para o formato do site.

**Quantos projetos posso publicar?**  
Todos os que quiser; pode começar com um lote (ex.: 12–20 obras) e acrescentar depois.

**E se só tiver texto num idioma?**  
Envie o que tiver; podemos ajudar na revisão do segundo idioma ou publicar só um idioma temporariamente.

**Quem escolhe `layout` (normal / tall / wide)?**  
Pode deixar `normal` ou indicar na pasta “vertical / horizontal”; ajustamos na montagem da galeria.

**Os textos do formulário de contacto e menus também mudam aqui?**  
Neste pacote focamos **galeria** e **depoimentos**. Bio, e-mail e redes tratamos noutro passo (ou no Studio, secção Pages / Social).

---

## 7. Contacto

Envie o material para o e-mail / Drive combinado com a Stroligo.  
Qualquer dúvida sobre um campo, envie o rascunho — é mais fácil corrigir antes de publicar.

*Documento gerado para layanemoura.com — maio 2026*
