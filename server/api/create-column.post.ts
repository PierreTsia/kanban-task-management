import type { CreateColumnPayload } from '~/composables/api'
import { COLUMNS_QUERY } from '~/server/api/query-strings'
import { supabase } from '~/server/db/supabase'

export default defineEventHandler(async (event) => {
  const body: CreateColumnPayload = await useBody(event)

  const { data: newColumn, error: newColumnError } = await supabase
    .from('columns')
    .insert(body)
    .select(COLUMNS_QUERY)

  const { data: previousColumn, error: previousError } = await supabase
    .from('columns')
    .update({ next: newColumn?.[0]?.id })
    .match({ id: body.previous })
    .select(COLUMNS_QUERY)

  return {
    error: newColumnError || previousError,
    data: [...(previousColumn ?? []), ...(newColumn ?? [])],
  }
})
