<template>
  <div class="projects">
    <div class="projects__filters">
      <Button
        label="Add Task"
        icon="pi pi-plus"
        severity="info"
        rounded
        size="small"
        @click="addTask"
      />
    </div>

    <div class="buttons-toggle">
      <Button
        label="Table"
        :class="{ active: tabs === 'table' }"
        class="btn"
        size="small"
        @click="viewTask('table')"
      />

      <Button
        label="Kanban"
        :class="{ active: tabs === 'kanban' }"
        class="btn"
        size="small"
        @click="viewTask('kanban')"
      />
    </div>

    <div class="projects__table">
      <Table v-if="tabs === 'table'" :data="tasks" :title="'Tasks'" :column="columns" />
      <Kanban v-if="tabs === 'kanban'" />
    </div>

    <ModalWrapper v-model:visible="visible" :title="'Add project'">
      <AddTaskModal @create="create" @close="closeModal" />
    </ModalWrapper>
  </div>
</template>

<script setup lang="ts">
import Table from '@/components/Table.vue'
import ModalWrapper from '@/components/ModalWrapper.vue'
import AddTaskModal from '@/components/tasks/AddTaskModal.vue'
import Kanban from '@/components/tasks/kanban/Kanban.vue'

import Button from 'primevue/button'

import { useTasksStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Types
import type { ColumnT } from '@/types/table'
import type { FormT, Task } from '@/types/tasks'

const route = useRoute()

const { fetchTasks, createTask } = useTasksStore()
const { tasks } = storeToRefs(useTasksStore())

// Data
const columns = ref<ColumnT[]>([
  { field: 'id', header: 'ID task', sort: false, width: '50px' },
  { field: 'name', header: 'Task name', sort: false, search: false },
  { field: 'performer', header: 'Performer', sort: false },
  { field: 'status', header: 'Status', sort: false },
  { field: 'deadline', header: 'Deadline', sort: true },
])
const visible = ref<boolean>(false)
const id = route.params.id as string
const tabs = ref('table')

// Methods
function addTask() {
  visible.value = true
}

function closeModal() {
  visible.value = false
}

async function create(data: FormT) {
  const task = {
    ...data,
    projectId: route.params.id,
  } as Task

  try {
    await createTask(task)
    await fetchTasks(id)
    closeModal()
  } catch (error) {
    console.error(error)
  }
}

function viewTask(view: string) {
  tabs.value = view
}

// lifecicle hooks
onMounted(async () => {
  await fetchTasks(id)
})
</script>

<style scoped lang="scss">
.projects {
  &__filters {
    display: flex;
    justify-content: end;
    margin: 30px 0;
  }
  .buttons-toggle {
    margin-bottom: 20px;
    display: flex;
    gap: 15px;
  }
  .active {
    background: #4b4c4e !important;
    color: white !important;
  }
}
</style>
