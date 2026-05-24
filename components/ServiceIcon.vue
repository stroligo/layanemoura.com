<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    class="service-icon"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    stroke-width="1.35"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <g v-if="name === 'fantasyMaps'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <path d="M12 8l2.5 4-2.5 4-2.5-4z" />
    </g>
    <g v-else-if="name === 'travelMaps'">
      <path d="M4 6l6-2 4 2 6-2v14l-6 2-4-2-6 2V6z" />
      <path d="M10 4v14M14 6v14" />
      <circle cx="16" cy="9" r="1.5" fill="currentColor" stroke="none" />
    </g>
    <g v-else-if="name === 'bookCovers'">
      <path d="M5 4h10a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H5V4z" />
      <path d="M5 4v14a2 2 0 0 0 2 2h10" />
      <path d="M9 8h6M9 11h4" />
    </g>
    <g v-else-if="name === 'editorial'">
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M12 5v14" />
      <path d="M6 9h4M6 12h4M15 9h3M15 14h3" />
    </g>
    <g v-else-if="name === 'commercial'">
      <path d="M12 3l8 4.5v9L12 21 4 16.5v-9L12 3z" />
      <path d="M12 12v9M4 7.5l8 4.5 8-4.5" />
    </g>
    <g v-else-if="name === 'commissions'">
      <path d="M4 20l8-8" />
      <path d="M14 6l4 4-6 6-4-4z" />
      <path d="M16 4l4 4" />
      <circle cx="6" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import type { ServiceId } from '~/types/service';

defineProps<{
  name: ServiceId;
}>();
</script>
