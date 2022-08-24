<script lang="ts" setup>
withDefaults(defineProps<{ isActive?: boolean }>(), { isActive: false })
defineEmits<{
  (event: 'onClick'): void
}>()
</script>

<template>
  <li
    :class="{
      'bg-primary-dark': isActive,
      'hover:bg-primary-light hover:bg-opacity-20': !isActive,
    }"
    class="group transition[background] ease-in-out duration-200 pl-7 h-48px w-full text-left mb-1 inline-flex items-center rounded-tr-full rounded-br-full cursor-pointer"
    @click="$emit('onClick')">
    <IconsBoard
      class="mr-3 dark:group-hover:text-white"
      :class="
        isActive
          ? 'text-white'
          : 'text-gray light:group-hover:text-primary-dark'
      " />
    <p
      class="heading heading-md dark:group-hover:text-white"
      :class="
        isActive
          ? 'text-white'
          : 'text-gray-dark light:group-hover:text-primary-dark'
      ">
      <slot />
    </p>
  </li>
</template>
