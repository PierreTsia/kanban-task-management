<script lang="ts" setup>
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
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
}

html.dark {
  background: #222;
  color: white;
}
</style>
