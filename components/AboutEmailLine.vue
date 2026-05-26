<template>
  <p>
    <template v-if="parts">
      {{ parts.before }}<a :href="mailtoHref" :class="linkClass">{{ email }}</a>{{ parts.after }}
    </template>
    <template v-else>{{ line }}</template>
  </p>
</template>

<script setup lang="ts">
import { aboutEmailParts } from '~/utils/aboutEmailLine';

const props = withDefaults(
  defineProps<{
    line: string;
    email: string;
    linkClass?: string;
  }>(),
  { linkClass: 'home-about__email' },
);

const mailtoHref = computed(() => `mailto:${props.email}`);
const parts = computed(() => aboutEmailParts(props.line, props.email));
</script>
