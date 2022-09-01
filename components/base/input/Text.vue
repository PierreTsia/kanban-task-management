<script lang="ts" setup>
import debounce from 'lodash/debounce'
import { useVModel } from '@vueuse/core'
import { useInputValidation } from '~/composables/inputValidation'
const props = withDefaults(defineProps<TextInputProps>(), {
  modelValue: '',
  placeholder: 'Enter task name',
  errorMessage: null,
})

const emit = defineEmits(['update:modelValue'])

interface TextInputProps {
  modelValue: string
  isError?: boolean
  placeholder?: string
  errorMessage?: string | null
}

const data = useVModel(props, 'modelValue', emit)
const hasError = computed(() => props.errorMessage)

const hasTypedInside = ref(false)

const { isFocused, hasBeenFocused, setFocus } = useInputValidation()

const handleInput = debounce(() => {
  hasTypedInside.value = true
}, 500)
const handleBlur = () => {
  setFocus(false)
}
</script>

<template>
  <div class="h-40px w-full relative">
    <input
      ref="inputRef"
      v-model="data"
      class="mr-2 w-full appearance-none rounded border dark:border-black-light py-2 px-3 dark:bg-transparent dark:text-white text-sm mb-3 leading-tight focus:outline-none focus:shadow-outline"
      :class="{
        'border-primary-dark': isFocused,
        '!dark:border-red-dark border-red-dark text-red-dark':
          hasBeenFocused && hasError && hasTypedInside,
      }"
      :placeholder="props.placeholder"
      @focus="setFocus"
      @input="handleInput"
      @blur="handleBlur" />
    <p
      v-if="hasBeenFocused && hasError && hasTypedInside"
      class="paragraph paragraph-lg absolute top-[calc(50%-15px)] text-right right-3 text-red-dark h-40px">
      {{ errorMessage }}
    </p>
  </div>
</template>
