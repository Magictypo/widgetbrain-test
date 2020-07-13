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
import axios from 'axios';
import _ from 'lodash';
import chartOptions from '@/services/ChartOptions';

export default {
  name: 'TorqueProfile',
  data() {
    return {
      OpenChartOptions: chartOptions(),
      CloseChartOptions: chartOptions(),
    };
  },
  components: {
    highcharts: Chart,
  },
  async mounted() {
    // limit and destroy for better performace
    const res = await axios.get('https://b507qiqddb.execute-api.eu-central-1.amazonaws.com/torque');
    if (res) {
      const AverageSeriesOpen = _.find(this.OpenChartOptions.series, { name: 'Average' });
      const LastSeriesOpen = _.find(this.OpenChartOptions.series, { name: 'Last' });

      // eslint-disable-next-line no-plusplus
      for (let position = 1; position <= 100; position++) {
        // Todo: update series at once for better peformace, *reactive

        const OpenPositionArray = _.filter(res.data, {
          Direction: 'Open',
          Position: position,
        });
        const LastPositionArray = OpenPositionArray[OpenPositionArray.length - 1];

        AverageSeriesOpen.data.push(
          LastPositionArray ? LastPositionArray.AverageTorque : 0,
        );
        LastSeriesOpen.data.push(
          LastPositionArray ? LastPositionArray.LastTorque : 0,
        );
      }

      this.CloseChartOptions.series[0].data = _.filter(res.data, { Direction: 'Close' })
        .map(this.mapperData);
    }
  },
};
</script>

<style scoped>

</style>
