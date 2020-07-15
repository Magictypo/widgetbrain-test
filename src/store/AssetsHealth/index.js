import Vue from 'vue';
import Vuex from 'vuex';
import ChartSvc from '@/services/ChartSvc';
import _ from 'lodash';
import TorqueSvc from '@/services/AssetsHealth/TorqueSvc';
import ErrorSvc from '@/services/ErrorSvc';

Vue.use(Vuex);

const NUMBER_OF_PUMP = 100;
const DIRECTION_OPEN = 'Open';
const DIRECTION_CLOSE = 'Close';
const DIRECTION_TO_DISPLAY = [DIRECTION_OPEN, DIRECTION_CLOSE];
const AVERAGE_TORQUE = 'AverageTorque';
const LAST_TORQUE = 'LastTorque';
const FORECAST_TORQUE = 'ForecastTorque';
const SERIES_TO_DISPLAY = [AVERAGE_TORQUE, LAST_TORQUE, FORECAST_TORQUE];

function getForecastValue(Average, Last) {
  // FORECAST Formula
  return (Average + Last) / 2;
}

function getAttrValue(obj, attrName) {
  if (!obj) return 0;
  if (attrName !== FORECAST_TORQUE) {
    return obj[attrName];
  }
  return getForecastValue(obj[AVERAGE_TORQUE], obj[LAST_TORQUE]);
}

function SeriesMember(name) {
  this.name = name;
  this.data = [];
}

function Series(seriesNames) {
  this.collection = [];
  seriesNames.forEach((name) => {
    this.collection.push(new SeriesMember(name));
  });
}

function findLastByDirectionAndPosition(data, direction, i) {
  return _.findLast(data, {
    Direction: direction,
    Position: i,
  });
}

function getDataWIPNormalize(data, direction) {
  const seriesContainer = new Series(SERIES_TO_DISPLAY);

  for (let position = 0; position < NUMBER_OF_PUMP; position += 1) {
    const lastObj = findLastByDirectionAndPosition(data, direction, position);

    SERIES_TO_DISPLAY.forEach((name) => {
      const series = seriesContainer.collection.find((o) => o.name === name);
      series.data.push(getAttrValue(lastObj, name));
    });
  }

  return seriesContainer;
}

export default new Vuex.Store({
  state: {

    data: [],

    Charts: [
      {
        direction: 'Open',
        options: ChartSvc.createChartOptions(SERIES_TO_DISPLAY),
      },
      {
        direction: 'Close',
        options: ChartSvc.createChartOptions(SERIES_TO_DISPLAY),
      },
    ],

  },
  getters: {

    getChartOptionsByDirection: (state) => (direction) => {
      const chart = state.Charts.find((o) => o.direction === direction);
      return chart.options;
    },

    getDataByDirection: (state) => (direction) => {
      const { data } = state;
      return getDataWIPNormalize(data, direction);
    },

  },
  mutations: {

    setData(state, payload) {
      state.data = payload.data;
    },

    populateSeriesByName(state, payload) {
      const containerSeries = _.find(payload.chart.series, { name: payload.name });
      containerSeries.data = payload.data;
    },

    updateSeriesByDirection(state, { direction, series }) {
      const chart = state.Charts.find((o) => o.direction === direction);
      chart.options.series = series.collection;
    },

  },
  actions: {

    populateAllCharts({ getters, commit }) {
      DIRECTION_TO_DISPLAY.forEach((direction) => {
        const series = getters.getDataByDirection(direction);
        commit('updateSeriesByDirection', { direction, series });
      });
    },

    async getData({ commit, dispatch }) {
      try {
        const res = await TorqueSvc.getData();
        commit('setData', { data: res.data });
        dispatch('populateAllCharts');
      } catch (e) {
        ErrorSvc.getError(e);
      }
    },

    doNextTick({ getters, commit }) {
      const OnetoNPump = Array.from(Array(100), (x, i) => i + 1);

      const chartOpen = getters.getOpenChartOptions;
      const chartClose = getters.getCloseChartOptions;
      const seriesOpen = chartOpen.series;
      const seriesClose = chartClose.series;
      const dSeriesOpen = {};
      const dSeriesClose = {};

      SERIES_TO_DISPLAY.forEach((name) => {
        const so = _.find(seriesOpen, { name });
        dSeriesOpen[name] = so.data.map((o) => o);
        const sc = _.find(seriesClose, { name });
        dSeriesClose[name] = sc.data.map((o) => o);
      });

      // Simulate Data Movement
      SERIES_TO_DISPLAY.forEach((name) => {
        OnetoNPump.forEach((position) => {
          dSeriesOpen[name][position] += Math.random() < 0.5 ? -0.05 : 0.05;
          dSeriesClose[name][position] += Math.random() < 0.5 ? -0.05 : 0.05;
        });
      });

      // Populate with simulated data
      SERIES_TO_DISPLAY.forEach((name) => {
        commit('populateSeriesByName', {
          chart: chartOpen,
          data: dSeriesOpen[name],
          name,
        });
        commit('populateSeriesByName', {
          chart: chartClose,
          data: dSeriesClose[name],
          name,
        });
      });
    },
  },

});
