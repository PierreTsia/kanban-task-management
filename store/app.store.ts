import type { ColorModeInstance } from '@nuxtjs/color-mode/dist/runtime/types'
import { defineStore } from 'pinia'
import { useColorMode } from '#imports'

interface State {
  isSideBarOpen: boolean
  color: ColorModeInstance
  dialogs: {
    upsertBoard: boolean
    createColumn: boolean
    deleteBoard: boolean
    createTask: boolean
  }
}

type DialogName = keyof State['dialogs']

export const useAppStore = defineStore('app', {
  state: (): State => {
    const color = useColorMode()

    return {
      isSideBarOpen: true,
      color,
      dialogs: {
        upsertBoard: false,
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
      return (dialogName: DialogName): boolean => {
        return this.dialogs[dialogName]
      }
    },
  },
})
