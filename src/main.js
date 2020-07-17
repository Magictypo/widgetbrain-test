import GlobalConfig from '@/config';
import Vue from 'vue';
import axios from 'axios';
import store from './store/index';
import 'bootstrap';
import 'popper.js';

import './mock';

import App from './components/App.vue';
import router from './router';

import './assets/scss/main.scss';

Vue.config.productionTip = false;
axios.defaults.baseURL = GlobalConfig.API_URL;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
