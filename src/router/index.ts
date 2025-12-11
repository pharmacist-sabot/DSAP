import { createRouter, createWebHistory, RouterView } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { layout: 'default' },
    },
    {
      path: '/assess',
      component: RouterView,
      meta: { layout: 'assessment' },
      children: [
        {
          path: '',
          redirect: '/assess/info',
        },
        {
          path: 'info',
          name: 'hospital-info',
          component: () => import('@/views/assessment/HospitalInfoView.vue'),
        },
        {
          path: 'standard/:id',
          name: 'assessment-standard',
          component: () => import('@/views/assessment/StandardView.vue'),
        },
        {
          path: 'summary',
          name: 'assessment-summary',
          component: () => import('@/views/assessment/SummaryView.vue'),
        },
      ],
    },
  ],
});

export default router;
