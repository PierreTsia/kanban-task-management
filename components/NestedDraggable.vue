<script lang="ts" setup>
import Draggable from 'vuedraggable'
import type { OrderListItem } from '~/composables/api'
import { BoardColumn, BoardTask } from '#components'

const props = withDefaults(
  defineProps<{ items: OrderListItem[]; type?: 'column' | 'task' }>(),
  {
    items: () => [],
    type: 'column',
  }
)

const emit = defineEmits<{
  (e: 'onItemsUpdated', t: 'column' | 'task'): void
}>()

const orderedItemdsIds = computed(() => {
  return props.items
})

watch(
  () => orderedItemdsIds,
  (newValues) => {
    if (!newValues?.value.length) {
      return
    }

    emit('onItemsUpdated', props.type)
  },
  { deep: true }
)

const draggableComponent = computed(() => {
  return props.type === 'column' ? BoardColumn : BoardTask
})
</script>

<template>
  <Draggable
    class="flex bg-gray-light dark:bg-black-dark"
    :class="{
      'flex-row h-full': type === 'column',
      'flex-col gap-y-2 p-4 min-h-95% cursor-grab': type === 'task',
    }"
    tag="ul"
    :list="items"
    :group="{ name: type }"
    item-key="name">
    <template #item="{ element }">
      <component :is="draggableComponent" :element="element">
        <NestedDraggable
          v-if="type === 'column'"
          :items="element.tasks"
          type="task"
          @on-items-updated="(t) => $emit('onItemsUpdated', t)" />
      </component>
    </template>
  </Draggable>
</template>
