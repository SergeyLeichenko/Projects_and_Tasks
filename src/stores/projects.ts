import { defineStore } from 'pinia'
import type { Project } from '@/types/projects'
import api from '@/api/axios'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[],
  }),

  actions: {
    async fetchProjects() {
      const { data } = await api.get('/projects')
      this.projects = data
    },

    async createProject(payload: Project) {
      const obj = {
        name: payload.name,
        description: payload.description,
        status: payload.status ?? 'active',
        quantity: 0,
        createdAt: new Date().toISOString(),
        tableName: 'projectTable',
      }

      await api.post('/projects', obj)
    },

    async updateProject(projectId: number | string, quantity: number | string) {
      const project = this.projects.find((p) => p.id === projectId)

      if (!project) return

      await api.put(`/projects/${projectId}`, {
        ...project,
        quantity,
      })
    },

    async editProject(id: string, project: Project) {
      await api.put(`/projects/${id}`, project)
    },

    async deleteProject(id: number | string) {
      await api.delete(`/projects/${id}`)
    },
  },
})
