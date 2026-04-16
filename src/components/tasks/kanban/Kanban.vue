<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-xl font-bold">Tasks</h2>
    </div>

    <div class="kanban">
      <!-- TODO -->
      <div class="column">
        <h3 class="title">To Do</h3>

        <draggable v-model="todo" group="tasks" item-key="id" @change="onChange('todo', $event)">
          <template #item="{ element }">
            <Card :element="element" />
          </template>
        </draggable>
      </div>

      <!-- IN PROGRESS -->
      <div class="column">
        <h3 class="title">In Progress</h3>

        <draggable
          v-model="inProgress"
          group="tasks"
          item-key="id"
          @change="onChange('in_progress', $event)"
        >
          <template #item="{ element }">
            <Card :element="element" />
          </template>
        </draggable>
      </div>

      <!-- DONE -->
      <div class="column">
        <h3 class="title">Done</h3>

        <draggable v-model="done" group="tasks" item-key="id" @change="onChange('done', $event)">
          <template #item="{ element }">
            <Card :element="element" />
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'

import { useTasksStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import Card from './Card.vue'

// Types
import type { Task } from '@/types/tasks'

const { fetchTasks, updateTask } = useTasksStore()
const { tasks } = storeToRefs(useTasksStore())

// Data
const todo = ref<Task[]>([])
const inProgress = ref<Task[]>([])
const done = ref<Task[]>([])

// Watchers
watch(
  tasks,
  (val) => {
    todo.value = val.filter((t) => t.status === 'todo')
    inProgress.value = val.filter((t) => t.status === 'in_progress')
    done.value = val.filter((t) => t.status === 'done')
  },
  { immediate: true },
)

// Methods
const onChange = (status: string, event: any) => {
  console.log('>>', status, event.added)
  if (event.added) {
    const task = event.added.element

    task.status = status

    updateTask(task)
  }
}
</script>

<style scoped lang="scss">
.kanban {
  display: flex;
  gap: 16px;
}

.column {
  width: 350px;
  // flex: 1;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  .title {
    text-align: center;
    text-decoration: underline;
  }
}
</style>
