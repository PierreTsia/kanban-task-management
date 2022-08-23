import { defineStore } from 'pinia'
import type { BoardDto, ColumnDto, OrderList } from '~/composables/api'
import { useApi } from '~/composables/api'

interface State {
  boards: BoardDto[]
  activeBoardId: number | null
}

export const useBoardsStore = defineStore('boards', {
  state: (): State => {
    return {
      boards: [],
      activeBoardId: 1,
    }
  },
  actions: {
    async getAllBoards() {
      const { fetchAllBoards } = useApi()
      this.boards = (await fetchAllBoards()) ?? []
    },
    setActiveBoardId(id: number | null) {
      this.activeBoardId = id
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
