import { storeToRefs } from 'pinia'
import { isColumn } from '~/composables/api'
import type {
  ColumnDto,
  OrderList,
  OrderListItem,
  TaskDto,
  UpdateColumnOrderPayload,
  UpdateTaskOrderPayload,
} from '~/composables/api'
import { useBoardsStore } from '~/store/boards.store'

export const useOrderedList = () => {
  const boardStore = useBoardsStore()
  const { activeBoard } = storeToRefs(boardStore)

  const orderColumns = (cols: ColumnDto[]) => {
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

  const orderTasks = (columns: OrderList) => {
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
                description: t.description,
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

  return {
    orderColumns,
    orderTasks,
  }
}
