import { defineStore } from 'pinia'
import type { Task } from '@/types/tasks'
import api from '@/api/axios'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
  }),

  actions: {
    async fetchTasks(projectId: number | string) {
      const { data } = await api.get(`/tasks?projectId=${projectId}`)
      this.tasks = data
    },

    async createTask(task: Task) {
      await api.post(`/tasks`, task)
    },

    async updateTask(task: Task) {
      await api.patch(`/tasks/${task.id}`, {
        status: task.status,
      })
    },
  },
})
