const PREVIOUS_AND_NEXT_IDS = `
    previous(id),
    next(id)
 `
export const TASKS_QUERY = `
            id,
            title,
            description,
            created_at,
            ${PREVIOUS_AND_NEXT_IDS},
            subtasks(
                id,
                title,
                is_completed
            )`

export const COLUMNS_QUERY = `
        id,
        name,
        ${PREVIOUS_AND_NEXT_IDS},
        tasks(
           ${TASKS_QUERY}
        )
        `

export const ALL_BOARDS = `
    id,
    name,
    created_at,
    columns(
        ${COLUMNS_QUERY}
    )
  `
