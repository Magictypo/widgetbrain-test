import Vue from 'vue';
import Vuex from 'vuex';

import AssetsHealth from './AssetsHealth/AssetsHealth';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    AssetsHealth,
  },
});
