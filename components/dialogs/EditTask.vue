<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useTaskStore } from '~/store/tasks.store'

withDefaults(defineProps<{ modelValue: boolean; persistent?: boolean }>(), {
  modelValue: false,
  persistent: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', t: boolean): void
}>()

const taskStore = useTaskStore()

const { activeTask } = storeToRefs(taskStore)

const handleDelete = () => {
  taskStore.deleteTask(activeTask.value?.id as number)
  emit('update:modelValue', false)
}
const handleEdit = async () => {
  // console.log('edit', activeTask.value)
}
</script>

<template>
  <BaseDialog
    :model-value="modelValue"
    :persistent="persistent"
    @update:model-value="(t) => $emit('update:modelValue', t)">
    <div class="w-90vw sm:w-480px flex flex-col justify-between p-8">
      <div class="w-full mb-5 relative">
        <h3 class="heading heading-lg text-left dark:text-white">
          {{ activeTask?.title }}
        </h3>

        <BaseContextualMenu
          class="absolute right-0 top-0"
          type="task"
          @delete="handleDelete"
          @edit="handleEdit" />
      </div>
      <div class="w-full mb-5">
        <h4 class="paragraph paragraph-lg text-left text-gray-dark">
          {{ activeTask?.description ?? 'No description' }}
        </h4>
      </div>
      <div class="w-full mb-5">
        <h3 class="font-bold text-13px text-left dark:text-white">
          Subtasks ({{ activeTask?.subtasks?.length ?? 0 }})
        </h3>
        <ul class="mt-2 flex flex-col gap-y-2 w-full">
          <li
            v-for="subtask in activeTask?.subtasks"
            :key="subtask.id"
            class="w-full p-3 inline-flex items-center dark:bg-black-dark bg-gray-light rounded-md py-2">
            <BaseInputCheckBox
              :value="subtask.is_completed"
              class="block w-1/10 mb-1rem" />

            <div
              class="flex-1 flex text-left paragraph paragraph-sm"
              :class="
                subtask.is_completed
                  ? 'text-gray-dark line-through'
                  : 'dark:text-white'
              ">
              {{ subtask.title }}
            </div>
          </li>
        </ul>
      </div>

      <section
        class="flex flex-col md:flex-row items-center justify-center md:justify-between mt-4">
        <button class="w-full btn btn-sm btn-primary font-bold text-13px">
          <span class="inline-flex items-center"> Create Task </span>
        </button>
      </section>
    </div>
  </BaseDialog>
</template>
