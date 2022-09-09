<script lang="ts" setup>
const props = withDefaults(defineProps<{ type?: 'board' | 'task' }>(), {
  type: 'board',
})

const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'edit'): void
}>()

const boardMenu = ref([
  {
    name: 'Edit Board',
    handler: (cb: Function) => {
      emit('edit')
      cb()
    },
  },
  {
    name: 'Delete Board',
    handler: (cb: Function) => {
      emit('delete')
      cb()
    },
  },
])

const taskMenuMenu = ref([
  {
    name: 'Edit Task',
    handler: (cb: Function) => {
      emit('edit')
      cb()
    },
  },
  {
    name: 'Delete Task',
    handler: (cb: Function) => {
      emit('delete')
      cb()
    },
  },
])

const activeMenu = computed(() => {
  return props.type === 'board' ? boardMenu.value : taskMenuMenu.value
})
</script>

<template>
  <BaseDropDown :offset="[-80, 10]">
    <template #activator>
      <button class="px-4">
        <IconsVerticalEllipsis
          class="text-gray-dark hover:text-primary-light cursor-pointer" />
      </button>
    </template>

    <template #content="{ content }">
      <ul
        class="flex flex-col w-200px rounded-lg dark:text-white shadow-xl bg-white dark:bg-black-light py-2">
        <li
          v-for="(item, i) in activeMenu"
          :key="i"
          class="paragraph paragraph-lg w-full px-2 py-3 cursor-pointer text-left hover:bg-primary-light hover:bg-opacity-10"
          :class="
            item.name.startsWith('Delete') ? 'text-red' : 'text-gray-dark'
          "
          @click="item.handler(content.toggle)">
          <span> {{ item.name }} </span>
        </li>
      </ul>
    </template>
  </BaseDropDown>
</template>
