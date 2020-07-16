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

function SeriesContainer(seriesNames) {
  this.collection = [];
  seriesNames.forEach((name) => {
    this.collection.push(new SeriesMember(name));
  });

  this.getSeries = () => this.collection;
}

function findLastByDirectionAndPosition(data, direction, i) {
  return _.findLast(data, {
    Direction: direction,
    Position: i,
  });
}

function normalizeDataByDirection(data, direction) {
  const seriesContainer = new SeriesContainer(SERIES_TO_DISPLAY);

  for (let position = 0; position < NUMBER_OF_PUMP; position += 1) {
    const lastObj = findLastByDirectionAndPosition(data, direction, position);

    SERIES_TO_DISPLAY.forEach((name) => {
      const series = seriesContainer.collection.find((o) => o.name === name);
      series.data.push(getAttrValue(lastObj, name));
    });
  }
  return seriesContainer.getSeries();
}

function randomMovement(num) {
  const newNumber = num + Math.random() < 0.5 ? -0.05 : 0.05;
  return newNumber;
}

function updateDataWithRandomMovement(o) {
  o.data.forEach(randomMovement);
}

function getSeriesWithRandomMovement(series) {
  const seriesCopy = { ...series };
  seriesCopy.forEach(updateDataWithRandomMovement);
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
      return normalizeDataByDirection(data, direction);
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
      chart.options.series = series;
    },

  },
  actions: {

    updateCharts({ getters, commit }) {
      DIRECTION_TO_DISPLAY.forEach((direction) => {
        const data = getters.getDataByDirection(direction);
        commit('updateSeriesByDirection', { direction, series: data.collection });
      });
    },

    async getData({ commit, dispatch }) {
      try {
        const response = await TorqueSvc.getData();
        commit('setData', { data: response.data });
        dispatch('updateCharts');
      } catch (e) {
        ErrorSvc.getError(e);
      }
    },

    doNextTickSimulation({ getters, commit }) {
      DIRECTION_TO_DISPLAY.forEach((direction) => {
        const chart = getters.getDataByDirection(direction);
        const { series } = chart;
        const seriesCopy = getSeriesWithRandomMovement(series);
        commit('updateSeriesByDirection', { direction, series: seriesCopy });
      });
    },
  },

});
