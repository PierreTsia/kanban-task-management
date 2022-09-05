import { supabase } from '~/server/db/supabase'

export default defineEventHandler(async (event) => {
  const { data, error } = await supabase
    .from('boards')
    .delete()
    .match({ id: event.context.params.id })

  return { data, error }
})
