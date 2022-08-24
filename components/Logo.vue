<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '~/store/app.store'

const appStore = useAppStore()
const { isDarkMode } = storeToRefs(appStore)
</script>

<template>
  <div class="flex items-center justify-center">
    <img
      v-show="isDarkMode"
      class="inline-block"
      src="/assets/logo-light.svg"
      alt="logo light" />
    <img
      v-show="!isDarkMode"
      class="inline-block"
      src="/assets/logo-dark.svg"
      alt="logo dark" />
  </div>
</template>
