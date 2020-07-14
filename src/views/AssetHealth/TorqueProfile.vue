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
          const ForeCastSeriesOpen = _.find(this.OpenChartOptions.series, { name: 'Forecast' });

          const AverageSeriesClose = _.find(this.CloseChartOptions.series, { name: 'Average' });
          const LastSeriesClose = _.find(this.CloseChartOptions.series, { name: 'Last' });
          const ForeCastSeriesClose = _.find(this.CloseChartOptions.series, { name: 'Forecast' });

          const AverageArrayOpen = [];
          const LastArrayOpen = [];
          const ForecastArrayOpen = [];
          const AverageArrayClose = [];
          const LastArrayClose = [];
          const ForecastArrayClose = [];

          // eslint-disable-next-line no-plusplus
          for (let position = 1; position <= 100; position++) {
            const PositionArrayOpen = _.filter(res.data, {
              Direction: 'Open',
              Position: position,
            });
            const PositionArrayClose = _.filter(res.data, {
              Direction: 'Close',
              Position: position,
            });
            const LastPositionArrayOpen = PositionArrayOpen[PositionArrayOpen.length - 1];
            const LastPositionArrayClose = PositionArrayClose[PositionArrayClose.length - 1];

            if (LastPositionArrayOpen) {
              AverageArrayOpen.push(LastPositionArrayOpen.AverageTorque);
              LastArrayOpen.push(LastPositionArrayOpen.LastTorque);
              ForecastArrayOpen.push(
                (
                  LastPositionArrayOpen.AverageTorque
                  + LastPositionArrayOpen.LastTorque
                )
                / 2,
              );
            } else {
              AverageArrayOpen.push(0);
              LastArrayOpen.push(0);
              ForecastArrayOpen.push(0);
            }

            if (LastPositionArrayClose) {
              AverageArrayClose.push(LastPositionArrayClose.AverageTorque);
              LastArrayClose.push(LastPositionArrayClose.LastTorque);
              ForecastArrayClose.push(
                (
                  LastPositionArrayClose.AverageTorque
                  + LastPositionArrayClose.LastTorque
                )
                / 2,
              );
            } else {
              AverageArrayClose.push(0);
              LastArrayClose.push(0);
              ForecastArrayClose.push(0);
            }
          }

          AverageSeriesOpen.data = AverageArrayOpen;
          LastSeriesOpen.data = LastArrayOpen;
          ForeCastSeriesOpen.data = ForecastArrayOpen;

          AverageSeriesClose.data = AverageArrayClose;
          LastSeriesClose.data = LastArrayClose;
          ForeCastSeriesClose.data = ForecastArrayClose;
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

.text-muted.active {
  border-bottom: 4px solid #777777;
}

</style>
