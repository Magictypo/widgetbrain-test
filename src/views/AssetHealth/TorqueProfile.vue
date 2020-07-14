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
    getSeriesContainer(chart, name) {
      return _.find(chart, { name });
    },
    getLastArray(array) {
      return array[array.length - 1];
    },
    getArrayByPosistionAndDirection(data, position, direction) {
      return _.filter(data, {
        Direction: direction,
        Position: position,
      });
    },
    getForecastValue(Average, Last) {
      return (Average + Last) / 2;
    },
    getDataForSeries(data, direction) {
      const OnetoNPump = Array.from(Array(NUMBER_OF_PUMP), (x, i) => i + 1);
      const AverageArray = [];
      const LastArray = [];
      const ForecastArray = [];

      OnetoNPump.forEach((position) => {
        const ArrayByPositionAndDirection = this.getArrayByPosistionAndDirection(
          data,
          position, direction,
        );
        const lastObj = this.getLastArray(ArrayByPositionAndDirection);
        if (lastObj) {
          const Average = lastObj[AVERAGE_TORQUE];
          const Last = lastObj[LAST_TORQUE];
          AverageArray.push(Average);
          LastArray.push(Last);
          ForecastArray.push(this.getForecastValue(Average, Last));
        }
      });
      return {
        [AVERAGE_TORQUE]: AverageArray,
        [LAST_TORQUE]: LastArray,
        [FORECAST_TORQUE]: ForecastArray,
      };
    },
    populateSeriesByName(container, name, data) {
      const containerSeries = this.getSeriesContainer(container, name);
      console.log('containerSeries', containerSeries);
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
    },
    async getData() {
      try {
        return await TorqueSvc.getData();
      } catch (e) {
        return ErrorSvc.getError(e);
      }
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
    // Todo: init next tick
    this.isLoading = false;
  },
};
</script>

<style scoped>

.text-muted.active {
  border-bottom: 4px solid #777777;
}

</style>
