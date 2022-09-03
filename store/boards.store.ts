import { defineStore } from 'pinia'
import type {
  BoardDto,
  ColumnDto,
  CreateBoardPayload,
  OrderList,
  UpdateColumnOrderPayload,
  UpdateTaskOrderPayload,
} from '~/composables/api'
import { useApi } from '~/composables/api'

interface State {
  boards: BoardDto[]
  activeBoardId: number | null
}

export const useBoardsStore = defineStore('boards', {
  state: (): State => {
    return {
      boards: [],
      activeBoardId: 0,
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
  },
  getters: {
    activeBoard(): BoardDto | null {
      return this.boards.find((b) => b.id === this.activeBoardId) ?? null
    },
    activeBoardColumns(): ColumnDto[] {
      return this.activeBoard?.columns ?? []
    },
    sortedActiveBoardColumns(): OrderList {
      const { orderChainedList } = useApi()
      return orderChainedList(this.activeBoardColumns)
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
