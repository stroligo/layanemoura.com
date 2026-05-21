<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="project"
        class="project-modal"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        @click.self="emit('close')"
      >
        <div class="project-modal-backdrop" aria-hidden="true" />

        <div class="project-modal-panel">
          <button
            type="button"
            class="project-modal-close"
            :aria-label="t('modal.close')"
            @click="emit('close')"
          >
            <span aria-hidden="true">×</span>
          </button>

          <div class="project-modal-grid">
            <div class="project-modal-visual">
              <img
                v-if="project.image"
                :src="project.image"
                :alt="`${project.title} — ${project.subtitle}`"
                class="h-full w-full object-cover"
              />
              <div
                v-else
                class="h-full min-h-[240px] w-full"
                :style="placeholderStyle"
              />
            </div>

            <div class="project-modal-body">
              <p
                :id="titleId"
                class="font-inter text-xs uppercase tracking-[0.2em] text-terracotta"
              >
                {{ categoryLabel(project.category) }} · {{ project.year }}
              </p>
              <h2 class="mt-2 font-cormorant text-3xl text-cocoa md:text-4xl">
                {{ project.title }}
              </h2>
              <p class="mt-1 font-cormorant text-xl italic text-ink-muted">
                {{ project.subtitle }}
              </p>
              <p class="prose-site mt-6">
                {{ projectDescription }}
              </p>
              <p class="mt-4 font-inter text-sm text-ink-muted">
                <span class="font-medium text-cocoa">{{ t('modal.tools') }}</span>
                {{ project.tools.join(' · ') }}
              </p>
              <p class="mt-2 font-inter text-sm text-ink-muted">
                <span class="font-medium text-cocoa">{{ t('modal.views') }}</span>
                {{ project.views.toLocaleString() }}
              </p>
              <div class="mt-8 flex flex-wrap gap-3">
                <a
                  :href="project.behanceUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-primary"
                >
                  {{ t('modal.behance') }}
                </a>
                <NuxtLink
                  :to="localePath('/get-in-touch')"
                  class="btn-secondary"
                  @click="emit('close')"
                >
                  {{ t('modal.getInTouch') }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Project } from '~/data/projects';

const props = defineProps<{ project: Project | null }>();
const emit = defineEmits<{ close: [] }>();

const { t } = useI18n();
const localePath = useLocalePath();
const { categoryLabel } = useGalleryI18n();

const titleId = 'project-modal-title';

const projectDescription = computed(() => {
  if (!props.project) return '';
  return t(`projects.${props.project.slug}.description`);
});

const placeholderStyle = computed(() => {
  if (!props.project) return {};
  const p = props.project;
  return {
    background: `linear-gradient(165deg, color-mix(in srgb, ${p.thumbFrom} 70%, #faf8f4) 0%, color-mix(in srgb, ${p.thumbTo} 55%, #5a3e2b) 100%)`,
  };
});

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close');
}

watch(
  () => props.project,
  (value) => {
    if (!import.meta.client) return;
    document.removeEventListener('keydown', onEscape);
    if (value) {
      document.addEventListener('keydown', onEscape);
    }
  },
);

onUnmounted(() => {
  if (import.meta.client) {
    document.removeEventListener('keydown', onEscape);
  }
});
</script>
