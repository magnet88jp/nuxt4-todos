import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { renderSuspended, useState } from '@nuxt/test-utils/runtime'
import { __testing, useTodos } from '~/composables/useTodos'

const { STORAGE_KEY } = __testing

describe('useTodos', () => {
  beforeEach(async () => {
    localStorage.clear()
    vi.restoreAllMocks()

    await renderSuspended(() => {
      useState('todos', () => []).value = []
      useState('todos:initialized', () => false).value = false
      useState('todos:watcher-registered', () => false).value = false
    })
  })

  it('adds a trimmed todo item', async () => {
    await renderSuspended(() => {
      const { todos, addTodo } = useTodos()

      addTodo('  Learn Nuxt 4  ')

      expect(todos.value).toHaveLength(1)
      expect(todos.value[0]).toMatchObject({ title: 'Learn Nuxt 4', done: false })
    })
  })

  it('toggles todo completion state', async () => {
    await renderSuspended(() => {
      const { todos, addTodo, toggleTodo } = useTodos()

      addTodo('Write tests')
      const [todo] = todos.value

      toggleTodo(todo.id, true)
      expect(todos.value[0].done).toBe(true)

      toggleTodo(todo.id)
      expect(todos.value[0].done).toBe(false)
    })
  })

  it('removes a todo item', async () => {
    await renderSuspended(() => {
      const { todos, addTodo, removeTodo } = useTodos()

      addTodo('Cleanup task')
      const [todo] = todos.value

      removeTodo(todo.id)
      expect(todos.value).toHaveLength(0)
    })
  })

  it('clears completed todos', async () => {
    await renderSuspended(() => {
      const { todos, addTodo, toggleTodo, clearCompleted } = useTodos()

      addTodo('First')
      addTodo('Second')
      const [first] = todos.value

      toggleTodo(first.id, true)
      clearCompleted()

      expect(todos.value).toHaveLength(1)
      expect(todos.value[0].title).toBe('Second')
    })
  })

  it('hydrates todos from localStorage on first client access', async () => {
    const stored = [
      { id: '1', title: 'Persisted', done: false },
      { id: '2', title: 'Finished', done: true }
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))

    await renderSuspended(() => {
      const { todos, remainingCount, completedCount } = useTodos()

      expect(todos.value).toHaveLength(2)
      expect(remainingCount.value).toBe(1)
      expect(completedCount.value).toBe(1)
    })
  })

  it('persists updates to localStorage', async () => {
    await renderSuspended(async () => {
      const { addTodo } = useTodos()

      addTodo('Save me')
      await nextTick()
    })

    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(persisted).toHaveLength(1)
    expect(persisted[0]).toMatchObject({ title: 'Save me', done: false })
  })
})
