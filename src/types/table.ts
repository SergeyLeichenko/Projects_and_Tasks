export type ColumnT = {
  id?: number
  field: string
  header: string
  sort?: boolean
  width?: string
  search?: boolean
}

export type FilterT = {
  name: string
  status: null
}

export type Status = {
  label: string
  value: string
}