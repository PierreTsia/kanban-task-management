<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { useInputValidation } from '~/composables/inputValidation'

const props = withDefaults(defineProps<TextAreaProps>(), {
  modelValue: '',
  isError: false,
  placeholder: '',
  errorMessage: null,
})
const emit = defineEmits(['update:modelValue'])

interface TextAreaProps {
  modelValue: string
  isError?: boolean
  placeholder?: string
  errorMessage?: string | null
}

const data = useVModel(props, 'modelValue', emit)
const hasError = computed(() => props.errorMessage)

const { isFocused, hasBeenFocused, setFocus } = useInputValidation()
</script>

<template>
  <div class="h-30 w-full relative">
    <textarea
      ref="inputRef"
      v-model="data"
      class="resize-none w-full min-h-30 rounded border dark:border-black-light py-2 px-3 dark:bg-transparent dark:text-white text-sm mb-3 leading-tight focus:outline-none focus:shadow-outline"
      :class="{
        'border border-primary-dark': isFocused,
        'border !border-red-dark text-red-dark': hasBeenFocused && hasError,
      }"
      :placeholder="props.placeholder"
      @focus="setFocus()"
      @blur="setFocus(false)" />
    <p
      v-if="hasBeenFocused && hasError"
      class="text-red-dark paragraph paragraph-lg absolute bottom-2 right-3">
      {{ errorMessage }}
    </p>
  </div>
</template>
