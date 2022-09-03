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

export interface CreateBoardPayload {
  name: string
  columns: { name: string }[]
}

interface BoardsComposition {
  fetchAllBoards: () => Promise<BoardDto[] | undefined>
  orderChainedList: (l: OrderList, o?: OrderList) => OrderList
  updateBoardColumnsOrder: (p: UpdateColumnOrderPayload[]) => any
  updateTasksOrder: (p: UpdateTaskOrderPayload[]) => any
  createNewBoard: (p: CreateBoardPayload) => any
  deleteBoard: (id: number) => Promise<BoardDto[] | undefined>
}

export type OrderListItem = TaskDto | ColumnDto
export type OrderList = Array<OrderListItem>

export const isColumn = (b: OrderListItem): b is ColumnDto => {
  return (b as ColumnDto).tasks !== undefined
}

export interface UpdateColumnOrderPayload {
  id: number
  previous: number | null
  next: number | null
  name: string
  board: number
}

export interface UpdateTaskOrderPayload {
  id: number
  previous: number | null
  next: number | null
  title: string
  column: number
  description: string
}

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

  const createNewBoard = async (payload: CreateBoardPayload) => {
    try {
      const { data, error } = await $fetch('/api/create-board', {
        method: 'POST',
        body: payload,
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

  const deleteBoard = async (id: number) => {
    try {
      // @ts-expect-error for some reason TS does not infer properly [id] params
      const { data, error } = await $fetch(`/api/board/${id}`, {
        method: 'DELETE',
      })
      if (error) {
        throw new Error(error.message)
      }
      return data as BoardDto[]
    } catch (e) {
      console.error(e)
    }
  }

  const updateBoardColumnsOrder = async (
    payload: UpdateColumnOrderPayload[]
  ) => {
    try {
      const { data, error } = await $fetch('/api/update-columns', {
        method: 'PUT',
        body: payload,
      })

      if (error) {
        throw new Error(error.message)
      } else {
        return data
      }
    } catch (e) {
      console.error(e)
    }
  }

  const updateTasksOrder = async (payload: UpdateTaskOrderPayload[]) => {
    try {
      const { data, error } = await $fetch('/api/update-tasks', {
        method: 'PUT',
        body: payload,
      })

      if (error) {
        throw new Error(error.message)
      } else {
        return data
      }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    fetchAllBoards,
    orderChainedList,
    updateBoardColumnsOrder,
    updateTasksOrder,
    createNewBoard,
    deleteBoard,
  }
}

export const useApi = (): BoardsComposition => {
  const boards = useBoards()
  return {
    ...boards,
  }
}
