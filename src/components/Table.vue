<template>
  <div class="card">
    <DataTable
      v-model:selection="selected"
      selectionMode="single"
      dataKey="id"
      :value="displayedData"
      tableStyle="min-width: 50rem"
      resizableColumns
      columnResizeMode="fit"
      showGridlines
      filterDisplay="row"
      :reorderableRows="!isFilterActive"
      @rowReorder="onRowReorder"
      @rowClick="onRowClick"
    >
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-xl font-bold">{{ title }}</h2>
        </div>
      </template>

      <Column v-if="!isFilterActive" rowReorder style="width: 3rem" />

      <Column
        v-for="col in column"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :sortable="col.sort"
        :style="{ width: col.width || '100px', minWidth: '120px' }"
        :filter="col.field === 'name' || col.field === 'status'"
      >
        <!-- FILTERS -->
        <template #header>
          <div class="filter-field">
            <!-- name -->
            <InputText
              v-if="col.field === 'name' && col.search"
              v-model="filters.name"
              placeholder="Пошук"
            />

            <!-- status -->
            <Dropdown
              v-if="col.field === 'status'"
              v-model="filters.status"
              :options="statuses"
              optionLabel="label"
              optionValue="value"
              placeholder="Статус"
              showClear
            />
          </div>
        </template>

        <template v-if="col.field === 'quantity'" #body="{ data }">
          {{ tasksCount(data.id) }}
        </template>

        <template v-if="col.field === 'createdAt'" #body="{ data }">
          {{ formatDate(data.createdAt) }}
        </template>

        <template v-if="col.field === 'status'" #body="{ data }">
          <Tag :value="data.status" :severity="getSeverity(data.status)" />
        </template>

        <template v-if="col.field === 'action'" #body="{ data }">
          <Button icon="pi pi-pencil" severity="info" rounded text @click.stop="editItem(data)" />
          <Button
            icon="pi pi-trash"
            severity="danger"
            rounded
            text
            @click.stop="deleteItem(data)"
          />
        </template>
      </Column>

      <template #footer> Кількість: {{ data.length }} </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import { useRouter, useRoute } from 'vue-router'

import { useTableFilters } from '@/composables/useTableFilters'
import { useTableReorder } from '@/composables/useTableReorder'

import { useTasksStore } from '@/stores/tasks'

// Types
import type { ColumnT, Status, BaseTableData } from '@/types/table'

const router = useRouter()
const route = useRoute()
const tasksStore = useTasksStore()

// Props
const props = defineProps<{
  data: BaseTableData[]
  title: string
  column: ColumnT[]
}>()

// Data
const selected = ref<ColumnT>()
const statusesTask = reactive<Status[]>([
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
])
const statusesProject = reactive<Status[]>([
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' },
])

const { filters, tableData, displayedData, isFilterActive, applyFilters } = useTableFilters(
  () => props.data,
)

const { onRowReorder } = useTableReorder(tableData, applyFilters)

// Computed
const statuses = computed(() => {
  return (props.data.find((t) => t.tableName === 'projectTable') ?? route.fullPath === '/')
    ? statusesProject
    : statusesTask
})

const tasksCount = (projectId: string | number) => {
  return tasksStore.tasks.filter(
    task => task.projectId === projectId
  ).length
}

// Emits
const emit = defineEmits<{
  (e: 'edit', item: BaseTableData): void
  (e: 'delete', item: BaseTableData): void
}>()

// Methods
const getSeverity = (status: string) => {
  switch (status) {
    case 'done':
    case 'active':
      return 'success'
    case 'in_progress':
    case 'archived':
      return 'warn'
    case 'todo':
      return 'info'
    default:
      return undefined
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const onRowClick = (event: any) => {
  router.push({
    name: 'projectDetail',
    params: { id: event.data.id },
  })
}

const editItem = (item: BaseTableData) => {
  emit('edit', item)
}

const deleteItem = (item: BaseTableData) => {
  emit('delete', item)
}
</script>

<style scoped lang="scss">
.filter-field > .p-component {
  margin-right: 10px;
}
</style>
