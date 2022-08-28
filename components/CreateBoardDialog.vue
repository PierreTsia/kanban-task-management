<script lang="ts" setup>
withDefaults(defineProps<{ modelValue: boolean; persistent?: boolean }>(), {
  modelValue: false,
  persistent: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', t: boolean): void
}>()
</script>

<template>
  <BaseDialog
    v-slot="{ modelValue }"
    :model-value="modelValue"
    @update:model-value="(t) => $emit('update:modelValue', t)">
    <div class="w-480px min-h-480px flex flex-col justify-end">
      <button
        class="btn btn-primary"
        @click="$emit('update:modelValue', false)">
        Close
      </button>
    </div>
  </BaseDialog>
</template>
