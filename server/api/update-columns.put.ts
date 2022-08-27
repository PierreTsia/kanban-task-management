import { supabase } from '~/server/db/supabase'

export default defineEventHandler(async (event) => {
  const body = await useBody(event)
  const { data, error } = await supabase
    .from('columns')
    .upsert(body, { count: 'exact' })
    .select('*')

  return {
    error,
    data,
  }
})
