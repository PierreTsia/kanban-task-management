import { COLUMNS_QUERY } from '~/server/api/query-strings'
import { supabase } from '~/server/db/supabase'

export interface ColumnPayload {
  name: string
  board: number
  id?: number
  previous: number | null
  next: number | null
}

export const setPreviousNext = (columns: ColumnPayload[]) => {
  return columns.reduce((acc, curr, i, arr) => {
    const current: ColumnPayload = { ...curr, previous: null, next: null }
    if (i > 0) {
      current.previous = arr[i - 1].id as number
    }
    if (i < arr.length - 1) {
      current.next = arr[i + 1].id as number
    }
    return [...acc, current]
  }, [] as ColumnPayload[])
}

export default defineEventHandler(async (event) => {
  const body = await useBody(event)

  const { name, columns } = body

  const { data: boards, error: createBoardError } = await supabase
    .from('boards')
    .insert({ name })
    .select('*')

  // create columns for the board
  const boardId = boards?.[0].id
  const { data: unorderedCols, error: createColumnsError } = await supabase
    .from('columns')
    .insert(
      columns.map((column: { name: string }) => ({
        ...column,
        board: boardId,
      }))
    )
    .select('*')

  // order the columns
  const { data: orderedColumns, error: orderColumnsError } = await supabase
    .from('columns')
    .update(setPreviousNext(unorderedCols as ColumnPayload[]))
    .select(COLUMNS_QUERY)

  const error = createBoardError || createColumnsError || orderColumnsError
  const data = error ? null : { ...boards?.[0], columns: orderedColumns }

  return {
    error,
    data,
  }
})
