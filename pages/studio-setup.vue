<script setup lang="ts">
definePageMeta({
  layout: false,
  i18n: false,
});

const config = useRuntimeConfig();

if (config.public.studioInBuild) {
  await navigateTo('/_studio', { replace: true });
}
</script>

<template>
  <main class="studio-setup">
    <h1 class="studio-setup__title">Nuxt Studio não está ativo neste servidor</h1>
    <p class="studio-setup__lead">
      O editor em <code>/_studio</code> só funciona se o site for compilado com as
      variáveis do GitHub abaixo. Na Hostinger, defina-as no painel
      <strong>antes</strong> de correr <code>npm run build</code> e reinicie a app.
    </p>

    <ol class="studio-setup__steps">
      <li>
        <strong>Repositório</strong> (obrigatório no build)
        <ul>
          <li><code>STUDIO_REPOSITORY_OWNER</code> — utilizador ou org no GitHub</li>
          <li><code>STUDIO_REPOSITORY_REPO</code> — nome do repo (ex. <code>layanemoura.com</code>)</li>
          <li><code>STUDIO_REPOSITORY_BRANCH</code> — ex. <code>main</code></li>
        </ul>
      </li>
      <li>
        <strong>OAuth GitHub</strong> (login no editor)
        <ul>
          <li><code>STUDIO_GITHUB_CLIENT_ID</code></li>
          <li><code>STUDIO_GITHUB_CLIENT_SECRET</code></li>
          <li>
            Callback no GitHub:
            <code>https://layanemoura.com/_studio/auth/github/callback</code>
          </li>
        </ul>
      </li>
      <li>Correr de novo: <code>npm ci && npm run build && npm run start</code></li>
    </ol>

    <p class="studio-setup__meta">
      <a href="/">← Voltar ao site</a>
      ·
      <a href="/api/studio-status" target="_blank" rel="noopener">Ver diagnóstico (JSON)</a>
      ·
      <a href="/Projeto/studio-hostinger.md">Guia completo (repo)</a>
    </p>
  </main>
</template>

<style scoped>
.studio-setup {
  max-width: 40rem;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;
  font-family: var(--font-inter, system-ui, sans-serif);
  color: var(--color-ink, #1a1a1a);
  line-height: 1.55;
}

.studio-setup__title {
  font-family: var(--font-cormorant, Georgia, serif);
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 1rem;
}

.studio-setup__lead {
  margin: 0 0 1.5rem;
  color: var(--color-ink-muted, #555);
}

.studio-setup__steps {
  margin: 0 0 1.5rem;
  padding-left: 1.25rem;
}

.studio-setup__steps li {
  margin-bottom: 1rem;
}

.studio-setup__steps ul {
  margin: 0.35rem 0 0;
  padding-left: 1.1rem;
}

.studio-setup code {
  font-size: 0.88em;
  background: rgba(0, 0, 0, 0.06);
  padding: 0.1em 0.35em;
  border-radius: 3px;
  word-break: break-all;
}

.studio-setup__meta {
  margin: 0;
  font-size: 0.9rem;
}

.studio-setup__meta a {
  color: var(--color-terracotta, #c45a2a);
}
</style>
