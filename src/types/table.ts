export type ColumnT = {
  id?: number
  field: string
  header: string
  sort?: boolean
  width?: string
  search?: boolean
}

export type FilterableItem = {
  name: string
  status?: string | null
}

export interface BaseTableData {
  id?: number | string
  name: string
  status?: StatusType | null
  tableName?: string
}

export type FilterT = {
  name: string
  status: null
}

export type Status = {
  label: string
  value: string
}

export type RowReorderEvent<T> = {
  value: T[]
  dragIndex: number
  dropIndex: number
}

export type StatusType = 'todo' | 'in_progress' | 'done' | 'active' | 'archived'
