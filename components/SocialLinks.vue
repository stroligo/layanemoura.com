<template>
  <ul
    v-if="socialLinks.length"
    :class="listClass"
    role="list"
  >
    <li v-for="link in socialLinks" :key="link.id">
      <a
        :href="link.href"
        :target="link.icon === 'email' ? undefined : '_blank'"
        :rel="link.icon === 'email' ? undefined : 'noopener noreferrer'"
        class="flex items-center justify-center rounded-[var(--radius-ui)] border transition-all"
        :class="
          variant === 'footer'
            ? 'h-9 w-9 border-on-forest/25 text-on-forest hover:border-paper/60 hover:bg-paper/10 hover:text-paper'
            : 'h-10 w-10 border-border text-cocoa hover:border-terracotta hover:text-terracotta'
        "
        :aria-label="link.label"
      >
        <IconsSocialBehanceIcon v-if="link.icon === 'behance'" />
        <SvgoInstagram
          v-else-if="link.icon === 'instagram'"
          class="h-4 w-4 shrink-0 fill-current"
          aria-hidden="true"
        />
        <IconsSocialThreadsIcon v-else-if="link.icon === 'threads'" />
        <SvgoLinkedin
          v-else-if="link.icon === 'linkedin'"
          class="h-4 w-4 shrink-0 fill-current"
          aria-hidden="true"
        />
        <SvgoTwitter
          v-else-if="link.icon === 'twitter'"
          class="h-4 w-4 shrink-0 fill-current"
          aria-hidden="true"
        />
        <SvgoFacebook
          v-else-if="link.icon === 'facebook'"
          class="h-4 w-4 shrink-0 fill-current"
          aria-hidden="true"
        />
        <SvgoWhatsapp
          v-else-if="link.icon === 'whatsapp'"
          class="h-4 w-4 shrink-0 fill-current"
          aria-hidden="true"
        />
        <SvgoEmail
          v-else-if="link.icon === 'email'"
          class="h-4 w-4 shrink-0 fill-current"
          aria-hidden="true"
        />
        <span v-else class="font-inter text-xs font-semibold uppercase">
          {{ link.label.charAt(0) }}
        </span>
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ variant?: 'default' | 'footer' }>(), {
  variant: 'default',
});

const { socialLinks } = useSocialLinks();

const listClass = computed(() =>
  props.variant === 'footer'
    ? 'site-footer__social'
    : 'social-links flex flex-row flex-wrap items-center gap-2 sm:gap-2.5',
);
</script>
