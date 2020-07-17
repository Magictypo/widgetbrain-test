<template>
  <div class="row">
    <div class="col-12">
      <hr style="margin: 0 -20px;">

      <i v-if="isLoading" class="fa fa-spinner fa-2x fa-spin mt-3"></i>

      <h2 class="mt-3">Open</h2>
      <highcharts :options="OpenChart.options"></highcharts>

      <hr style="margin: 0 -20px;">

      <h2 class="mt-3">Close</h2>
      <highcharts :options="CloseChart.options"></highcharts>
    </div>
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import ChartSvc from '@/services/ChartSvc';

let tick = 0;

export default {
  name: 'TorqueProfile',
  data() {
    return {
      isLoading: false,
    };
  },
  components: {
    highcharts: Chart,
  },
  methods: {
    startSimulation() {
      setTimeout(() => {
        if (tick > 100) return; // limit simulateTick to 100 tick
        tick += 1;
        this.$store.dispatch('doNextTickSimulation');
        this.startSimulation();
      }, 1000);
    },
  },
  async mounted() {
    this.isLoading = true;
    await this.$store.dispatch('getData');
    this.startSimulation();
    this.isLoading = false;
  },
  created() {
    const Charts = ChartSvc.CreateCharts([
      {
        name: 'Open',
        xAxis: 'Position',
        filter: { Direction: 'Open' },
        series: [
          {
            name: 'Average Torque',
            y: 'AverageTorque',
          },
          {
            name: 'Last Torque',
            y: 'LastTorque',
          },
          {
            name: 'Forecast Torque',
            y: 'ForecastTorque',
          },
        ],
      },
      {
        name: 'Close',
        xAxis: 'Position',
        filter: { Direction: 'Close' },
        series: [
          {
            name: 'Average Torque',
            y: 'AverageTorque',
          },
          {
            name: 'Last Torque',
            y: 'LastTorque',
          },
          {
            name: 'Forecast Torque',
            y: 'ForecastTorque',
          },
        ],
      },
    ]);
    this.$store.commit('setCharts', { Charts });
  },
  computed: {
    OpenChart() {
      return this.$store.getters.getChartByName('Open');
    },
    CloseChart() {
      return this.$store.getters.getChartByName('Close');
    },
  },
};
</script>
