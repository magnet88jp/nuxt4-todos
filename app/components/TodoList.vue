<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <span class="font-semibold">Todo リスト</span>
        <span class="text-sm text-gray-500">
          未完了 {{ remaining }} / 全体 {{ total }}
        </span>
      </div>
    </template>

    <ul v-if="todos.length" class="divide-y divide-gray-200">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @toggle="(id, value) => emit('toggle', id, value)"
        @remove="(id) => emit('remove', id)"
      />
    </ul>
    <p v-else class="py-6 text-center text-gray-500">まだタスクがありません。最初のTodoを追加しましょう。</p>

    <template v-if="completed > 0" #footer>
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-500">完了 {{ completed }} 件</span>
        <UButton variant="ghost" size="sm" color="neutral" @click="emit('clearCompleted')">
          完了を削除
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import type { Todo } from '~/composables/useTodos'
import TodoItem from '~/components/TodoItem.vue'

const props = defineProps<{
  todos: Todo[]
  remaining: number
  completed: number
}>()

const emit = defineEmits<{
  (event: 'toggle', id: string, value: boolean): void
  (event: 'remove', id: string): void
  (event: 'clearCompleted'): void
}>()

const total = computed(() => props.todos.length)

const { todos, remaining, completed } = toRefs(props)
</script>
