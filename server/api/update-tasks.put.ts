import { supabase } from '~/server/db/supabase'

export default defineEventHandler(async (event) => {
  const body = await useBody(event)
  const { data, error } = await supabase
    .from('tasks')
    .upsert(body, { count: 'exact' })
    .select('*')

  return {
    error,
    data,
  }
})
