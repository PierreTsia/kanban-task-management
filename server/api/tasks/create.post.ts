import { TASKS_QUERY } from '~/server/api/query-strings'
import { supabase } from '~/server/db/supabase'

export interface CreateTaskPayload {
  title: string
  description: string
  status: number
  previous: number | null
  next: number | null
}

export default defineEventHandler(async (event) => {
  const body: CreateTaskPayload = await useBody(event)
  const { data, error } = await supabase
    .from('tasks')
    .insert(body)
    .select(TASKS_QUERY)

  return {
    error,
    data,
  }
})
