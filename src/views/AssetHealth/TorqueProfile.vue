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

export default {
  name: 'TorqueProfile',
  data() {
    return {
      OpenChart: {
        data: [],
      },
      CloseChart: {
        data: [],
      },
      OpenChartOptions: {
        chart: {
          type: 'bar',
          height: 500,
        },
        series: [
          {
            name: 'Torque',
            data: this.OpenChart,
          },
        ],
      },
      CloseChartOptions: {
        chart: {
          type: 'bar',
          height: 500,
        },
        series: [
          {
            name: 'Torque',
            data: this.CloseChart,
          },
        ],
      },
    };
  },
  components: {
    highcharts: Chart,
  },
};
</script>

<style scoped>

</style>
