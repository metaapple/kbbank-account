import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomePage },
    // 문제 1.	라우터 테이블을 완성하세요.
    {
      path: '/memo',
      name: 'memo',
      component: () => import('../pages/MemoListPage.vue'),
    },
    {
      path: '/memo/:id',
      name: 'memo/id',
      component: () => import('../pages/MemoDetailPage.vue'),
    },
    {
      path: '/memo/write',
      name: 'memo/write',
      component: () => import('../pages/MemoWritePage.vue'),
    },
  ],
});

export default router;
