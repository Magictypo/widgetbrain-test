function CreateChartOptions(series = []) {
  return {
    chart: {
      type: 'column',
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: [],
      tickPositioner() {
        const positions = [];
        this.categories.forEach((text, index) => {
          if (index === 0) {
            positions.push(index);
            // eslint-disable-next-line radix
          } else if (parseInt(text) % 10 === 0) {
            positions.push(index);
          } else if (index === this.categories.length - 1) {
            positions.push(index);
          }
        });
        return positions;
      },
      endOnTick: true,
      showLastLabel: true,
      title: {
        text: 'Valve Position',
      },
    },
    yAxis: {
      min: 0,
      max: 51,
      tickPositioner(min, max) {
        const positions = [];
        let tick = 0;
        const increment = 5;

        if (this.dataMax !== null && this.dataMin !== null) {
          for (tick; tick - increment <= max; tick += increment) {
            if (tick === 50) {
              positions.push(51);
            } else {
              positions.push(tick);
            }
          }
        }
        return positions;
      },
      endOnTick: false,
      title: {
        text: 'Required Torque (%)',
      },
    },
    tooltip: {
      shared: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: series.map((x) => {
      const y = { ...x };
      // Add Attr Data
      y.data = [];
      return y;
    }),
  };
}

function Chart(chartConfig) {
  this.name = chartConfig.name;
  this.filter = chartConfig.filter;
  this.options = CreateChartOptions(chartConfig.series);
}

export default {
  CreateCharts(charts = { name: '', series: [] }) {
    const createdCharts = [];
    charts.forEach((chartConfig) => {
      createdCharts.push(new Chart(chartConfig));
    });
    return createdCharts;
  },
};
