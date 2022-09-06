<script setup lang="ts">
import debounce from 'lodash/debounce'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useElementSize, useWindowSize } from '@vueuse/core'
import { useAppStore } from '~/store/app.store'
import { useBoardsStore } from '~/store/boards.store'
import { useOrderedList } from '~/composables/orderedList'
import type { ColumnDto, OrderList } from '~/composables/api'

const sideBar = ref(null)
const { width } = useWindowSize()
const { width: sidebarWidth } = useElementSize(sideBar)

const BORDERS_SIZE = 2
const scrollZoneWidth = computed(
  () => `${width.value - sidebarWidth.value - BORDERS_SIZE}px`
)

const boardsStore = useBoardsStore()
const {
  activeBoard,
  activeBoardColumns,
  sortedActiveBoardColumns,
  editedBoardId,
  editedBoard,
} = storeToRefs(boardsStore)

const draftBoard = computed(() => {
  return editedBoardId.value ? editedBoard.value : null
})

const appStore = useAppStore()
const { isSideBarOpen, dialogs } = storeToRefs(appStore)

const { orderColumns, orderTasks } = useOrderedList()

await boardsStore.getAllBoards()

const columns: Ref<OrderList> = ref([...sortedActiveBoardColumns.value])

watch(
  () => sortedActiveBoardColumns.value,
  async () => {
    columns.value = sortedActiveBoardColumns.value
  },
  { deep: true }
)

const handleUpdateTasks = debounce(() => {
  const payload = orderTasks(columns.value)

  if (payload.length) {
    boardsStore.updateTasksOrder(payload)
  }
}, 300)

const handleUpdateOrder = (type: string) => {
  if (type === 'column') {
    const payload = orderColumns(columns.value as ColumnDto[])
    boardsStore.updateBoardColumnsOrder(payload)
  } else {
    handleUpdateTasks()
  }
}

const handleEditBoard = () => {
  editedBoardId.value = activeBoard.value?.id as number
  dialogs.value.upsertBoard = true
}
</script>

<template>
  <div class="w-full flex justify-start relative">
    <Transition name="slide-fade">
      <button
        v-show="!isSideBarOpen"
        class="fixed flex items-center justify-center bottom-80px bg-primary-dark hover:bg-primary-light cursor-pointer rounded-tr-full rounded-br-full h-48px w-56px"
        @click="appStore.toggleSideBar">
        <IconsEyeOpened class="text-white" />
      </button>
    </Transition>
    <SideBar
      ref="sideBar"
      class="w-0 hidden md:flex"
      :is-open="isSideBarOpen" />
    <div
      class="flex-1 flex flex-col justify-center items-start w-full max-h-screen">
      <TopBar @edit-board="handleEditBoard" />
      <DialogsUpsertBoard v-model="dialogs.upsertBoard" :board="draftBoard" />
      <DialogsDeleteBoard v-model="dialogs.deleteBoard" />
      <DialogsCreateColumn v-model="dialogs.createColumn" />

      <div
        class="scroller flex flex-col items-start justify-start bg-gray-light dark:bg-black-dark h-3000px">
        <NoColumnsView v-if="!activeBoardColumns.length" class="my-auto" />
        <client-only>
          <NestedDraggable
            v-if="columns.length"
            :items="columns"
            class="drag-zone overflow-auto min-h-[calc(100vh-94px)]"
            @on-items-updated="handleUpdateOrder" />
        </client-only>
      </div>
    </div>
  </div>
</template>

<style>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.scroller {
  width: v-bind(scrollZoneWidth);
  overflow: auto;
}
.scroller::-webkit-scrollbar {
  width: 10px !important;
  height: 10px !important;
}

.scroller::-webkit-scrollbar-track {
  border-radius: 100px;
  background: #20212c;
}

.scroller::-webkit-scrollbar-thumb {
  background: #a7a4ff;
  border-radius: 100px;
  border: 1px solid #2b2c37;
}

.scroller::-webkit-scrollbar-thumb:hover {
  background: #645fc7 !important;
}

.light .scroller::-webkit-scrollbar-thumb {
  border-color: #a7a4ff;
}

.light .scroller::-webkit-scrollbar-track {
  background: #f4f7fd;
}
</style>
