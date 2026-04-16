export type Project = {
  id?: number | string
  name: string
  status?: 'done' | 'in_progress' | 'todo'
  quantity?: number
  description?: string
  createdAt?: string
}

export type Projects = Project[];