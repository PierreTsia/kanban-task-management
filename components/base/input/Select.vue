<script lang="ts" setup>
interface SelectInputProps {
  options: { id: number; name: string }[]
  modelValue: { id: number; name: string } | null
}
const props = defineProps<SelectInputProps>()
const emit = defineEmits<{
  (e: 'onSelectOption', o: { id: number; name: string }): void
}>()

const selectedOption = ref(props.modelValue)

const setSelectedOption = (
  option: { id: number; name: string },
  toggleDropDown: () => void
) => {
  selectedOption.value = option
  toggleDropDown()
}

watch(
  () => props.modelValue,
  (newValue) => {
    selectedOption.value = newValue
  },
  { immediate: false }
)

watch(selectedOption, (option) => {
  if (option) {
    emit('onSelectOption', option)
  }
})
</script>

<template>
  <BaseDropDown class="h-10 w-full">
    <template #activator="{ activatorProps }">
      <div
        class="w-full flex items-center justify-between appearance-none rounded border dark:border-black-light py-2 px-3 dark:bg-transparent dark:text-white text-sm mb-3 leading-tight focus:outline-none focus:shadow-outline"
        :class="{ 'border border-primary-dark': activatorProps.isVisible }">
        <span v-if="selectedOption" class="flex w-8/10">{{
          selectedOption.name
        }}</span>
        <IconsChevronDown
          v-if="!activatorProps.isVisible"
          class="w-3 inline-block" />
        <IconsChevronUp v-else class="w-3 inline-block" />
      </div>
    </template>

    <template #content="{ content }">
      <div
        class="flex flex-col rounded-lg shadow-xl bg-white dark:bg-black-light">
        <ul class="flex flex-col w-400px text-gray-dark dark:text-gray-medium">
          <li
            v-for="option in options"
            :key="option.id"
            class="inline-flex items-center !min-w-full justify-between hover:text-primary-dark w-full px-2 py-2 cursor-pointer text-left"
            @click="setSelectedOption(option, content.toggle)">
            <span class="w-full paragraph paragraph-lg">{{ option.name }}</span>
          </li>
        </ul>
      </div>
    </template>
  </BaseDropDown>
</template>
