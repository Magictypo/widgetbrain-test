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
      crosshair: true,
      title: {
        text: 'Valve Position',
      },
    },
    yAxis: {
      min: 0,
      max: 51,
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
