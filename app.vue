<script lang="ts" setup>
import { useAppStore } from '~/store/app.store'

useHead({
  title: 'Kanban Task Management',
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/assets/favicon-32x32.png',
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage class="font-jakarta" />
  </NuxtLayout>
</template>

<style>
html.scroll-lock {
  position: fixed;
  overflow-y: scroll;
  top: 0;
  width: 100%;
}
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
}

html.dark {
  background: #2b2c37;
  color: #ffffff;
}
</style>
