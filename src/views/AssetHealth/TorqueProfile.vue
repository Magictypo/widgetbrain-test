<template>
  <div class="row">
    <div class="col-12">
      <hr style="margin: 0 -20px;">

      <h2 class="mt-3">Open</h2>
      <highcharts :options="OpenChartOptions"></highcharts>

      <hr style="margin: 0 -20px;">

      <h2 class="mt-3">Close</h2>
      <highcharts :options="CloseChartOptions"></highcharts>
    </div>
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import _ from 'lodash';
import chartOptions from '@/services/ChartOptions';
import TorqueSvc from '@/services/Api/Assets/TorqueSvc';
import ErrorSvc from '@/services/ErrorSvc';

const NUMBER_OF_PUMP = 100;
const DIRECTION_OPEN = 'Open';
const DIRECTION_CLOSE = 'Close';
const AVERAGE_TORQUE = 'AverageTorque';
const LAST_TORQUE = 'LastTorque';
const FORECAST_TORQUE = 'ForecastTorque';
const DISPLAY_SERIES = [AVERAGE_TORQUE, LAST_TORQUE, FORECAST_TORQUE];

export default {
  name: 'TorqueProfile',
  data() {
    return {
      isLoading: false,
      OpenChartOptions: chartOptions(DISPLAY_SERIES),
      CloseChartOptions: chartOptions(DISPLAY_SERIES),
    };
  },
  components: {
    highcharts: Chart,
  },
  methods: {
    getSeriesContainer(series, name) {
      return _.find(series, { name });
    },
    getLastByPosistionAndDirection(data, position, direction) {
      return _.findLast(data, {
        Direction: direction,
        Position: position,
      });
    },
    getForecastValue(Average, Last) {
      // FORECAST Formula
      return (Average + Last) / 2;
    },
    getValueOfAttr(obj, attrName) {
      if (!obj) return 0;
      if (attrName !== FORECAST_TORQUE) {
        return obj[attrName];
      }
      return this.getForecastValue(obj[AVERAGE_TORQUE], obj[LAST_TORQUE]);
    },
    getDataForSeries(data, direction) {
      const OnetoNPump = Array.from(Array(NUMBER_OF_PUMP), (x, i) => i + 1);
      const result = {};
      DISPLAY_SERIES.forEach((name) => {
        result[name] = [];
      });
      OnetoNPump.forEach((position) => {
        const lastObj = this.getLastByPosistionAndDirection(data, position, direction);
        DISPLAY_SERIES.forEach((name) => {
          result[name].push(this.getValueOfAttr(lastObj, name));
        });
      });
      return result;
    },
    populateSeriesByName(container, name, data) {
      const containerSeries = this.getSeriesContainer(container, name);
      containerSeries.data = data[name];
      return containerSeries;
    },
    populateChart(data, chart, direction) {
      const ChartSeries = chart.series;
      const SeriesData = this.getDataForSeries(data, direction);
      DISPLAY_SERIES.forEach((series) => {
        this.populateSeriesByName(ChartSeries, series, SeriesData);
      });
    },
    populateAllCharts(data) {
      this.populateChart(data, this.OpenChartOptions, DIRECTION_OPEN);
      this.populateChart(data, this.CloseChartOptions, DIRECTION_CLOSE);
      setTimeout(() => {
        this.simulateNextTick();
      }, 1000);
    },
    async getData() {
      try {
        return await TorqueSvc.getData();
      } catch (e) {
        return ErrorSvc.getError(e);
      }
    },
    simulateNextTick() {
      let nTick = 0;
      setTimeout(() => {
        if (nTick > 10) return;
        nTick += nTick;

        const newAverage = this.OpenChartOptions.series[0].data.map((o) => o);
        const newLast = this.OpenChartOptions.series[1].data.map((o) => o);

        const OnetoNPump = Array.from(Array(NUMBER_OF_PUMP), (x, i) => i + 1);
        OnetoNPump.forEach((position) => {
          newAverage[position - 1] += Math.random() < 0.5 ? -0.05 : 0.05;
          newLast[position - 1] += Math.random() < 0.5 ? -0.05 : 0.05;
        });

        this.OpenChartOptions.series[0].data = newAverage;
        this.OpenChartOptions.series[1].data = newLast;
        this.OpenChartOptions.series[2].data = (newAverage + newLast) / 2;
        this.simulateNextTick();
      }, 1000);
    },
  },
  async mounted() {
    this.isLoading = true;
    try {
      const res = await this.getData();
      this.populateAllCharts(res.data);
    } catch (e) {
      ErrorSvc.getErrors(e);
    }
    this.isLoading = false;
  },
};
</script>

<style scoped>

.text-muted.active {
  border-bottom: 4px solid #777777;
}

</style>
