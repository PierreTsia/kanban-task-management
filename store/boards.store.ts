import { defineStore } from 'pinia'
import type {
  BoardDto,
  ColumnDto,
  CreateBoardPayload,
  OrderList,
  UpdateBoardPayload,
  UpdateColumnOrderPayload,
  UpdateTaskOrderPayload,
} from '~/composables/api'
import { isColumn, useApi } from '~/composables/api'
import type { CreateTaskPayload } from '~/server/api/tasks/create.post'

interface State {
  boards: BoardDto[]
  activeBoardId: number | null
  editedBoardId: number | null
}

export const useBoardsStore = defineStore('boards', {
  state: (): State => {
    return {
      boards: [],
      activeBoardId: null,
      editedBoardId: null,
    }
  },
  actions: {
    async getAllBoards() {
      const { fetchAllBoards } = useApi()
      this.boards = (await fetchAllBoards()) ?? []
      this.activeBoardId = this.boards.length ? this.boards[0].id : null
    },
    async createBoard(board: CreateBoardPayload) {
      const { createNewBoard } = useApi()
      const newBoard = await createNewBoard(board)
      this.boards.push(newBoard)
    },

    async createColumn(column: {
      name: string
      board: number
      previous: number
    }) {
      const { createNewColumn } = useApi()
      const columns: ColumnDto[] = await createNewColumn(column)
      const boardIndex = this.boards.findIndex((b) => b.id === column.board)
      if (boardIndex !== -1) {
        this.boards[boardIndex].columns = [
          ...this.boards[boardIndex].columns.filter(
            (c) => c?.id !== column.previous
          ),
          ...columns,
        ]
      }
    },

    async updateBoard(id: number, payload: UpdateBoardPayload) {
      const { updateBoard: update } = useApi()
      const updatedBoard = await update(id, payload)
      this.boards = this.boards.map((b) => (b.id === id ? updatedBoard : b))
    },

    setActiveBoardId(id: number | null) {
      this.activeBoardId = id
    },
    async updateBoardColumnsOrder(payload: UpdateColumnOrderPayload[]) {
      const { updateBoardColumnsOrder: updateOrder } = useApi()
      await updateOrder(payload)
    },
    async updateTasksOrder(payload: UpdateTaskOrderPayload[]) {
      const { updateTasksOrder: updateOrder } = useApi()
      await updateOrder(payload)
    },
    async deleteBoardById(id: number) {
      const { deleteBoard } = useApi()
      await deleteBoard(id)
      this.boards = this.boards.filter((b) => b.id !== id)
      this.activeBoardId = this.boards.length ? this.boards[0].id : null
    },

    async createTask(payload: CreateTaskPayload) {
      const { createNewTask } = useApi()
      const [newTask] = await createNewTask(payload)
      const boardIndex = this.boards.findIndex(
        (b) => b.id === this.activeBoardId
      )
      if (boardIndex !== -1) {
        const column = this.boards[boardIndex].columns.find(
          (c) => c.id === payload.status
        )
        if (column) {
          column.tasks = [...column.tasks, newTask]
        }
      }
    },
  },
  getters: {
    activeBoard(): BoardDto | null {
      return this.boards.find((b) => b.id === this.activeBoardId) ?? null
    },
    editedBoard(): BoardDto | null {
      return this.boards.find((b) => b.id === this.editedBoardId) ?? null
    },
    activeBoardColumns(): ColumnDto[] {
      return this.activeBoard?.columns ?? []
    },
    sortedActiveBoardColumns(): OrderList {
      const { orderChainedList } = useApi()
      return orderChainedList(this.activeBoardColumns)
    },
    lastColumnId(): number | null {
      return this.sortedActiveBoardColumns.length
        ? this.sortedActiveBoardColumns[
            this.sortedActiveBoardColumns.length - 1
          ].id
        : null
    },
    lastTaskIdByColumn(): Record<number, number | null> {
      return this.sortedActiveBoardColumns.reduce((acc, column) => {
        acc[column.id] =
          isColumn(column) && column.tasks.length
            ? column.tasks[column.tasks.length - 1].id
            : null
        return acc
      }, {} as Record<number, number | null>)
    },
    sortedTasksByColumnId() {
      const { orderChainedList } = useApi()

      return (columnId: number): OrderList => {
        const column = this.activeBoard?.columns?.find((c) => c.id === columnId)

        return orderChainedList(column?.tasks ?? [])
      }
    },
  },
})
