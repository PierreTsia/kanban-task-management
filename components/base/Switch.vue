<script lang="ts" setup>
import type { Ref } from 'vue'
const props = withDefaults(
  defineProps<{
    id: string
    value: boolean
    disabled: boolean
    onChange?: (value: boolean) => void
  }>(),
  {
    id: '',
    value: false,
    disabled: false,
    onChange: () => {},
  }
)

const emit = defineEmits<{
  (event: 'input', value: boolean): void
}>()

const input: Ref<{ checked: boolean } | null> = ref(null)

const isChecked = computed(() => {
  return input?.value?.checked ?? false
})

const handleInput = () => {
  emit('input', isChecked.value)
}
</script>

<template>
  <input
    :id="`switch_${id}`"
    ref="input"
    class="base-switch"
    type="checkbox"
    :checked="value"
    :disabled="disabled"
    @change="handleInput" />
</template>

<style scoped>
.base-switch {
  --active: #645fc7;
  --background: #828fa3;
  --disabled: #fbf8f3;
  --disabled-inner: #eeeeee;
  -webkit-appearance: none;
  -moz-appearance: none;
  @apply h-24px w-44px rounded-17px p-0 m-0 outline-none inline-block align-top relative cursor-pointer;
  background: var(--b, var(--background));
  transition: background 0.3s, border-color 0.3s, box-shadow 0.2s;
}
.base-switch:checked {
  --b: var(--active);
  --bc: var(--active);
  --d-o: 0.3s;
  --d-t: 0.6s;
  --d-t-e: cubic-bezier(0.2, 0.85, 0.32, 1.2);
  --x: 22px;
}
.base-switch:disabled {
  @apply cursor-not-allowed opacity-40;
}
.base-switch:disabled + label {
  @apply cursor-not-allowed;
}
.base-switch:after {
  @apply bg-white border border-solid border-gray-dark absolute block  top-0 w-24px h-24px rounded-full;
  content: '';
  left: -1px;
  transition: transform var(--d-t, 0.3s) var(--d-t-e, ease),
    opacity var(--d-o, 0.2s);
  transform: translateX(var(--x, 0));
  box-shadow: 1px 0 4px 0 rgba(0, 0, 0, 0.13);
}
</style>
