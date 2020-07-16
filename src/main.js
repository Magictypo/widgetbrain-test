import GlobalConfig from '@/config';
import Vue from 'vue';
import 'bootstrap';
import 'popper.js';
import axios from 'axios';

import './mock';

import App from './App.vue';
import router from './router';

import './assets/scss/main.scss';

Vue.config.productionTip = false;
axios.defaults.baseURL = GlobalConfig.API_URL;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
