<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '~/store/app.store'
import { useBoardsStore } from '~/store/boards.store'

const boardsStore = useBoardsStore()
const { activeBoard } = storeToRefs(boardsStore)
const appStore = useAppStore()
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
    <div class="flex-1 flex flex-col justify-start items-center w-full">
      <aside
        class="w-full h-96px flex justify-between items-center px-8 md:border-b-1 border-b-gray-light dark:border-b-black-light">
        <h1 class="heading heading-xl">{{ activeBoard?.name }}</h1>
        <section class="inline-flex items-center gap-x-4">
          <button class="btn btn-lg btn-primary w-175px">
            <IconsPlus class="mr-1" />

            Add New Task
          </button>
          <IconsVerticalEllipsis class="text-gray-dark hover:text-primary-light cursor-pointer" />
        </section>
      </aside>
      <div
        class="w-full flex items-center justify-center flex-1 bg-gray-light dark:bg-black-dark">
        test
      </div>
    </div>
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
