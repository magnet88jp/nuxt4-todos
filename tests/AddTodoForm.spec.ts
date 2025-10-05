import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AddTodoForm from '~/components/AddTodoForm.vue'

describe('AddTodoForm', () => {
  it('emits submit event with trimmed value', async () => {
    const wrapper = await mountSuspended(AddTodoForm)

    const input = wrapper.get('input')
    await input.setValue('  New Task ')

    await wrapper.get('form').trigger('submit.prevent')

    const events = wrapper.emitted('submit')
    expect(events).toBeTruthy()
    expect(events?.[0]).toEqual(['New Task'])
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('')
  })
})
