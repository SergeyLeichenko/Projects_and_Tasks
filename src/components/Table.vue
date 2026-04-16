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
              placeholder="Search"
            />

            <!-- status -->
            <Dropdown
              v-if="col.field === 'status'"
              v-model="filters.status"
              :options="statuses"
              optionLabel="label"
              optionValue="value"
              placeholder="Status"
              showClear
            />
          </div>
        </template>

        <template v-if="col.field === 'createdAt'" #body="{ data }">
          {{ formatDate(data.createdAt) }}
        </template>

        <template v-if="col.field === 'status'" #body="{ data }">
          <Tag :value="data.status" :severity="getSeverity(data.status)" />
        </template>
      </Column>

      <template #footer> Total: {{ data.length }} </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed  } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import { useRouter } from 'vue-router'

// Types
import type { ColumnT, FilterT, Status } from '@/types/table'

const router = useRouter()

// Props
const props = defineProps<{
  data: Array<Record<string, unknown>>
  title: string
  column: ColumnT[]
}>()

// Data
const selected = ref<ColumnT>()
const statuses = ref<Status[]>([
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
])
const filters = ref<FilterT>({
  name: '',
  status: null,
})

// Local state
const tableData = ref<any[]>([])
const displayedData = ref<any[]>([])

// Watchers
watch(
  () => props.data,
  (val) => {
    tableData.value = [...val]
  },
  { immediate: true }
)

watch([tableData, filters], applyFilters, { deep: true, immediate: true })

// Computed
const isFilterActive = computed(() => {
  return !!filters.value.name?.trim() || !!filters.value.status
})

// Methods
function applyFilters() {
  displayedData.value = tableData.value.filter((item) => {
    const search = filters.value.name?.trim().toLowerCase()

    const nameMatch =
      !search ||
      String(item.name).toLowerCase().includes(search)

    const statusMatch =
      !filters.value.status || item.status === filters.value.status

    return nameMatch && statusMatch
  })
}

const getSeverity = (status: string) => {
  switch (status) {
    case 'done':
      return 'success'
    case 'in_progress':
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

const onRowReorder = (event: any) => {
  tableData.value = event.value
  applyFilters()
}

//Lifecicle hooks
onMounted(async () => {})
</script>

<style scoped lang="scss">
.filter-field > .p-component {
  margin-right: 10px;
}
</style>
