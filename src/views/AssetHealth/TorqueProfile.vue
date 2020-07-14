<template>
  <div class="row">
    <div class="col-12">
      <hr style="margin: 0 -20px;">

      <i v-if="isLoading" class="fa fa-spinner fa-2x fa-spin mt-3"></i>

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
import store from '@/store/assetHealth/index';

let nTick = 0;

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
    simulateNextTick() {
      // For Interactive Esthetic Only, don't judge this code
      setTimeout(() => {
        if (nTick > 100) return;
        nTick += 1;

        const newAverage = this.OpenChartOptions.series[0].data.map((o) => o);
        const newLast = this.OpenChartOptions.series[1].data.map((o) => o);
        const newForecast = this.OpenChartOptions.series[2].data.map((o) => o);

        const OnetoNPump = Array.from(Array(100), (x, i) => i + 1);
        OnetoNPump.forEach((position) => {
          newAverage[position - 1] += Math.random() < 0.5 ? -0.05 : 0.05;
          newLast[position - 1] += Math.random() < 0.5 ? -0.05 : 0.05;
          newForecast[position - 1] += Math.random() < 0.5 ? -0.05 : 0.05;
        });

        store.commit('populateSeriesByName', {
          chart: this.OpenChartOptions,
          data: newAverage,
          name: 'AverageTorque',
        });

        store.commit('populateSeriesByName', {
          chart: this.OpenChartOptions,
          data: newLast,
          name: 'LastTorque',
        });

        store.commit('populateSeriesByName', {
          chart: this.OpenChartOptions,
          data: newForecast,
          name: 'ForecastTorque',
        });

        this.OpenChartOptions.series[0].data = newAverage;
        this.OpenChartOptions.series[1].data = newLast;
        this.OpenChartOptions.series[2].data = newForecast;
        this.simulateNextTick();
      }, 1000);
    },
  },
  async mounted() {
    this.isLoading = true;
    await store.dispatch('getData');
    this.simulateNextTick();
    this.isLoading = false;
  },
  computed: {
    OpenChartOptions() {
      return store.getters.getOpenChartOptions;
    },
    CloseChartOptions() {
      return store.getters.getCloseChartOptions;
    },
  },
};
</script>

<style scoped>

.text-muted.active {
  border-bottom: 4px solid #777777;
}

</style>
