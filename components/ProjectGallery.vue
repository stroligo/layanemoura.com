<template>
  <TransitionGroup
    tag="div"
    name="gallery-cards"
    class="gallery-organic"
  >
    <GalleryItem
      v-for="(project, index) in projects"
      :key="project.slug"
      :project="project"
      :dimmed="isDimmed(project)"
      :priority="index < priorityCoverCount"
      :style="{ '--gallery-stagger': Math.min(index, 14) }"
      @select="$emit('select', $event)"
    />
  </TransitionGroup>
</template>

<script setup lang="ts">
import { GALLERY_PRIORITY_COVER_COUNT } from '~/data/performance';
import type { Project } from '~/types/project';
import type { GalleryGroup, ProjectTag } from '~/data/site';

const priorityCoverCount = GALLERY_PRIORITY_COVER_COUNT;

const props = defineProps<{
  projects: Project[];
  sectionGroup: GalleryGroup;
  activeGroup: GalleryGroup;
  highlightTag: ProjectTag | null;
}>();

defineEmits<{
  select: [project: Project];
}>();

function isDimmed(project: Project): boolean {
  if (!props.highlightTag) return false;
  if (props.sectionGroup !== props.activeGroup) return false;
  return !project.tags.includes(props.highlightTag);
}
</script>
