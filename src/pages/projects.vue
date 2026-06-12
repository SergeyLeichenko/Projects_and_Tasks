<template>
  <div class="projects">
    <div class="projects__filters">
      <Button
        label="Add Project"
        icon="pi pi-plus"
        severity="info"
        rounded
        size="small"
        @click="addProject"
      />
    </div>

    <div class="projects__table">
      <Table :data="projects" :title="'Projects'" :column="columns" @edit="edit" @delete="remove" />
    </div>

    <ModalWrapper
      v-model:visible="visible"
      :title="editingProject ? 'Редагувати проект' : 'Створити проект'"
    >
      <AddProjectModal :project="editingProject" @create="saveProject" @close="closeModal" />
    </ModalWrapper>
  </div>
</template>

<script setup lang="ts">
import Table from '@/components/Table.vue'
import ModalWrapper from '@/components/ModalWrapper.vue'
import AddProjectModal from '@/components/project/AddProjectModal.vue'

import Button from 'primevue/button'

import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from "@/stores/tasks"
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'

// Types
import type { ColumnT, BaseTableData } from '@/types/table'
import type { Project } from '@/types/projects'

const { fetchProjects, createProject, editProject, deleteProject } = useProjectsStore()
const { allTasks } = useTasksStore()
const { projects } = storeToRefs(useProjectsStore())

// Data
const columns = ref<ColumnT[]>([
  { field: 'id', header: 'ID проекту', sort: true, width: '50px' },
  { field: 'name', header: 'Назва проекту', sort: false, search: true },
  { field: 'quantity', header: 'Кількість завдань', sort: true },
  { field: 'status', header: 'Статус', sort: false },
  { field: 'createdAt', header: 'Дата створення', sort: true },
  { field: 'action', header: 'Дії', sort: false },
])
const visible = ref<boolean>(false)
const editingProject = ref<Project | null>(null)

// Methods
function addProject() {
  editingProject.value = null
  visible.value = true
}

function closeModal() {
  visible.value = false
  editingProject.value = null
}

async function edit(item: BaseTableData) {
  const project = item as Project

  editingProject.value = project
  visible.value = true
}

async function remove(item: BaseTableData) {
  await deleteProject(String(item.id))
  await fetchProjects()
  await allTasks()
}

async function saveProject(data: { name: string; description: string }) {
  try {
    if (editingProject.value) {
      await editProject(String(editingProject.value.id), { ...editingProject.value, ...data })
    } else {
      await createProject(data)
    }

    await fetchProjects()
    closeModal()
  } catch (error) {
    console.error(error)
  }
}

// lifecicle hooks
onMounted(async () => {
  await fetchProjects()
  await allTasks()
})
</script>

<style scoped lang="scss">
.projects {
  &__filters {
    display: flex;
    justify-content: end;
    margin: 30px 0;
  }
}
</style>
