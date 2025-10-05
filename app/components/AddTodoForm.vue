<template>
  <form class="flex flex-col gap-3 sm:flex-row" @submit.prevent="handleSubmit">
    <UInput
      v-model="title"
      name="title"
      placeholder="新しいタスクを入力"
      aria-label="Todo title"
      class="flex-1"
    />
    <UButton type="submit" color="primary" :disabled="isDisabled">
      追加
    </UButton>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const emit = defineEmits<{ (event: 'submit', title: string): void }>()

const title = ref('')

const isDisabled = computed(() => title.value.trim().length === 0)

const handleSubmit = () => {
  const trimmed = title.value.trim()
  if (!trimmed) {
    return
  }

  emit('submit', trimmed)
  title.value = ''
}
</script>
