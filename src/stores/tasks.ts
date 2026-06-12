import { defineStore } from 'pinia'
import type { Task, FormT } from '@/types/tasks'
import api from '@/api/axios'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
  }),

  actions: {
    async allTasks() {
      const { data } = await api.get('tasks')
      this.tasks = data
    },

    async fetchTasks(projectId: number | string) {
      try {
        const { data } = await api.get('/tasks')

        this.tasks = projectId
          ? data.filter((task: Task) => String(task.projectId) === String(projectId))
          : data
      } catch (error) {
        console.error(error)

        this.tasks = []
      }
    },

    async createTask(task: Task) {
      await api.post(`/tasks`, { ...task, tableName: 'taskTable' })
    },

    async updateTask(task: Task) {
      const t = this.tasks.find((p) => p.id === task.id)

      if (!t) return

      await api.put(`/tasks/${task.id}`, {
        ...t,
        status: task.status,
      })
    },

    async editTask(id: string, task: FormT) {
      await api.put(`/tasks/${id}`, task)
    },

    async deleteTask(id: number | string) {
      await api.delete(`/tasks/${id}`)
    },
  },
})
