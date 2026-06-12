import type { Ref } from 'vue'
import type { RowReorderEvent } from '@/types/table'

export function useTableReorder<T>(tableData: Ref<T[]>, applyFilters: () => void) {
  const onRowReorder = (event: RowReorderEvent<T>) => {
    tableData.value = event.value
    applyFilters()
  }

  return {
    onRowReorder,
  }
}
