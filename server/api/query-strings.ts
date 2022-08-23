const PREVIOUS_AND_NEXT_IDS = `
    previous(id),
    next(id)
 `
export const ALL_BOARDS = `
    id,
    name,
    created_at,
    columns(
        id,
        name,
        ${PREVIOUS_AND_NEXT_IDS},
        tasks(
            id,
            title,
            description,
            ${PREVIOUS_AND_NEXT_IDS},
            subtasks(
                id,
                title,
                is_completed
            )
        )
    )
  `
