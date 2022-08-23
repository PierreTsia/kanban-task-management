interface PreviousNext<T> {
  previous: Partial<T> | null
  next: Partial<T> | null
}

export interface SubtaskDto {
  id: number
  title: string
  is_completed: boolean
}

export interface TaskDto extends PreviousNext<TaskDto> {
  id: number
  title: string
  description: string
  subtasks: SubtaskDto[]
}

export interface ColumnDto extends PreviousNext<ColumnDto> {
  id: number
  name: string
  tasks: TaskDto[]
}

export interface BoardDto {
  id: number
  name: string
  columns: ColumnDto[]
}

interface BoardsComposition {
  fetchAllBoards: () => Promise<BoardDto[] | undefined>
  orderChainedList: (l: OrderList, o?: OrderList) => OrderList
}

export type OrderListItem = TaskDto | ColumnDto
export type OrderList = Array<OrderListItem>

const useBoards = (): BoardsComposition => {
  const orderChainedList = (
    list: OrderList,
    orderedItems: OrderList = []
  ): OrderList => {
    if (!list.length) {
      return orderedItems
    }
    if (!orderedItems.length) {
      const head: OrderListItem = list.find((i) => !i.previous)!
      orderedItems.push(head)
      list = list.filter((i) => i.id !== head.id)
    } else {
      const tail = orderedItems[orderedItems.length - 1]
      const next = list.find((i) => i.id === tail.next?.id)

      if (next) {
        orderedItems.push(next)
        list = list.filter((i) => i.id !== next.id)
      } else {
        return orderedItems
      }
    }

    return orderChainedList(list, orderedItems)
  }

  const fetchAllBoards = async () => {
    try {
      const { data, error } = await $fetch('/api/all-boards', {
        method: 'GET',
      })
      if (error) {
        throw new Error(error.message)
      } else {
        return data as BoardDto[]
      }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    fetchAllBoards,
    orderChainedList,
  }
}

export const useApi = (): BoardsComposition => {
  const boards = useBoards()
  return {
    ...boards,
  }
}
