<template>
  <div class="card">
    <h3>{{ element.name }}</h3>
    <p class="text"><strong>Виконавець:</strong> {{ element.performer }}</p>
    <p class="text">
      <strong>Статус:</strong>
      <span class="status" :style="{ color: getSeverity(element.status), fontWeight: 600 }">{{
        element.status
      }}</span>
    </p>

    <p class="text"><strong>Термін виконання: </strong>{{ element.deadline }}</p>

    <div class="buttons">
      <Button icon="pi pi-pencil" severity="info" rounded text @click.stop="editItem(element as Task)" />
      <Button icon="pi pi-trash" severity="danger" rounded text @click.stop="deleteItem(element as Task)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

// Types
import type { Task } from '@/types/tasks' 

// Props
const props = defineProps({
  element: {
    type: Object,
    default: () => {},
  },
})

// Emits
const emit = defineEmits<{
  (e: 'edit', item: Task): void
  (e: 'delete', item: Task): void
}>()

// Methods
const getSeverity = (status: string) => {
  switch (status) {
    case 'done':
      return 'green'
    case 'in_progress':
      return 'red'
    case 'todo':
      return 'gray'
    default:
      return undefined
  }
}

const editItem = (item: Task) => {
  emit('edit', item)
}

const deleteItem = (item: Task) => {
  emit('delete', item)
}
</script>

<style scoped lang="scss">
.card {
  padding: 20px;
  background: white;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: grab;
  .text {
    margin-top: 15px;
    font-size: 16px;
  }
  .status {
    margin-left: 10px;
  }
  .buttons {
    border-top: 1px solid grey;
    display: flex;
    justify-content: end;
  }
}
</style>
