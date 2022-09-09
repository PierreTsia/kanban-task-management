<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import type { SubtaskDto } from '~/composables/api'
import { useTaskStore } from '~/store/tasks.store'
import { useAppStore } from '~/store/app.store'

const props = defineProps<{ element: any }>()

const tasksStore = useTaskStore()
const appStore = useAppStore()
const { dialogs } = storeToRefs(appStore)


const doneSubtasks = computed(() => {
  return props.element.subtasks.filter((task: SubtaskDto) => task.is_completed)
})

const handleTaskClick = () => {
  tasksStore.setActiveTaskId(props.element.id)
  dialogs.value.editTask = true
}
</script>

<template>
  <div
    class="w-full flex flex-col justify-center gap-y-1 bg-white dark:bg-black-medium py-4 dark:border-black-light border-0.5 min-h-88px rounded-lg shadow-lg"
    @click="handleTaskClick">
    <h3 class="w-full text-left px-2 heading heading-md mb-0">
      {{ element.title }}
    </h3>
    <h4
      v-if="element?.subtasks.length"
      class="px-2 text-gray-dark paragraph paragraph-sm">
      {{ doneSubtasks.length }} of {{ element.subtasks.length }} subtasks
    </h4>

    <slot />
  </div>
</template>
