<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useInputValidation } from '~/composables/inputValidation'
import { useBoardsStore } from '~/store/boards.store'

withDefaults(
  defineProps<{ modelValue: boolean; persistent?: boolean }>(),
  {
    modelValue: false,
    persistent: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', t: boolean): void
}>()

const boardsStore = useBoardsStore()
const { lastColumnId, activeBoard } = storeToRefs(boardsStore)

const newColumnName = ref('')

const handleCancel = async () => {
  emit('update:modelValue', false)
}
const handleCreate = async () => {
  await boardsStore.createColumn({
    name: newColumnName.value,
    board: activeBoard.value?.id as number,
    previous: lastColumnId.value as number,
  })
  emit('update:modelValue', false)
}

const { hasMinLength, hasMaxLength } = useInputValidation()
const errorText = (value: string) => {
  return (
    [hasMinLength(value, 3), hasMaxLength(value, 15)].find(
      (e) => typeof e === 'string'
    ) ?? ''
  )
}
</script>

<template>
  <BaseDialog
    :model-value="modelValue"
    :persistent="persistent"
    @update:model-value="(t) => $emit('update:modelValue', t)">
    <div class="w-90vw sm:w-480px flex flex-col justify-between p-8">
      <div class="w-full mb-5">
        <h1 class="heading heading-lg text-left dark:text-white">Add Column</h1>
      </div>
      <form class="w-full flex-1 flex-col">
        <section class="flex flex-col w-full gap-y-2 mb-6">
          <label
            class="w-full text-left text-gray-dark dark:text-white paragraph paragraph-sm">
            Name
          </label>
          <BaseInputText
            v-model="newColumnName"
            placeholder="Enter column name"
            :error-message="errorText(newColumnName)" />
        </section>
      </form>

      <section
        class="flex flex-col md:flex-row items-center justify-center md:justify-between gap-y-4">
        <button
          class="w-full md:w-200px btn btn-secondary"
          @click="handleCancel">
          Cancel
        </button>
        <button class="w-full md:w-200px btn btn-primary" @click="handleCreate">
          <span class="inline-flex items-center"> Add new column </span>
        </button>
      </section>
    </div>
  </BaseDialog>
</template>
