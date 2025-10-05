import { computed, watch } from 'vue'
import { useState } from '#imports'

export interface Todo {
  id: string
  title: string
  done: boolean
}

const STORAGE_KEY = 'nuxt4-todos'
const isBrowser = typeof window !== 'undefined'

type StoredTodos = Todo[]

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

function readFromStorage(): StoredTodos {
  if (!isBrowser) {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as StoredTodos

    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is Todo =>
          Boolean(item) &&
          typeof item.id === 'string' &&
          typeof item.title === 'string' &&
          typeof item.done === 'boolean'
      )
    }

    return []
  } catch {
    return []
  }
}

function writeToStorage(todos: Todo[]) {
  if (!isBrowser) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export function useTodos() {
  const todos = useState<Todo[]>('todos', () => [])
  const initialized = useState('todos:initialized', () => false)

  if (isBrowser && !initialized.value) {
    const stored = readFromStorage()
    if (stored.length > 0) {
      todos.value = stored
    }
    initialized.value = true
  }

  if (isBrowser) {
    const watcherRegistered = useState('todos:watcher-registered', () => false)

    if (!watcherRegistered.value) {
      watch(
        todos,
        (value) => {
          writeToStorage(value)
        },
        { deep: true, flush: 'post' }
      )
      watcherRegistered.value = true
    }
  }

  const addTodo = (title: string) => {
    const trimmed = title.trim()
    if (!trimmed) {
      return
    }

    todos.value = [...todos.value, { id: createId(), title: trimmed, done: false }]
  }

  const toggleTodo = (id: string, done?: boolean) => {
    todos.value = todos.value.map((todo) => {
      if (todo.id !== id) {
        return todo
      }

      const nextDone = typeof done === 'boolean' ? done : !todo.done
      return { ...todo, done: nextDone }
    })
  }

  const removeTodo = (id: string) => {
    todos.value = todos.value.filter((todo) => todo.id !== id)
  }

  const clearCompleted = () => {
    todos.value = todos.value.filter((todo) => !todo.done)
  }

  const remainingCount = computed(() => todos.value.filter((todo) => !todo.done).length)
  const completedCount = computed(() => todos.value.length - remainingCount.value)

  return {
    todos,
    addTodo,
    toggleTodo,
    removeTodo,
    clearCompleted,
    remainingCount,
    completedCount,
    totalCount: computed(() => todos.value.length)
  }
}

export const __testing = {
  STORAGE_KEY
}
