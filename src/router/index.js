import Vue from 'vue';
import VueRouter from 'vue-router';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import AssetLayout from '@/components/layout/AssetLayout.vue';
import TorqueProfile from '@/views/AssetHealth/TorqueProfile.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: { name: 'torque-profile' },
  },
  {
    path: '/asset-health',
    component: AssetLayout,
    children: [
      {
        path: '',
        name: 'asset-health',
        redirect: { name: 'torque-profile' },
      },
      {
        path: 'torque-profile',
        name: 'torque-profile',
        component: TorqueProfile,
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  linkExactActiveClass: 'nav-item active',
  routes,
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  next();
});

export default router;
