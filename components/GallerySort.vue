<template>
  <div class="gallery-sort-controls" role="group" :aria-label="t('gallery.sortAria')">
    <label class="gallery-sort-label" :for="selectId">
      {{ t('gallery.sortBy') }}
    </label>
    <select
      :id="selectId"
      class="gallery-sort-select"
      :value="sortValue"
      @change="onSortChange"
    >
      <option
        v-for="choice in sortChoices"
        :key="choice.id"
        :value="choice.id"
      >
        {{ choice.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { SortDirection, SortField } from '~/data/site';

const { t } = useI18n();
const { sortChoices } = useGalleryI18n();

const props = defineProps<{
  sortField: SortField;
  sortDirection: SortDirection;
  /** id único quando há vários selects na página */
  selectId?: string;
}>();

const emit = defineEmits<{
  'set-sort': [field: SortField, direction: SortDirection];
}>();

const selectId = computed(
  () => props.selectId ?? 'gallery-sort-select',
);

const sortValue = computed(
  () => `${props.sortField}:${props.sortDirection}`,
);

function onSortChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  const [field, direction] = value.split(':') as [SortField, SortDirection];
  emit('set-sort', field, direction);
}
</script>
