<script lang="ts" setup>
import Draggable from 'vuedraggable'
import type { OrderListItem } from '~/composables/api'
import { BoardColumn, BoardTask } from '#components'

const props = withDefaults(
  defineProps<{
    items: OrderListItem[]
    type?: 'column' | 'task'
    handle?: string
  }>(),
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
  <div class="flex no-wrap flex-1  min-w-95% p-4">
    <Draggable
      class="flex bg-gray-light dark:bg-black-dark"
      :class="{
        'flex-row w-full justify-start': type === 'column',
        'flex-col gap-y-4 p-4  min-h-[calc(100vh-125px)] flex-1 w-full cursor-grab':
          type === 'task',
      }"
      tag="ul"
      :list="items"
      :group="{ name: type }"
      item-key="name">
      <template #item="{ element }">
        <div class="flex">
          <component
            :is="draggableComponent"
            :element="element"
            class="drag-only-this">
            <NestedDraggable
              v-if="type === 'column'"
              :items="element.tasks"
              type="task"
              @on-items-updated="(t) => $emit('onItemsUpdated', t)" />
          </component>
        </div>
      </template>
    </Draggable>
    <div v-if="type === 'column'" class="w-420px h-full pt-10 ml-auto px-4">
      <div
        class="cursor-pointer group w-full h-90% bg-gray-medium dark:bg-black-medium bg-opacity-80 hover:bg-opacity-100 rounded-lg flex items-center justify-center">
        <h5
          class="heading heading-xl text-gray-dark group-hover:text-primary-dark inline-flex items-center">
          <IconsPlus class="" />
          Create new column
        </h5>
      </div>
    </div>
  </div>
</template>
