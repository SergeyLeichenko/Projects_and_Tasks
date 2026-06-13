import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/home.vue'
import Projects from '../pages/projects.vue'
import ProjectDetail from '../pages/projectDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home },
    { path: '/projects', name: 'rpojects', component: Projects },
    { path: '/project/:id', name: 'projectDetail', component: ProjectDetail },
  ],
})

export default router
