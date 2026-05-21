<template>
  <ul class="flex items-center gap-3" role="list">
    <li v-for="link in site.social" :key="link.href">
      <a
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        class="flex h-10 w-10 items-center justify-center rounded-[var(--radius-ui)] border transition-all"
        :class="
          variant === 'footer'
            ? 'border-on-forest/30 text-on-forest hover:border-paper hover:bg-paper/10 hover:text-paper'
            : 'border-border text-cocoa hover:border-terracotta hover:text-terracotta'
        "
        :aria-label="link.label"
      >
        <SvgoInstagram v-if="link.icon === 'instagram'" class="h-4 w-4" />
        <SvgoLinkedin v-else-if="link.icon === 'linkedin'" class="h-4 w-4" />
        <SvgoBehance v-else-if="link.icon === 'behance'" class="h-4 w-4" />
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { site } from '~/data/site';

withDefaults(defineProps<{ variant?: 'default' | 'footer' }>(), {
  variant: 'default',
});
</script>
