import type { StatusType } from "./table";

export type Project = {
  id?: number | string
  name: string
  status?: StatusType | null
  quantity?: number
  description?: string
  createdAt?: string
  tableName?: string
}

export type CreateProject = {
  name: string
  status?: StatusType | null
  description: string
}

export type Projects = Project[]