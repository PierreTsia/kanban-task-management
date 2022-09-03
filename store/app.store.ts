import type { ColorModeInstance } from '@nuxtjs/color-mode/dist/runtime/types'
import { defineStore } from 'pinia'
import { useColorMode } from '#imports'

interface State {
  isSideBarOpen: boolean
  color: ColorModeInstance
  dialogs: {
    createBoard: boolean
    createColumn: boolean
    createTask: boolean
    deleteBoard: boolean
  }
}

export const useAppStore = defineStore('app', {
  state: (): State => {
    const color = useColorMode()

    return {
      isSideBarOpen: true,
      color,
      dialogs: {
        createBoard: false,
        createColumn: false,
        createTask: false,
        deleteBoard: false,
      },
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
    isDialogOpen() {
      return (
        dialogName: 'createBoard' | 'deleteBoard' | 'createColumn' | 'createTask'
      ): boolean => {
        return this.dialogs[dialogName]
      }
    },
  },
})
