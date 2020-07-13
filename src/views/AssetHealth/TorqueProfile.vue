<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-2">
        <h2>sidebar goes here</h2>
        <ul>
          <li>Menu 1</li>
          <li>Menu 2</li>
          <li>Menu 3</li>
          <li>Menu 4</li>
          <li>Menu 5</li>
        </ul>
      </div>
      <div class="col-10">

        <div class="row">
          <div class="col-12">
            <h1>Torque Page Goes here</h1>
            <hr>

            <h2>Open Chart</h2>
            <highcharts :options="OpenChartOptions"></highcharts>

            <hr>

            <h2>Close Chart</h2>
            <highcharts :options="CloseChartOptions"></highcharts>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import _ from 'lodash';
import chartOptions from '@/services/ChartOptions';
import TorqueSvc from '@/services/Api/Assets/TorqueSvc';
import ErrorSvc from '@/services/ErrorSvc';

export default {
  name: 'TorqueProfile',
  data() {
    return {
      isLoading: false,
      OpenChartOptions: chartOptions(),
      CloseChartOptions: chartOptions(),
    };
  },
  components: {
    highcharts: Chart,
  },
  methods: {
    async getData() {
      try {
        const res = await TorqueSvc.getData();
        if (res) {
          const AverageSeriesOpen = _.find(this.OpenChartOptions.series, { name: 'Average' });
          const LastSeriesOpen = _.find(this.OpenChartOptions.series, { name: 'Last' });

          const AverageArray = [];
          const LastArray = [];

          // eslint-disable-next-line no-plusplus
          for (let position = 1; position <= 100; position++) {
            const OpenPositionArray = _.filter(res.data, {
              Direction: 'Open',
              Position: position,
            });
            const LastPositionArray = OpenPositionArray[OpenPositionArray.length - 1];

            if (LastPositionArray) {
              AverageArray.push(LastPositionArray.AverageTorque);
              LastArray.push(LastPositionArray.LastTorque);
            } else {
              AverageArray.push(0);
              LastArray.push(0);
            }
          }

          AverageSeriesOpen.data = AverageArray;
          LastSeriesOpen.data = LastArray;
        }
      } catch (e) {
        ErrorSvc.getError(e);
      }
    },
  },
  async mounted() {
    this.isLoading = true;
    await this.getData();
    // Todo: ini siate next tick
    this.isLoading = false;
  },
};
</script>

<style scoped>

</style>
