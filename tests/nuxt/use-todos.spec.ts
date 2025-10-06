// tests/nuxt/use-todos.spec.ts（抜粋・差分）
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useState } from '#imports'
import { __testing, useTodos } from '~/composables/useTodos'

const { STORAGE_KEY } = __testing

async function resetNuxtStates() {
  await mountSuspended({
    setup() {
      useState('todos', () => []).value = []
      useState('todos:initialized', () => false).value = false
      useState('todos:watcher-registered', () => false).value = false
      return {}
    },
    template: '<div />',
  })
}

describe('useTodos', () => {
  beforeEach(async () => {
    localStorage.clear()
    vi.restoreAllMocks()
    await resetNuxtStates()
  })

  it('adds a trimmed todo item', async () => {
    let api!: ReturnType<typeof useTodos>

    await mountSuspended({
      setup() {
        api = useTodos()           // ← ここで外側に捕まえる
        return {}
      },
      template: '<div />',
    })

    api.addTodo('  Learn Nuxt 4  ')
    expect(api.todos.value).toHaveLength(1)
    expect(api.todos.value[0]).toMatchObject({ title: 'Learn Nuxt 4', done: false })
  })

  it('toggles todo completion state', async () => {
    let api!: ReturnType<typeof useTodos>
    await mountSuspended({ setup(){ api = useTodos(); return {} }, template: '<div />' })

    api.addTodo('Write tests')
    const [todo] = api.todos.value

    api.toggleTodo(todo.id, true)
    expect(api.todos.value[0].done).toBe(true)

    api.toggleTodo(todo.id)
    expect(api.todos.value[0].done).toBe(false)
  })

  it('removes a todo item', async () => {
    let api!: ReturnType<typeof useTodos>
    await mountSuspended({ setup(){ api = useTodos(); return {} }, template: '<div />' })

    api.addTodo('Cleanup task')
    const [todo] = api.todos.value

    api.removeTodo(todo.id)
    expect(api.todos.value).toHaveLength(0)
  })

  it('clears completed todos', async () => {
    let api!: ReturnType<typeof useTodos>
    await mountSuspended({ setup(){ api = useTodos(); return {} }, template: '<div />' })

    api.addTodo('First')
    api.addTodo('Second')
    const [first] = api.todos.value

    api.toggleTodo(first.id, true)
    api.clearCompleted()

    expect(api.todos.value).toHaveLength(1)
    expect(api.todos.value[0].title).toBe('Second')
  })

  it('hydrates todos from localStorage on first client access', async () => {
    const stored = [
      { id: '1', title: 'Persisted', done: false },
      { id: '2', title: 'Finished', done: true },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))

    let api!: ReturnType<typeof useTodos>
    await mountSuspended({ setup(){ api = useTodos(); return {} }, template: '<div />' })

    expect(api.todos.value).toHaveLength(2)
    expect(api.remainingCount.value).toBe(1)
    expect(api.completedCount.value).toBe(1)
  })

  it('persists updates to localStorage', async () => {
    let api!: ReturnType<typeof useTodos>
    await mountSuspended({ setup(){ api = useTodos(); return {} }, template: '<div />' })

    api.addTodo('Save me')
    await nextTick()

    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(persisted).toHaveLength(1)
    expect(persisted[0]).toMatchObject({ title: 'Save me', done: false })
  })
})
