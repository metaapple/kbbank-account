import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/memo' },
    // 문제 1.	라우터 테이블을 완성하세요.
  ],
});

export default router;
