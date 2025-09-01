import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'MonsterList',
    component: () => import('../views/MonsterListView.vue')
  },
  {
    path: '/monster/:index',
    name: 'MonsterDetail',
    component: () => import('../views/MonsterDetailView.vue'),
    props: true
  },
  {
    path: '/builder',
    name: 'MonsterBuilder',
    component: () => import('../views/MonsterBuilderView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router