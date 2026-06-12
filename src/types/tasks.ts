export type Task = {
  id?: number | string
  name: string
  projectId: number | string
  status: 'todo' | 'in_progress' | 'done' | null
  deadline?: string
  performer?: Performer | null
  tableName?: string
}

export type Performer = {
  label: string
  value: string
  id?: string
}

export type FormT = {
  id?: string | number
  name: string
  projectName: Performer | null
  performer?: Performer | null
  status: Performer | null
  deadline: string
  projectId?: string
}

export type Tasks = Task[]