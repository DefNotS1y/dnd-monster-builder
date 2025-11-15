import { createRouter, createWebHistory } from 'vue-router'
import MonsterListView from '../views/MonsterListView.vue'
import MonsterBuilderView from '../views/MonsterBuilderView.vue'
import MonsterDetail from '../components/MonsterDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/monsters'  // Redirect home to monster list
    },
    {
      path: '/monsters',
      name: 'monsters',
      component: MonsterListView
    },
    {
      path: '/monster/:id',
      name: 'monster-detail',
      component: MonsterDetail
    },
    {
      path: '/builder',
      name: 'builder',
      component: MonsterBuilderView
    }
  ]
})

export default router
