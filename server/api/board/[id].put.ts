import partition from 'lodash/partition'
import type { ColumnDto } from '~/composables/api'
import { COLUMNS_QUERY } from '~/server/api/query-strings'
import { supabase } from '~/server/db/supabase'
import { setPreviousNext } from '~/server/api/create-board.post'
import type { ColumnPayload } from '~/server/api/create-board.post'

export default defineEventHandler(async (event) => {
  const boardId = event.context.params.id
  const formatPayload = (c: ColumnDto): ColumnPayload => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tasks, ...column } = c
    return {
      ...column,
      next: null,
      previous: null,
      board: boardId,
    }
  }
  const body = await useBody(event)
  const { deleteColumns, board } = body

  // delete columns
  const { error: deleteColumnsError } = await supabase
    .from('columns')
    .delete()
    .in('id', deleteColumns)

  // update board name
  const { data: updatedBoard, error: boardError } = await supabase
    .from('boards')
    .update({ name: board.name })
    .match({ id: boardId })

  const [existingColumns, newColumns] = partition(board.columns, 'id')

  // create new columns
  const { data: createdColumns, error: createColumnsError } = await supabase
    .from('columns')
    .insert(newColumns.map(formatPayload), {
      count: 'exact',
    })

  // upsert all board columns with previous and next null
  const { data: updatedColumns, error: updateColumnsError } = await supabase
    .from('columns')
    .upsert(existingColumns.map(formatPayload), {
      count: 'exact',
    })

  // order columns
  const columnsPayload: ColumnPayload[] = [
    ...(updatedColumns ?? []),
    ...(createdColumns ?? []),
  ]

  const { data: orderedColumns, error: orderColumnsError } = await supabase
    .from('columns')
    .update(setPreviousNext(columnsPayload))
    .select(COLUMNS_QUERY)

  return {
    data: { ...updatedBoard?.[0], columns: orderedColumns },
    error:
      boardError ||
      deleteColumnsError ||
      createColumnsError ||
      updateColumnsError ||
      orderColumnsError,
  }
})
