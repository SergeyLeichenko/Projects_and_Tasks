export type Task = {
  id?: number
  name: string
  projectId: number | string
  status: 'todo' | 'in_progress' | 'done' | null
  deadline?: string
  performer: Performer | null
}

export type Performer = {
  label: string
  value: string
}

export type FormT = {
  name: string
  performer: Performer | null
  status: Performer | null
  deadline: string
}

export type Tasks = Task[]