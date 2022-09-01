<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useBoardsStore } from '~/store/boards.store'

const boardsStore = useBoardsStore()
const { boards, activeBoardId } = storeToRefs(boardsStore)

const isCreateBoardDialogOpen = ref(false)
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <CreateBoardDialog v-model="isCreateBoardDialogOpen"  />

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

      <BoardsMenuItem @click="isCreateBoardDialogOpen = true">
        <span class="inline-flex items-center">
          <IconsPlus class="mr-1" />
          Create new board
        </span>
      </BoardsMenuItem>
    </ul>
  </div>
</template>
