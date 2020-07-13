<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-2 py-3" style="border-right: 1px solid #ccc;">
        <div class="nav" style="margin: -16px -15px; color: #eeeeee">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <a class="nav-link" href="#">
                <i class="fa fa-arrow-left pl-3 mx-1" aria-hidden="true"></i>
                Terminal Overview
              </a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="#">
                <i class="fa fa-bars mx-3" aria-hidden="true"></i>
              </a>
            </li>
          </ul>
        </div>
        <hr style="margin-left: -15px; margin-right: -15px;" class="mb-0">

        <div class="row">
          <img src="../../assets/img/pump.jpg" width="100%" alt="">
        </div>

        <div class="mt-3">
          <span>Terminal Name</span>
          <h3>West</h3>

          <span>Country Code</span>
          <h3>NLD</h3>

          <span>Address</span>

          <i class="fa fa-map-marker pull-right fa-2x mt-5" aria-hidden="true"></i>

        </div>

      </div>
      <div class="col-10 py-3">

        <div class="card">
          <div class="card-header">
            Asset Overview
            <i class="fa fa-arrow-right mx-1" aria-hidden="true"></i>
            <i class="fa fa-dot-circle-o mx-1" aria-hidden="true"></i>
            Master Station 1-1
            <i class="fa fa-map-marker pull-right" aria-hidden="true"></i>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-12">

                <div class="nav-scroller" style="margin-top: -20px;">
                  <nav class="nav">
                    <a class="p-2 text-muted" href="#">EVENTS</a>
                    <a class="p-2 text-muted" href="#">POSITION</a>
                    <a class="p-2 text-muted" href="#">TRAVEL TIME</a>
                    <a class="p-2 text-muted active" href="#">TORQUE PROFILE</a>
                    <a class="p-2 text-muted" href="#">WORK ORDERS</a>
                    <a class="p-2 text-muted" href="#">ALARM ANALYTICS</a>
                  </nav>
                </div>

                <hr style="margin: 0 -20px;">

                <h2 class="mt-3">Open</h2>
                <highcharts :options="OpenChartOptions"></highcharts>

                <hr style="margin: 0 -20px;">

                <h2 class="mt-3">Close</h2>
                <highcharts :options="CloseChartOptions"></highcharts>
              </div>
            </div>
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
