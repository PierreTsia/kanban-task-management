<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import { useDOMScrollLock } from '@/composables/DOMScrollLock'
const props = withDefaults(
  defineProps<{ modelValue: boolean; persistent?: boolean }>(),
  {
    modelValue: false,
    persistent: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', t: boolean): void
}>()

const refCard = ref(null)
const close = () => {
  if (!props.modelValue) {
    return
  }
  emit('update:modelValue', false)
}

if (!props.persistent) {
  onClickOutside(refCard, () => {
    close()
  })
}

// Lock DOM scroll when modelValue is `true`
useDOMScrollLock(toRef(props, 'modelValue'))
</script>

<template>
  <Teleport to="body">
    <Transition name="bg">
      <div
        v-show="modelValue"
        class="dialog-wrapper grid z-1 uno-layer-base-place-items-center fixed uno-layer-base-inset-0 bg-black-dark bg-opacity-70">
        <Transition name="scale">
          <div
            v-show="modelValue"
            ref="refCard"
            class="bg-white dark:bg-black-medium rounded-lg shadow-lg">
            <slot
              class="z-10 backface-hidden transform translate-z-0 max-w-[calc(100vw-2rem)]"
              :model-value="modelValue"
              v-bind="[$props, $attrs]">
            </slot>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.bg-enter-active,
.bg-leave-active {
  transition: background-color 0.2s ease-in-out;
}

.bg-enter-from,
.bg-leave-to {
  background-color: transparent !important;
}

.scale-enter-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.18s cubic-bezier(0.5, 1, 0.89, 1);
}

.scale-leave-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.25s cubic-bezier(0, 0.55, 0.45, 1);
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.45) !important;
}
</style>
