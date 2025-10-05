import { beforeEach, describe, expect, it } from 'vitest'
import { renderSuspended, useState } from '@nuxt/test-utils/runtime'
import { useTodos } from '~/composables/useTodos'

describe('useTodos', () => {
  beforeEach(async () => {
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
})
