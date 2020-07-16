import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import('@/components/Site/Layout.vue'),
    name: 'root',
    redirect: { name: 'torque-profile' },
    children: [
      {
        path: 'asset-health',
        name: 'asset-health',
        component: () => import('@/components/AssetsHealth/AssetsHealth.vue'),
        children: [
          {
            path: 'overview',
            component: () => import('@/components/AssetsHealth/AssetOverview/AssetOverview.vue'),
            name: 'overview',
            children: [
              {
                path: 'torque-profile',
                name: 'torque-profile',
                component: () => import('@/components/AssetsHealth/AssetOverview/TorqueProfile.vue'),
              },
            ],
          },
        ],
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
