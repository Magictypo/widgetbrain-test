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
import store from '@/store/AssetsHealth';

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
        store.dispatch('doNextTickSimulation');
        this.startSimulation();
      }, 1000);
    },
  },
  async mounted() {
    this.isLoading = true;
    await store.dispatch('getData');
    this.startSimulation();
    this.isLoading = false;
  },
  computed: {
    OpenChartOptions() {
      return store.getters.getChartOptionsByDirection('Open');
    },
    CloseChartOptions() {
      return store.getters.getChartOptionsByDirection('Close');
    },
  },
};
</script>
