<script lang="ts" setup>
defineProps<{ element: any }>()

const getBackgroundColor = (stringInput: string) => {
  let hash = 0
  for (let i = 0; i < stringInput.length; i++) {
    hash = stringInput.charCodeAt(i) + ((hash << 5) - hash)
  }
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    colour += `00${value.toString(16)}`.substr(-2)
  }
  return colour
}
</script>

<template>
  <div class="w-330px cursor-grab">
    <h1
      class="inline-flex items-center justify-start w-full pl-6 py-2 heading heading-sm uppercase text-gray-dark">
      <span
        class="block w-3 h-3 rounded-full mr-2"
        :style="{ backgroundColor: getBackgroundColor(element.name) }"></span>
      {{ element.name }} ({{ element?.tasks?.length }})
    </h1>
    <slot />
  </div>
</template>
