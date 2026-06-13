<template>
  <div class="projects">
    <div class="projects__filters">
      <Button
        label="Додати завдання"
        icon="pi pi-plus"
        severity="info"
        rounded
        size="small"
        @click="addTask"
      />
    </div>

    <div class="buttons-toggle">
      <Button
        label="Таблиця"
        :class="{ active: tabs === 'table' }"
        class="btn"
        size="small"
        @click="viewTask('table')"
      />

      <Button
        label="Канбан"
        :class="{ active: tabs === 'kanban' }"
        class="btn"
        size="small"
        @click="viewTask('kanban')"
      />
    </div>

    <h2 class="title">{{ title?.name }}</h2>

    <div class="projects__table">
      <Table
        v-if="tabs === 'table'"
        :data="tasks"
        :title="'Завдання'"
        :column="columns"
        @edit="edit"
        @delete="remove"
      />
      <Kanban v-if="tabs === 'kanban'" @edit="edit" @delete="remove" />
    </div>

    <ModalWrapper
      v-model:visible="visible"
      :title="editingTask ? 'Редагувати завдання' : 'Створити завдання'"
    >
      <AddTaskModal :task="editingTask" @create="saveTask" @close="closeModal" />
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppToast } from '@/composables/useAppToast'

// Types
import type { ColumnT } from '@/types/table'
import type { FormT, Task } from '@/types/tasks'
import type { BaseTableData } from '@/types/table'
import { useProjectsStore } from '@/stores/projects'

const route = useRoute()
const { showToast } = useAppToast()

const { fetchTasks, createTask, editTask, deleteTask } = useTasksStore()
const { updateProject, fetchProjects } = useProjectsStore()
const { tasks } = storeToRefs(useTasksStore())
const { projects } = storeToRefs(useProjectsStore())

// Data
const columns = ref<ColumnT[]>([
  { field: 'id', header: 'ID завдання', sort: false, width: '50px' },
  { field: 'name', header: 'Назва завдання', sort: false, search: false },
  { field: 'performer', header: 'Виконавець', sort: false },
  { field: 'status', header: 'Статус', sort: true },
  { field: 'deadline', header: 'Термін виконання', sort: true },
  { field: 'action', header: 'Дії', sort: false },
])
const visible = ref<boolean>(false)
const id = route.params.id as string
const tabs = ref('table')
const editingTask = ref<Task | null>(null)

// Computed
const title = computed(() => {
  return projects.value.find((p) => p.id === route.params.id)
})

// Methods
function addTask() {
  editingTask.value = null
  visible.value = true
}

function closeModal() {
  visible.value = false
  editingTask.value = null
}

async function saveTask(data: FormT) {
  let message = ''

  try {
    if (editingTask.value) {
      await editTask(String(editingTask.value.id), {
        ...editingTask.value,
        ...data,
        projectId: data.projectName?.id,
      })
      message = 'Завдання оновлено'
    } else {
      const task = { ...data, projectId: data.projectName?.id } as Task

      await createTask(task)
      await updateQuantityTaskInProject(task.projectId)
      message = 'Завдання створено'
    }

    await fetchTasks(id)
    closeModal()

    showToast({
      severity: 'success',
      summary: 'Успішно',
      detail: message,
    })
  } catch (error) {
    console.error(error)
  }
}

async function updateQuantityTaskInProject(projectId: number | string) {
  const quantity = tasks.value?.length ? tasks.value?.length : 0

  await updateProject(projectId, quantity)
}

function viewTask(view: string) {
  tabs.value = view
}

async function edit(item: BaseTableData) {
  const task = item as Task

  editingTask.value = task
  visible.value = true
}

async function remove(item: BaseTableData) {
  await deleteTask(String(item.id))
  await fetchTasks(id)

  showToast({
    severity: 'error',
    summary: 'Успішно',
    detail: 'Завдання видалено',
  })
}

// lifecicle hooks
onMounted(async () => {
  if (projects.value.length === 0) await fetchProjects()
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

  .title {
    display: flex;
    justify-content: center;
    color: #4b4c4e;
  }
}
</style>
