<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useBoardsStore } from '~/store/boards.store'

withDefaults(defineProps<{ modelValue: boolean; persistent?: boolean }>(), {
  modelValue: false,
  persistent: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', t: boolean): void
}>()

const boardsStore = useBoardsStore()
const { activeBoard, activeBoardId } = storeToRefs(boardsStore)

const handleCancel = async () => {
  emit('update:modelValue', false)
}
const handleDelete = async () => {
  await boardsStore.deleteBoardById(activeBoardId.value!)
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseDialog
    :model-value="modelValue"
    :persistent="persistent"
    @update:model-value="(t) => $emit('update:modelValue', t)">
    <div class="w-90vw sm:w-480px md:h-230px flex flex-col justify-between p-8">
      <h1 class="heading heading-lg text-left text-red-dark mb-5">
        Delete this Board ?
      </h1>
      <span class="paragraph paragraph-lg text-gray-dark">
        Are you sure you want to delete the
        <span class="font-bold text-primary-dark">{{ activeBoard?.name }}</span>
        board? This action will remove all columns and tasks and cannot be
        reversed.
      </span>

      <section
        class="mt-5 flex flex-col md:flex-row items-center justify-center md:justify-between gap-y-4">
        <button
          class="w-full md:w-200px btn btn-destructive"
          @click="handleDelete">
          <span class="inline-flex items-center"> Delete Board </span>
        </button>
        <button
          class="w-full md:w-200px btn btn-primary dark:bg-primary-dark dark:bg-opacity-10 dark:text-primary-dark dark:hover:bg-white dark:bg-opacity-100 dark:bg-white"
          @click="handleCancel">
          Cancel
        </button>
      </section>
    </div>
  </BaseDialog>
</template>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.9s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.list-leave-active {
  position: absolute;
}
</style>
