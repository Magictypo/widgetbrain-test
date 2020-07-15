import Vue from 'vue';
import VueRouter from 'vue-router';
import SiteLayout from '@/components/Site/Layout.vue';
import AssetOverview from '@/components/AssetsHealth/AssetOverview/AssetOverview.vue';
import TorqueProfile from '@/components/AssetsHealth/AssetOverview/TorqueProfile.vue';
import AssetsHealth from '@/components/AssetsHealth/AssetsHealth.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: SiteLayout,
    name: 'root',
    redirect: { name: 'torque-profile' },
    children: [
      {
        path: 'asset-health',
        name: 'asset-health',
        component: AssetsHealth,
        children: [
          {
            path: 'overview',
            component: AssetOverview,
            name: 'overview',
            children: [
              {
                path: 'torque-profile',
                name: 'torque-profile',
                component: TorqueProfile,
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
