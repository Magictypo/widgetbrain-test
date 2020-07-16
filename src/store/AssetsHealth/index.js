import Vue from 'vue';
import Vuex from 'vuex';
import TorqueSvc from '@/services/AssetsHealth/TorqueSvc';
import ErrorSvc from '@/services/ErrorSvc';
import _ from 'lodash';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    Charts: [],
  },
  getters: {
    getCharts(state) {
      return state.Charts;
    },
    getChartByName: (state) => (name) => state.Charts.find((o) => o.name === name),
  },
  mutations: {
    setCharts(state, { Charts }) {
      state.Charts = Charts;
    },
    updateChart(state, { name, data, updateXLabel }) {
      const chart = state.Charts.find((o) => o.name === name);
      chart.options.series = data;

      if (updateXLabel) {
        chart.options.xAxis.categories = updateXLabel;
      }
    },
  },
  actions: {
    async getData({ getters, commit }) {
      try {
        const response = await TorqueSvc.GetData();
        const { data } = response;

        const charts = getters.getCharts;
        charts.forEach((chart) => {
          const filteredData = _.filter(data, chart.filter);
          const uniquePosition = TorqueSvc.GetUniquePosition(filteredData);
          const normalizedData = TorqueSvc.NormalizeData(filteredData, uniquePosition, chart);

          commit('updateChart', { name: chart.name, data: normalizedData, updateXLabel: uniquePosition });
        });
      } catch (e) {
        console.log(e);
        ErrorSvc.getError(e);
      }
    },
    doNextTickSimulation({ getters, commit }) {
      const charts = getters.getCharts;
      charts.forEach((chart) => {
        const chartOptions = chart.options;
        const dataOld = chartOptions.series;
        const data = dataOld.map(TorqueSvc.GetDataNextTick);

        commit('updateChart', { name: chart.name, data });
      });
    },
  },
});
