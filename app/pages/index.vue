<template>
  <main class="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-10">
    <header class="flex flex-col gap-2 text-center">
      <h1 class="text-3xl font-semibold tracking-tight">Todo アプリ</h1>
      <p class="text-sm text-gray-500">タスクを追加して進捗を管理しましょう。</p>
    </header>

    <AddTodoForm @submit="handleAdd" />

    <TodoList
      :todos="todos"
      :remaining="remainingCount"
      :completed="completedCount"
      @toggle="handleToggle"
      @remove="handleRemove"
      @clear-completed="handleClearCompleted"
    />
  </main>
</template>

<script setup lang="ts">
import AddTodoForm from '~/components/AddTodoForm.vue'
import TodoList from '~/components/TodoList.vue'
import { useTodos } from '~/composables/useTodos'

const { todos, addTodo, toggleTodo, removeTodo, clearCompleted, remainingCount, completedCount } = useTodos()

const handleAdd = (title: string) => {
  addTodo(title)
}

const handleToggle = (id: string, value: boolean) => {
  toggleTodo(id, value)
}

const handleRemove = (id: string) => {
  removeTodo(id)
}

const handleClearCompleted = () => {
  clearCompleted()
}
</script>