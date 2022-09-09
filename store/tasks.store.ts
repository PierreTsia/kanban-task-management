import { defineStore, storeToRefs } from 'pinia'
import type {
  OrderList,
  TaskDto,
  UpdateTaskOrderPayload,
} from '~/composables/api'
import { isColumn, useApi } from '~/composables/api'
import type { CreateTaskPayload } from '~/server/api/tasks/create.post'
import { useBoardsStore } from '~/store/boards.store'

interface State {
  activeTaskId: number | null
}

export const useTaskStore = defineStore('tasks', {
  state: (): State => {
    return {
      activeTaskId: null,
    }
  },
  actions: {
    async updateTasksOrder(payload: UpdateTaskOrderPayload[]) {
      const { updateTasksOrder: updateOrder } = useApi()
      await updateOrder(payload)
    },

    setActiveTaskId(id: number | null) {
      this.activeTaskId = id
    },

    async createTask(payload: CreateTaskPayload) {
      const boardsStore = useBoardsStore()
      const { boards, activeBoardId } = storeToRefs(boardsStore)
      const { createNewTask } = useApi()
      const [newTask] = await createNewTask(payload)
      const boardIndex = boards.value.findIndex(
        (b) => b.id === activeBoardId.value
      )
      if (boardIndex !== -1) {
        const column = boards.value[boardIndex].columns.find(
          (c) => c.id === payload.status
        )
        if (column) {
          column.tasks = [...column.tasks, newTask]
        }
      }
    },
    async deleteTask(id: number) {
      const boardsStore = useBoardsStore()
      const { boards, activeBoardId } = storeToRefs(boardsStore)
      const { deleteTask } = useApi()
      const [deletedTask] = await deleteTask(id)
      const boardIndex = boards.value.findIndex(
        (b) => b.id === activeBoardId.value
      )
      if (boardIndex !== -1) {
        const column = boards.value[boardIndex].columns.find(
          (c) => c.id === deletedTask.status
        )
        if (column) {
          column.tasks = [...column.tasks.filter((t) => t.id !== id)]
        }
      }
    },
  },
  getters: {
    allActiveBoardTasks(): TaskDto[] {
      const boardsStore = useBoardsStore()
      const { activeBoard } = storeToRefs(boardsStore)

      if (!activeBoard.value) {
        return []
      }
      return activeBoard.value.columns.reduce(
        (acc, column) => [...acc, ...column.tasks],
        [] as TaskDto[]
      )
    },
    activeTask(): TaskDto | null {
      return (
        this.allActiveBoardTasks.find((t) => t.id === this.activeTaskId) ?? null
      )
    },

    lastTaskIdByColumn(): Record<number, number | null> {
      const boardsStore = useBoardsStore()
      const { sortedActiveBoardColumns } = storeToRefs(boardsStore)
      return sortedActiveBoardColumns.value.reduce((acc, column) => {
        acc[column.id] =
          isColumn(column) && column.tasks.length
            ? column.tasks[column.tasks.length - 1].id
            : null
        return acc
      }, {} as Record<number, number | null>)
    },
    sortedTasksByColumnId() {
      const { orderChainedList } = useApi()
      const boardsStore = useBoardsStore()
      const { activeBoard } = storeToRefs(boardsStore)

      return (columnId: number): OrderList => {
        const column = activeBoard.value?.columns?.find(
          (c) => c.id === columnId
        )

        return orderChainedList(column?.tasks ?? [])
      }
    },
  },
})
