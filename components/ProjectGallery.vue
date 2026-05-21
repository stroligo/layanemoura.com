<template>
  <TransitionGroup
    tag="div"
    name="gallery-reorder"
    class="gallery-organic"
    role="list"
  >
    <GalleryItem
      v-for="project in projects"
      :key="project.slug"
      :project="project"
      :dimmed="isDimmed(project)"
      role="listitem"
      @select="$emit('select', $event)"
    />
  </TransitionGroup>
</template>

<script setup lang="ts">
import type { Project } from '~/data/projects';
import type { GalleryGroup, ProjectCategory } from '~/data/site';

const props = defineProps<{
  projects: Project[];
  sectionGroup: GalleryGroup;
  activeGroup: GalleryGroup;
  highlightCategory: ProjectCategory | null;
}>();

defineEmits<{
  select: [project: Project];
}>();

function isDimmed(project: Project): boolean {
  if (!props.highlightCategory) return false;
  if (props.sectionGroup !== props.activeGroup) return false;
  return project.category !== props.highlightCategory;
}
</script>
