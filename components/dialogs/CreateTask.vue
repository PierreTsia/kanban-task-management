<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useInputValidation } from '~/composables/inputValidation'
import { useBoardsStore } from '~/store/boards.store'
import { useTaskStore } from '~/store/tasks.store'

withDefaults(defineProps<{ modelValue: boolean; persistent?: boolean }>(), {
  modelValue: false,
  persistent: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', t: boolean): void
}>()

const boardsStore = useBoardsStore()
const taskStore = useTaskStore()
const { activeBoardColumns, activeBoardId } = storeToRefs(boardsStore)
const { lastTaskIdByColumn } = storeToRefs(taskStore)

const newTask = reactive({
  name: '',
  description: '',
  status: activeBoardColumns.value?.[0].id as number,
  subtasks: [
    {
      name: '',
      done: false,
    },
  ],
})

const deleteSubtask = (index: number) => {
  if (newTask.subtasks.length <= 1) {
    newTask.subtasks = [{ name: '', done: false }]
  } else {
    newTask.subtasks.splice(index, 1)
  }
}

const handleAddSubTask = async () => {
  newTask.subtasks.push({ name: '', done: false })
}

const { hasMinLength, hasMaxLength } = useInputValidation()

const errorText = (value: string, max = 15) => {
  return (
    [hasMinLength(value, 3), hasMaxLength(value, max)].find(
      (e) => typeof e === 'string'
    ) ?? ''
  )
}

const canAddNewSubtask = computed(() => {
  return newTask.subtasks.every((subtask) => errorText(subtask.name) === '')
})

const isFormValid = computed(() => {
  return (
    errorText(newTask.name) === '' &&
    errorText(newTask.description, 200) === '' &&
    newTask.status
  )
})

const handleCreateClick = () => {
  if (!isFormValid) {
    return
  }

  const { subtasks, status, description, name } = newTask
  const payload = {
    title: name,
    description,
    status,
    previous: lastTaskIdByColumn.value[status],
    board: activeBoardId.value as number,
    next: null,
  }

  taskStore.createTask(payload)
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseDialog
    :model-value="modelValue"
    :persistent="persistent"
    @update:model-value="(t) => $emit('update:modelValue', t)">
    <div class="w-90vw sm:w-480px flex flex-col justify-between p-8">
      <div class="w-full mb-5">
        <h1 class="heading heading-lg text-left dark:text-white">
          Add New Task
        </h1>
      </div>

      <form class="w-full flex-1 flex-col">
        <section class="flex flex-col w-full gap-y-2 mb-6">
          <label
            class="w-full text-left text-gray-dark dark:text-white paragraph paragraph-sm">
            Title
          </label>
          <BaseInputText
            v-model="newTask.name"
            placeholder="Enter task name"
            :error-message="errorText(newTask.name)" />
        </section>
        <section class="flex flex-col w-full gap-y-2 mb-6">
          <label
            class="w-full text-left text-gray-dark dark:text-white paragraph paragraph-sm">
            Description
          </label>
          <BaseInputTextArea
            v-model="newTask.description"
            :error-message="errorText(newTask.description, 200)"
            placeholder="Enter task description" />
        </section>

        <section class="flex flex-col w-full gap-y-2 flex-1 mb-6">
          <label
            class="w-full text-left text-gray-dark dark:text-white paragraph paragraph-sm">
            Subtasks
          </label>

          <div class="flex flex-col items-center w-full flex-wrap">
            <TransitionGroup
              name="list"
              tag="ul"
              class="w-full flex-1 relative">
              <li
                v-for="(st, i) in newTask.subtasks"
                :key="i"
                class="w-full flex wrap mb-2">
                <BaseInputText
                  v-model="st.name"
                  :error-message="errorText(st.name)"
                  class="w-9/10" />
                <span
                  class="w-1/10 flex justify-end items-center cursor-pointer pr-1"
                  @click="deleteSubtask(i)">
                  <IconsCross class="flex text-gray-dark" />
                </span>
              </li>
            </TransitionGroup>
          </div>
          <button
            class="w-full btn btn-sm btn-secondary font-bold text-13px"
            :disabled="!canAddNewSubtask"
            @click.prevent="handleAddSubTask">
            <span class="inline-flex items-center">
              <IconsPlus class="mr-1 w-2 h-2" />
              Add New Subtask
            </span>
          </button>
        </section>
        <section class="flex flex-col w-full gap-y-2 w-full mb-6">
          <label
            class="w-full text-left text-gray-dark dark:text-white paragraph paragraph-sm">
            Status
          </label>
          <BaseInputSelect
            :options="activeBoardColumns"
            :model-value="activeBoardColumns[0]"
            class="w-full"
            placeholder="Enter task description"
            @on-select-option="(option) => (newTask.status = option.id)" />
        </section>
      </form>

      <section
        class="flex flex-col md:flex-row items-center justify-center md:justify-between mt-4">
        <button
          class="w-full btn btn-sm btn-primary font-bold text-13px"
          :disabled="!isFormValid"
          @click="handleCreateClick">
          <span class="inline-flex items-center"> Create Task </span>
        </button>
      </section>
    </div>
  </BaseDialog>
</template>
