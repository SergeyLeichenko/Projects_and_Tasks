import { computed, ref, watch } from 'vue'
import type { FilterT, FilterableItem } from '@/types/table'

export function useTableFilters<T extends FilterableItem>(getData: () => T[]) {
  const filters = ref<FilterT>({
    name: '',
    status: null,
  })

  const tableData = ref<T[]>([])
  const displayedData = ref<T[]>([])

  const applyFilters = () => {
    displayedData.value = tableData.value.filter((item) => {
      const search = filters.value.name?.trim().toLowerCase()

      const nameMatch = !search || item.name.toLowerCase().includes(search)

      const statusMatch = !filters.value.status || item.status === filters.value.status

      return nameMatch && statusMatch
    })
  }

  watch(
    getData,
    (val) => {
      tableData.value = [...val]
    },
    { immediate: true },
  )

  watch([tableData, filters], applyFilters, {
    deep: true,
    immediate: true,
  })

  const isFilterActive = computed(() => {
    return !!filters.value.name?.trim() || !!filters.value.status
  })

  return {
    filters,
    tableData,
    displayedData,
    isFilterActive,
    applyFilters,
  }
}
