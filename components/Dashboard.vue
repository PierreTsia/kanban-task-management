<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '~/store/app.store'
import { useBoardsStore } from '~/store/boards.store'

const boardsStore = useBoardsStore()
const appStore = useAppStore()
const { sortedTasksByColumnId, activeBoardColumns } = storeToRefs(boardsStore)
const { isSideBarOpen } = storeToRefs(appStore)

await boardsStore.getAllBoards()
</script>

<template>
  <div class="w-full h-screen flex flex-start relative">
    <Transition name="slide-fade">
      <button
        v-show="!isSideBarOpen"
        class="fixed flex items-center justify-center bottom-80px bg-primary-dark hover:bg-primary-light cursor-pointer rounded-tr-full rounded-br-full h-48px w-56px"
        @click="appStore.toggleSideBar">
        <IconsEyeOpened class="text-white" />
      </button>
    </Transition>

    <SideBar class="w-0 hidden md:flex" :is-open="isSideBarOpen" />
    <div class="flex-1 flex items-center justify-center">Content</div>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
