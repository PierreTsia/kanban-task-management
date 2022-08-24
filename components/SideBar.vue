<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '~/store/app.store'

withDefaults(defineProps<{ isOpen: boolean }>(), {
  isOpen: false,
})

const appStore = useAppStore()
const { isDarkMode } = storeToRefs(appStore)
</script>

<template>
  <div
    class="z-index-12 overflow-hidden transition-all"
    :class="
      isOpen
        ? 'w-full md:w-260px lg:w-300px md:border-r-1 border-r-gray-light dark:border-r-black-light'
        : ['w-0', 'pl-0']
    ">
    <div v-if="isOpen" class="w-full flex flex-col flex-1">
      <Logo class="h-100px" />
      <BoardsMenu />

      <section class="mt-auto pb-8">
        <div
          class="bg-gray-light dark:bg-black-dark p-4 w-90% mx-auto rounded-lg flex justify-center items-center gap-x-4">
          <IconsLight class="text-gray-dark" />
          <BaseSwitch
            id="dark-mode-switch"
            :value="isDarkMode"
            :disabled="false"
            @input="appStore.toggleColorMode" />
          <IconsDark class="text-gray-dark" />
        </div>
        <div class="mt-4">
          <button
            class="btn inline-flex items-center text-gray-dark w-full px-4"
            @click="appStore.toggleSideBar">
            <IconsEyeClosed class="mr-2" />
            Hide sidebar
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
