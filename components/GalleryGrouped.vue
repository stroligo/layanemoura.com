<template>
  <div class="gallery-groups">
    <Transition name="gallery-group-switch" mode="out-in">
      <section
        v-if="currentGroup"
        :key="currentGroup.id"
        class="gallery-group"
        :aria-label="currentGroup.label"
      >
        <ProjectGallery
          :projects="currentGroup.projects"
          :section-group="currentGroup.id"
          :active-group="activeGroup"
          :highlight-tag="highlightTag"
          @select="$emit('select', $event)"
        />
      </section>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Project } from '~/types/project';
import type { GalleryGroupBlock } from '~/composables/useProjects';
import type { GalleryGroup, ProjectTag } from '~/data/site';

const props = defineProps<{
  groups: GalleryGroupBlock[];
  activeGroup: GalleryGroup;
  highlightTag: ProjectTag | null;
}>();

defineEmits<{
  select: [project: Project];
}>();

const currentGroup = computed(() => props.groups[0] ?? null);
</script>
