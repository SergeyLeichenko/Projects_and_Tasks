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
        status: 'todo',
        quantity: 0,
        createdAt: new Date().toISOString(),
      }

      await api.post('/projects', obj)
    },

    async updateProject(projectId: number | string, quantity: number) {
      await api.patch(`/projects/${projectId}`, {
        quantity: quantity,
      })
    },
  },
})
