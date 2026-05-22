# Nuxt Studio na Hostinger — passo a passo

O editor **não** é um painel PHP. Precisa de **Node.js** com build SSR.

## 1. Variáveis no painel (Environment)

Defina **antes** do build:

| Variável | Exemplo |
|----------|---------|
| `STUDIO_REPOSITORY_OWNER` | `gabrielstroligo` |
| `STUDIO_REPOSITORY_REPO` | `layanemoura.com` |
| `STUDIO_REPOSITORY_BRANCH` | `main` |
| `STUDIO_GITHUB_CLIENT_ID` | (OAuth App) |
| `STUDIO_GITHUB_CLIENT_SECRET` | (OAuth App) |
| `NUXT_PUBLIC_SITE_URL` | `https://layanemoura.com` |

Sem `STUDIO_REPOSITORY_*` o comando `npm run build` **não inclui** o Studio → `/_studio` dá 404 ou página de ajuda.

## 2. GitHub OAuth App

1. https://github.com/settings/developers → **New OAuth App**
2. **Homepage URL:** `https://layanemoura.com`
3. **Authorization callback URL:** `https://layanemoura.com/__nuxt_studio/auth/github`  
   (não use `/_studio/auth/...` — o GitHub rejeita se o URL não coincidir byte a byte)
4. Copie Client ID e Client Secret para as variáveis acima.

O utilizador GitHub que edita precisa de **acesso de escrita** ao repositório.

## 3. Deploy na Hostinger

```bash
npm ci
npm run build
npm run start
```

Node **20**. Comando de arranque: `npm run start` (porta definida pelo painel, ex. `PORT=3000`).

## 4. Verificar

- https://layanemoura.com/api/studio-status → `"studioInBuild": true`
- https://layanemoura.com/_studio → ecrã de login GitHub (não 404)

## Problemas comuns

| Sintoma | Causa |
|---------|--------|
| 404 em `/_studio` | Build sem `STUDIO_REPOSITORY_*` |
| Página “Studio não está ativo” | Igual — refazer build com env |
| Login GitHub falha | Callback URL errada ou secret incorreto |
| Alterações não gravam | Repo errado ou sem permissão no GitHub |

Alternativa em desenvolvimento: `npm run dev` e botão flutuante do Studio (sem OAuth).
