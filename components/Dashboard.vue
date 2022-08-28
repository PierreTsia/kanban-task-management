<script setup lang="ts">
import debounce from 'lodash/debounce'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useElementSize, useWindowSize } from '@vueuse/core'
import { useAppStore } from '~/store/app.store'
import { useBoardsStore } from '~/store/boards.store'
import type {
  ColumnDto,
  OrderList,
  OrderListItem,
  TaskDto,
  UpdateColumnOrderPayload,
  UpdateTaskOrderPayload,
} from '~/composables/api'
import { isColumn } from '~/composables/api'

const sideBar = ref(null)
const { width } = useWindowSize()
const { width: sidebarWidth } = useElementSize(sideBar)

const BORDERS_SIZE = 2
const scrollZoneWidth = computed(
  () => `${width.value - sidebarWidth.value - BORDERS_SIZE}px`
)

const boardsStore = useBoardsStore()
const { activeBoard, activeBoardColumns, sortedActiveBoardColumns } =
  storeToRefs(boardsStore)

const appStore = useAppStore()
const { isSideBarOpen } = storeToRefs(appStore)

await boardsStore.getAllBoards()

const columns: Ref<OrderList> = ref(sortedActiveBoardColumns.value)

watch(
  () => activeBoard.value,
  async () => {
    columns.value = sortedActiveBoardColumns.value
  },
  { deep: true }
)

const isDialogShown = ref(false)

const getPayload = (cols: ColumnDto[]) => {
  return cols.reduce((acc, column, index, arr) => {
    const item: UpdateColumnOrderPayload = {
      id: column.id,
      name: column.name,
      previous: null,
      next: null,
      board: activeBoard.value?.id as number,
    }
    if (index > 0) {
      item.previous = arr[index - 1].id as number
    }
    if (index < arr.length - 1) {
      item.next = arr[index + 1].id as number
    }
    return [...acc, item]
  }, [] as UpdateColumnOrderPayload[])
}

const getTasksPayload = (columns: OrderList) => {
  return columns.reduce(
    (acc: UpdateTaskOrderPayload[], column: OrderListItem) => {
      let tasks = [] as UpdateTaskOrderPayload[]
      if (isColumn(column) && column?.tasks.length) {
        tasks = column.tasks.reduce(
          (
            a: UpdateTaskOrderPayload[],
            t: TaskDto,
            i: number,
            tasks: TaskDto[]
          ) => {
            const item: UpdateTaskOrderPayload = {
              id: t.id,
              title: t.title,
              previous: null,
              next: null,
              column: column.id as number,
            }
            if (i > 0) {
              item.previous = tasks[i - 1].id as number
            }
            if (i < tasks.length - 1) {
              item.next = tasks[i + 1].id as number
            }
            return [...a, item]
          },
          [] as UpdateTaskOrderPayload[]
        )
      }

      return [...acc, ...tasks]
    },
    [] as UpdateTaskOrderPayload[]
  )
}

const handleUpdateTasks = debounce(() => {
  const payload = getTasksPayload(columns.value)

  if (payload.length) {
    boardsStore.updateTasksOrder(payload)
  }
}, 1000)

const handleUpdateOrder = (type: string) => {
  if (type === 'column') {
    const payload: UpdateColumnOrderPayload[] = getPayload(
      columns.value as ColumnDto[]
    )
    boardsStore.updateBoardColumnsOrder(payload)
  } else {
    handleUpdateTasks()
  }
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
      <aside
        class="w-full h-96px flex justify-between items-center px-8 py-4 md:border-b-1 border-b-gray-light dark:border-b-black-light">
        <h1 class="heading heading-xl">{{ activeBoard?.name }}</h1>
        <section class="inline-flex items-center gap-x-4">
          <button class="heading heading-md btn btn-lg btn-primary w-175px">
            <IconsPlus class="mr-1" />
            Create new task
          </button>
          <IconsVerticalEllipsis
            class="text-gray-dark hover:text-primary-light cursor-pointer" />
        </section>
      </aside>

      <!--      <button class="btn btn-primary" @click="isDialogShown = !isDialogShown">
        Show
      </button> -->
      <CreateBoardDialog v-model="isDialogShown" />

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
