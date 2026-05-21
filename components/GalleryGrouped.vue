<template>
  <TransitionGroup
    tag="div"
    name="gallery-group-reorder"
    class="gallery-groups"
  >
    <section
      v-for="block in groups"
      :key="block.id"
      class="gallery-group"
      :aria-label="block.label"
    >
      <ProjectGallery
        :projects="block.projects"
        :section-group="block.id"
        :active-group="activeGroup"
        :highlight-category="highlightCategory"
        @select="$emit('select', $event)"
      />
    </section>
  </TransitionGroup>
</template>

<script setup lang="ts">
import type { Project } from '~/data/projects';
import type { GalleryGroupBlock } from '~/composables/useProjects';
import type { GalleryGroup, ProjectCategory } from '~/data/site';

defineProps<{
  groups: GalleryGroupBlock[];
  activeGroup: GalleryGroup;
  highlightCategory: ProjectCategory | null;
}>();

defineEmits<{
  select: [project: Project];
}>();
</script>
