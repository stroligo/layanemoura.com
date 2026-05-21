<template>
  <div class="flex min-h-screen flex-col bg-paper">
    <header class="border-b border-border bg-paper">
      <div
        class="container-fluid wrap flex items-center justify-between gap-4 py-4"
      >
        <NuxtLink
          to="/"
          class="font-sans text-sm text-terracotta hover:text-terracotta-dark"
        >
          ← Voltar ao site
        </NuxtLink>
        <span class="font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">
          UI Kit · uso interno
        </span>
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
