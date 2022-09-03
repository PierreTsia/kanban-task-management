<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useBoardsStore } from '~/store/boards.store'
import { useAppStore } from '~/store/app.store'

const boardsStore = useBoardsStore()
const appStore = useAppStore()
const { dialogs } = storeToRefs(appStore)
const { activeBoard } = storeToRefs(boardsStore)
</script>

<template>
  <aside
    class="w-full h-96px flex justify-between items-center px-8 py-4 md:border-b-1 border-b-gray-light dark:border-b-black-light">
    <h1 class="heading heading-xl">{{ activeBoard?.name }}</h1>
    <section class="inline-flex items-center">
      <button class="heading heading-md btn btn-lg btn-primary w-175px">
        <IconsPlus class="mr-1" />
        Create new task
      </button>

      <BoardContextualMenu @delete-board="dialogs.deleteBoard = true" />
    </section>
  </aside>
</template>
