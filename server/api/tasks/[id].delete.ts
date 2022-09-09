import { supabase } from '~/server/db/supabase'

export default defineEventHandler(async (event) => {
  const { data: deletedTask, error } = await supabase
    .from('tasks')
    .delete()
    .match({ id: event.context.params.id })

  if (deletedTask) {
    const { previous, next } = deletedTask[0]
    if (previous) {
      await supabase.from('tasks').update({ next }).match({ id: previous })
    }
    if (next) {
      await supabase.from('tasks').update({ previous }).match({ id: next })
    }
  }

  return { data: deletedTask, error }
})
