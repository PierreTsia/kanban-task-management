<script lang="ts" setup>
import Draggable from 'vuedraggable'
import { storeToRefs } from 'pinia'
import type { OrderListItem } from '~/composables/api'
import { BoardColumn, BoardTask } from '#components'
import { useAppStore } from '~/store/app.store'


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


const appStore = useAppStore()
const { dialogs } = storeToRefs(appStore)

const draggableComponent = computed(() => {
  return props.type === 'column' ? BoardColumn : BoardTask
})
</script>

<template>
  <div class="flex no-wrap flex-1 min-w-95% p-4">
    <Draggable
      class="flex bg-gray-light dark:bg-black-dark"
      :class="{
        'flex-row w-full flex-1 justify-start': type === 'column',
        'flex-col gap-y-4 p-4  min-h-[calc(100vh-225px)] flex-1 w-full cursor-grab':
          type === 'task',
      }"
      tag="ul"
      :list="items"
      :group="{ name: type }"
      item-key="name"
      @end="$emit('onItemsUpdated', 'column')">
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
              @end="(t) => $emit('onItemsUpdated', t)" />
          </component>
        </div>
      </template>
    </Draggable>
    <div v-if="type === 'column'" class="w-320px h-full pt-12 ml-auto px-4">
      <div
        class="cursor-pointer group w-full h-90% bg-gray-medium dark:bg-black-medium bg-opacity-30 dark:bg-opacity-30 hover:bg-opacity-100 rounded-lg flex items-center justify-center"
        @click="dialogs.createColumn = true">
        <h5
          class="heading heading-xl text-gray-dark group-hover:text-primary-dark inline-flex items-center">
          <IconsPlus class="" />
          Create new column
        </h5>
      </div>
    </div>
  </div>
</template>
