<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useBoardsStore } from '~/store/boards.store'
import { useAppStore } from '~/store/app.store'

const boardsStore = useBoardsStore()
const { boards, activeBoardId, editedBoardId } = storeToRefs(boardsStore)

const appStore = useAppStore()
const { dialogs } = storeToRefs(appStore)

const handleCreateClick = () => {
  editedBoardId.value = null
  dialogs.value.upsertBoard = true
}
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <h4 class="heading heading-sm uppercase text-gray-dark">
      All Boards ({{ boards.length }})
    </h4>
    <ul class="w-90% py-2">
      <BoardsMenuItem
        v-for="board in boards"
        :key="board.id"
        :is-active="board.id === activeBoardId"
        @on-click="boardsStore.setActiveBoardId(board.id)">
        {{ board.name }}
      </BoardsMenuItem>

      <BoardsMenuItem @click="handleCreateClick">
        <span class="inline-flex items-center">
          <IconsPlus class="mr-1" />
          Create new board
        </span>
      </BoardsMenuItem>
    </ul>
  </div>
</template>
