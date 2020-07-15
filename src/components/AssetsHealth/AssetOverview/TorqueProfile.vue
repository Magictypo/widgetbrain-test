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
import store from '@/store/assetHealth';

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
      setTimeout(() => {
        if (nTick > 100) return; // limit simulateTick to 100 tick
        nTick += 1;
        store.dispatch('doNextTick');
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
