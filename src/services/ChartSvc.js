function Series(name) {
  this.name = name;
  this.data = [];
}

export default {
  createChartOptions(series = []) {
    const seriesContainer = [];
    series.forEach((name) => {
      seriesContainer.push(new Series(name));
    });

    return {
      chart: {
        type: 'column',
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: Array.from(Array(100), (x, i) => i + 1),
        crosshair: true,
        title: {
          text: 'Valve Position',
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Required Torque (%)',
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>'
          + '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: seriesContainer,
    };
  },
};
