import { ALL_BOARDS } from '~/server/api/query-strings'
import { supabase } from '~/server/db/supabase'

export default defineEventHandler(async () => {
  const { data, error } = await supabase
    .from('boards')
    .select(ALL_BOARDS)
    .order('created_at', { ascending: false })
  return {
    error,
    data,
  }
})
