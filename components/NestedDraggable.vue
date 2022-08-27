<script lang="ts" setup>
import Draggable from 'vuedraggable'
import type { OrderListItem } from '~/composables/api'

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
</script>

<template>
  <Draggable
    class="w-full flex"
    :class="{
      'flex-row bg-red-light h-900px': type === 'column',
      'flex-col gap-y-2 bg-gray-dark p-4 border-1 h-full': type === 'task',
    }"
    tag="ul"
    :list="items"
    :group="{ name: type }"
    item-key="name">
    <template #item="{ element }">
      <li
        :class="{
          'w-1/3': type === 'column',
          'w-full h-50px bg-white rounded-lg !text-black': type === 'task',
        }">
        <p
          :class="{
            'dark:text-gray-dark': type === 'task',
          }">
          {{ element?.name ?? element?.title }}
        </p>

        <NestedDraggable
          v-if="type === 'column'"
          :items="element.tasks"
          type="task"
          @on-items-updated="(t) => $emit('onItemsUpdated', t)" />
      </li>
    </template>
  </Draggable>
</template>
