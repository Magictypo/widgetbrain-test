import Vue from 'vue';
import Vuex from 'vuex';
import ChartSvc from '@/services/ChartSvc';
import TorqueSvc from '@/services/AssetsHealth/TorqueSvc';
import ErrorSvc from '@/services/ErrorSvc';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    Charts: ChartSvc.CreateCharts(),
  },
  getters: {
    getChartOptions: (state) => (name) => {
      const chart = state.Charts.find((o) => o.name === name);
      return chart.options;
    },
  },
  mutations: {
    updateChart(state, { name, data }) {
      const chart = state.Charts.find((o) => o.name === name);
      chart.options.series = data;
    },
  },
  actions: {
    async getData({ commit }) {
      try {
        const response = await TorqueSvc.GetData();
        ChartSvc.GetCharts().forEach((name) => {
          const data = TorqueSvc.NormalizeDataByDirection(response.data, name);
          commit('updateChart', { name, data });
        });
      } catch (e) {
        console.log(e);
        ErrorSvc.getError(e);
      }
    },

    doNextTickSimulation({ getters, commit }) {
      ChartSvc.GetCharts().forEach((name) => {
        const chart = getters.getChartOptions(name);
        const dataOld = chart.series;
        const data = dataOld.map(TorqueSvc.GetDataNextTick);
        commit('updateChart', { name, data });
      });
    },
  },
});
