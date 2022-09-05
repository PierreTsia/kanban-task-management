const PREVIOUS_AND_NEXT_IDS = `
    previous(id),
    next(id)
 `
export const COLUMNS_QUERY = `
        id,
        name,
        ${PREVIOUS_AND_NEXT_IDS},
        tasks(
            id,
            title,
            description,
            created_at,
            ${PREVIOUS_AND_NEXT_IDS},
            subtasks(
                id,
                title,
                is_completed
            )
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
