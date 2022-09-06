<script lang="ts" setup>
import type {
  BoardDto,
  ColumnDto,
  CreateBoardPayload,
  UpdateBoardPayload,
} from '~/composables/api'
import { useInputValidation } from '~/composables/inputValidation'
import { useBoardsStore } from '~/store/boards.store'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    persistent?: boolean
    board?: BoardDto | null
  }>(),
  {
    modelValue: false,
    persistent: false,
    board: null,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', t: boolean): void
}>()

const newBoard = reactive({
  name: '',
  columns: [{ name: 'Todo' } as Partial<ColumnDto>],
} as CreateBoardPayload)

watch(
  () => props.board,
  (board) => {
    if (board) {
      newBoard.name = board.name
      newBoard.columns = board.columns
    } else {
      newBoard.name = ''
      newBoard.columns = [{ name: 'Todo' } as Partial<ColumnDto>]
    }
  },
  {
    immediate: true,
  }
)

const title = computed(() => {
  return props.board ? 'Edit board' : 'Create board'
})

const actionBtn = computed(() => {
  return props.board ? 'Save changes' : 'Create new Board'
})
const { hasMinLength, hasMaxLength } = useInputValidation()
const boardsStore = useBoardsStore()

const deletedColumns = ref<BoardDto['columns']>([])

const errorText = (value: string) => {
  return (
    [hasMinLength(value, 3), hasMaxLength(value, 20)].find(
      (e) => typeof e === 'string'
    ) ?? ''
  )
}

const isFormValid = computed(() => {
  return Object.values(newBoard).every(Boolean)
})

const handleAddColumn = () => {
  newBoard.columns.push({ name: '' })
}

const handleCreateBoard = async () => {
  if (!isFormValid.value) {
    return
  }

  if (!props.board) {
    const { name, columns } = newBoard
    const boardPayload: CreateBoardPayload = {
      name,
      columns,
    }
    await boardsStore.createBoard(boardPayload)
  } else {
    const boardId = props.board.id
    const payload: UpdateBoardPayload = {
      board: newBoard,
      deleteColumns: deletedColumns.value.map((c) => c.id),
    }
    await boardsStore.updateBoard(boardId, payload)
  }

  emit('update:modelValue', false)
}

const deleteColumn = (index: number) => {
  if (newBoard.columns[index]?.id) {
    deletedColumns.value.push(newBoard.columns[index] as ColumnDto)
  }
  if (newBoard.columns.length <= 1) {
    newBoard.columns = [{ name: '' }]
  } else {
    newBoard.columns.splice(index, 1)
  }
}

const canAddNewColumn = computed(() => {
  return (
    errorText(
      (newBoard.columns[newBoard.columns.length - 1] as ColumnDto).name
    ) === ''
  )
})
</script>

<template>
  <BaseDialog
    :model-value="modelValue"
    :persistent="persistent"
    @update:model-value="(t) => $emit('update:modelValue', t)">
    <div class="w-480px min-h-400px flex flex-col justify-start p-8">
      <div class="w-full mb-5">
        <h1 class="heading heading-lg text-left dark:text-white">
          {{ title }}
        </h1>
      </div>
      <form class="w-full flex-1 mb-4 py-4 flex-col">
        <section class="flex flex-col w-full gap-y-2 mb-6">
          <label
            class="w-full text-left text-gray-dark dark:text-white paragraph paragraph-sm">
            Name
          </label>
          <BaseInputText
            v-model="newBoard.name"
            :error-message="errorText(newBoard.name)" />
        </section>
        <section class="flex flex-col w-full gap-y-2 flex-1">
          <label
            class="w-full text-left text-gray-dark dark:text-white paragraph paragraph-sm">
            Columns
          </label>

          <div class="flex flex-col items-center w-full flex-wrap">
            <TransitionGroup
              name="list"
              tag="ul"
              class="w-full flex-1 relative">
              <li
                v-for="(column, i) in newBoard.columns"
                :key="i"
                class="w-full flex wrap mb-2">
                <BaseInputText
                  v-model="column.name"
                  :error-message="errorText(column.name)"
                  class="w-9/10" />
                <span
                  class="w-1/10 flex justify-end items-center cursor-pointer pr-1"
                  @click="deleteColumn(i)">
                  <IconsCross class="flex text-gray-dark" />
                </span>
              </li>
            </TransitionGroup>
          </div>
        </section>
      </form>
      <button
        class="btn btn-secondary btn-sm mt-auto"
        :class="[canAddNewColumn ? 'cursor-pointer' : '!cursor-not-allowed']"
        :disabled="!canAddNewColumn"
        @click="handleAddColumn">
        <span class="inline-flex items-center">
          <IconsPlus class="mr-1 w-2 h-2" />
          Add new column
        </span>
      </button>
      <button
        class="btn btn-primary btn-sm mt-6"
        :class="isFormValid ? 'cursor-pointer' : '!cursor-not-allowed'"
        :disabled="!isFormValid"
        @click="handleCreateBoard">
        {{ actionBtn }}
      </button>
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
