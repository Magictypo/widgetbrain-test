import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/components/Site/Layout.vue';
import List from '@/components/AssetsHealth/List.vue';
import Detail from '@/components/AssetsHealth/Detail.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Layout,
    name: 'root',
    // Redirect to torque-profile, because no other page
    redirect: { name: 'assets-detail' },
    children: [
      {
        path: 'assets',
        component: List,
        // Redirect because the page are empty
        redirect: { name: 'assets-detail' },
      },
      {
        // Static Path to Simulate the id
        // path: ':id',
        path: 'assets/1-1',
        component: Detail,
        name: 'assets-detail',
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
