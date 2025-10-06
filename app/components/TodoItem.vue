<template>
  <li class="flex items-center gap-3 justify-between py-2">
    <UCheckbox
      :model-value="todo.done"
      color="primary"
      class="flex-1"
      @update:model-value="handleToggle"
    >
      <template #label>
        <span :class="todo.done ? 'line-through text-gray-400' : ''">
          {{ todo.title }}
        </span>
      </template>
    </UCheckbox>

    <UButton
      icon="i-lucide-trash-2"
      color="neutral"
      variant="ghost"
      size="xs"
      aria-label="削除"
      @click="emit('remove', todo.id)"
    />
  </li>
</template>

<script setup lang="ts">
import type { Todo } from '~/composables/useTodos'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  (event: 'toggle', id: string, value: boolean): void
  (event: 'remove', id: string): void
}>()

const handleToggle = (value: boolean) => {
  emit('toggle', props.todo.id, value)
}
</script>