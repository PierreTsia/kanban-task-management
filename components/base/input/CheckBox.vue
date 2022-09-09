<script lang="ts" setup>
withDefaults(
  defineProps<{ disabled: boolean; modelValue: boolean; value: any }>(),
  {
    disabled: false,
    modelValue: false,
    value: false,
  }
)

</script>

<template>
  <label
    class="checkbox"
    :class="disabled ? 'checkbox--disabled' : 'checkbox--enable'">
    <input
      type="checkbox"
      :disabled="disabled"
      :value="value"
      :checked="value" />
    <span class="checkbox__sidelabel"></span>
  </label>
</template>

<style>
.checkbox {
  @apply block relative cursor-pointer text-sm text-primary mb-0 w-full leading-5 lg:leading-4 font-basic;
  padding-left: 1.75rem;
  @apply lg:pl-5 !important;
}
.checkbox--disabled {
  @apply cursor-not-allowed text-gray-medium;
}
.checkbox input {
  @apply absolute opacity-0 cursor-pointer h-0 w-0;
}
.checkbox__sidelabel {
  @apply absolute top-0 left-0 bg-white border border-primary border-solid flex items-center justify-center rounded-sm;
  width: 1.25rem;
  height: 1.25rem;
  @apply lg:w-4 lg:h-4 !important;
}
.checkbox input:checked ~ .checkbox__sidelabel {
  @apply bg-primary-dark;
}
.checkbox__sidelabel:after {
  @apply absolute hidden;
  content: '';
}
.checkbox input:checked ~ .checkbox__sidelabel:after {
  @apply block;
}
.checkbox input:disabled ~ .checkbox__sidelabel {
  @apply opacity-20;
}
/* Style the checkbox__sidelabel/indicator */
.checkbox .checkbox__sidelabel:after {
  content: '✓';
  @apply text-white;
}
</style>
