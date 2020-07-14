import Vue from 'vue';
import Vuex from 'vuex';
import chartOptions from '@/services/ChartOptions';
import _ from 'lodash';
import TorqueSvc from '@/services/Api/Assets/TorqueSvc';
import ErrorSvc from '@/services/ErrorSvc';

Vue.use(Vuex);

const NUMBER_OF_PUMP = 100;
const DIRECTION_OPEN = 'Open';
const DIRECTION_CLOSE = 'Close';
const AVERAGE_TORQUE = 'AverageTorque';
const LAST_TORQUE = 'LastTorque';
const FORECAST_TORQUE = 'ForecastTorque';
const DISPLAY_SERIES = [AVERAGE_TORQUE, LAST_TORQUE, FORECAST_TORQUE];

function getForecastValue(Average, Last) {
  // FORECAST Formula
  return (Average + Last) / 2;
}

function getValueOfAttr(obj, attrName) {
  if (!obj) return 0;
  if (attrName !== FORECAST_TORQUE) {
    return obj[attrName];
  }
  return getForecastValue(obj[AVERAGE_TORQUE], obj[LAST_TORQUE]);
}

export default new Vuex.Store({
  state: {
    data: [],
    OpenChartOptions: chartOptions(DISPLAY_SERIES),
    CloseChartOptions: chartOptions(DISPLAY_SERIES),
  },
  getters: {
    getOpenChartOptions(state) {
      return state.OpenChartOptions;
    },
    getCloseChartOptions(state) {
      return state.CloseChartOptions;
    },
    getDataForSeries: (state) => (direction) => {
      const oneToNPump = Array.from(Array(NUMBER_OF_PUMP), (x, i) => i + 1);
      const result = {};
      DISPLAY_SERIES.forEach((name) => {
        result[name] = [];
      });
      oneToNPump.forEach((position) => {
        const lastObj = _.findLast(state.data, {
          Direction: direction,
          Position: position,
        });
        DISPLAY_SERIES.forEach((name) => {
          result[name].push(getValueOfAttr(lastObj, name));
        });
      });
      return result;
    },
  },
  mutations: {
    setData(state, payload) {
      state.data = payload.data;
    },
    populateSeriesByName(state, payload) {
      const containerSeries = _.find(payload.chart.series, { name: payload.name });
      containerSeries.data = payload.data[payload.name];
    },
  },
  actions: {
    populateChart({ commit, getters }, payload) {
      const ChartSeries = payload.chart;
      const SeriesData = getters.getDataForSeries(payload.direction);
      DISPLAY_SERIES.forEach((series) => {
        commit('populateSeriesByName', {
          chart: ChartSeries,
          name: series,
          data: SeriesData,
        });
      });
    },
    populateAllCharts({ getters, dispatch }) {
      dispatch('populateChart', {
        chart: getters.getOpenChartOptions,
        direction: DIRECTION_OPEN,
      });
      dispatch('populateChart', {
        chart: getters.getCloseChartOptions,
        direction: DIRECTION_CLOSE,
      });
    },
    async getData({ commit, dispatch }) {
      try {
        const res = await TorqueSvc.getData();
        commit('setData', { data: res.data });
        dispatch('populateAllCharts');
      } catch (e) {
        ErrorSvc.getErrors(e);
      }
    },
  },
});
