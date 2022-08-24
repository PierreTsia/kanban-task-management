import type { ColorModeInstance } from '@nuxtjs/color-mode/dist/runtime/types'
import { defineStore } from 'pinia'
import { useColorMode } from '#imports'

interface State {
  isSideBarOpen: boolean
  color: ColorModeInstance
}

export const useAppStore = defineStore('app', {
  state: (): State => {
    const color = useColorMode()

    return {
      isSideBarOpen: true,
      color,
    }
  },
  actions: {
    toggleSideBar(): void {
      this.isSideBarOpen = !this.isSideBarOpen
    },
    toggleColorMode(): void {
      this.color.preference = this.color.value === 'dark' ? 'light' : 'dark'
    },
  },
  getters: {
    isDarkMode: (state): boolean => state.color.value === 'dark',
  },
})
