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
      <Table :data="projects" :title="'Projects'" :column="columns" />
    </div>

    <ModalWrapper v-model:visible="visible" :title="'Add project'">
      <AddProjectModal @create="create" @close="closeModal" />
    </ModalWrapper>
  </div>
</template>

<script setup lang="ts">
import Table from '@/components/Table.vue'
import ModalWrapper from '@/components/ModalWrapper.vue'
import AddProjectModal from '@/components/project/AddProjectModal.vue'

import Button from 'primevue/button'

import { useProjectsStore } from '@/stores/projects'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'

// Types
import type { ColumnT } from '@/types/table'

const { fetchProjects, createProject } = useProjectsStore()
const { projects } = storeToRefs(useProjectsStore())

// Data
const columns = ref<ColumnT[]>([
  { field: 'id', header: 'ID project', sort: true, width: '50px' },
  { field: 'name', header: 'Project name', sort: false, search: true },
  { field: 'quantity', header: 'Quantity tasks', sort: true },
  { field: 'status', header: 'Status', sort: false },
  { field: 'createdAt', header: 'Created', sort: false },
])
const visible = ref<boolean>(false)

// Methods
function addProject() {
  visible.value = true
}

function closeModal() {
  visible.value = false
}

async function create(data: { name: string; description: string }) {
  try {
    await createProject(data)
    await fetchProjects()
    closeModal()
  } catch (error) {
    console.error(error)
  }
}

// lifecicle hooks
onMounted(async () => {
  await fetchProjects()
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
