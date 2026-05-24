<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="project"
        ref="modalRoot"
        class="project-modal"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="metaId"
        @click.self="emit('close')"
      >
        <button
          type="button"
          class="project-modal-backdrop"
          tabindex="-1"
          :aria-label="t('modal.close')"
          @click="emit('close')"
        />

        <div class="project-modal-shell">
          <button
            v-if="showProjectNav"
            type="button"
            class="project-modal-project-nav project-modal-project-nav--prev"
            :aria-label="t('modal.projectPrev')"
            @click="emit('prev')"
          >
            <span aria-hidden="true">←</span>
          </button>

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
              <ProjectDetailCarousel
                :key="project.slug"
                :images="project.images"
                :alt="`${project.title} — ${project.subtitle}`"
                class="project-modal-visual"
              />

              <div class="project-modal-body">
                <p :id="metaId" class="font-inter text-xs uppercase tracking-[0.2em] text-terracotta">
                  {{ groupLabel(project.category) }} · {{ project.year }}
                </p>
                <h2 :id="titleId" class="mt-2 font-cormorant text-3xl text-cocoa md:text-4xl">
                  {{ project.title }}
                </h2>
                <p class="mt-1 font-cormorant text-xl italic text-ink-muted">
                  {{ project.subtitle }}
                </p>
                <div
                  v-if="projectDescriptionHtml"
                  class="prose-site project-modal-description mt-6"
                  v-html="projectDescriptionHtml"
                />
                <ul
                  v-if="project.tags.length"
                  class="mt-4 flex flex-wrap gap-2"
                  :aria-label="t('modal.tagsAria')"
                >
                  <li
                    v-for="tag in project.tags"
                    :key="tag"
                    class="rounded-[var(--radius-ui)] border border-border/80 bg-surface/60 px-2.5 py-1 font-inter text-xs text-cocoa"
                  >
                    {{ tagLabel(tag) }}
                  </li>
                </ul>
                <div class="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
                  <a
                    v-for="(link, index) in project.links"
                    :key="`${link.url}-${index}`"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-primary"
                    :aria-label="
                      t('a11y.externalLink', {
                        label: projectLinkLabel(link.label),
                      })
                    "
                  >
                    {{ projectLinkLabel(link.label) }}
                  </a>
                  <NuxtLink :to="localePath('/get-in-touch')" class="btn-secondary" @click="emit('close')">
                    {{ t('modal.getInTouch') }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <button
            v-if="showProjectNav"
            type="button"
            class="project-modal-project-nav project-modal-project-nav--next"
            :aria-label="t('modal.projectNext')"
            @click="emit('next')"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Project } from '~/types/project';
import { projectDescriptionForLocale } from '~/types/project';
import { useDialogLock } from '~/composables/useDialogLock';
import { useFocusTrap } from '~/composables/useFocusTrap';

const props = defineProps<{
  project: Project | null;
  showProjectNav?: boolean;
}>();
const emit = defineEmits<{ close: []; prev: []; next: [] }>();

const { t, locale } = useI18n();
const localePath = useLocalePath();
const { groupLabel, tagLabel } = useGalleryI18n();
const { setDialogOpen } = useDialogLock();

const modalRoot = ref<HTMLElement | null>(null);
const modalActive = computed(() => Boolean(props.project));

const titleId = 'project-modal-title';
const metaId = 'project-modal-meta';

useFocusTrap(modalRoot, {
  active: modalActive,
  onEscape: () => emit('close'),
});

const projectDescriptionSource = computed(() => {
  if (!props.project) return '';
  const fromContent = projectDescriptionForLocale(props.project.description, locale.value);
  if (fromContent) return fromContent;

  const legacy = t(`projects.${props.project.slug}.description`);
  return legacy === `projects.${props.project.slug}.description` ? '' : legacy;
});

const projectDescriptionHtml = computed(() => projectDescriptionToHtml(projectDescriptionSource.value));

function projectLinkLabel(label: Project['links'][number]['label']): string {
  return projectDescriptionForLocale(label, locale.value);
}

function onKeydown(e: KeyboardEvent) {
  if (!props.project || !props.showProjectNav) return;
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    emit('prev');
  }
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    emit('next');
  }
}

watch(
  () => props.project,
  (value) => {
    setDialogOpen(Boolean(value));
    if (!import.meta.client) return;
    document.removeEventListener('keydown', onKeydown);
    if (value) {
      document.addEventListener('keydown', onKeydown);
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  setDialogOpen(false);
  if (import.meta.client) {
    document.removeEventListener('keydown', onKeydown);
  }
});
</script>
