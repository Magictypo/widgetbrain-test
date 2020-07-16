import axios from 'axios';
import _ from 'lodash';

const AVERAGE_TORQUE = 'AverageTorque';
const LAST_TORQUE = 'LastTorque';
const FORECAST_TORQUE = 'ForecastTorque';

function randomMovement(obj) {
  const newObj = { ...obj };
  newObj.y += Math.random() < 0.5 ? -0.1 : 0.1;
  return newObj;
}

function getForecastValue(Average, Last) {
  // FORECAST Formula
  return (Average + Last) / 2;
}

function getAttrValue(obj, attrName) {
  if (!obj) return 0;
  if (attrName !== FORECAST_TORQUE) {
    return obj[attrName];
  }
  return getForecastValue(obj[AVERAGE_TORQUE], obj[LAST_TORQUE]);
}

function filterOneDataPerPosition(data, uniquePosition) {
  const results = [];
  uniquePosition.forEach((position) => {
    results.push(_.findLast(data, { Position: position }));
  });
  return results;
}

function populateSeries(series, data) {
  const seriesCopy = [...series];

  seriesCopy.forEach((member, index) => {
    const attrName = member.y;
    seriesCopy[index].data = _.reduce(data, (result, o) => {
      result.push(getAttrValue(o, attrName));
      return result;
    }, []);
  });

  return seriesCopy;
}

export default {
  GetUniquePosition(dataByDirection) {
    const uniqueCollection = _.uniqBy(dataByDirection, 'Position');
    return _.reduce(uniqueCollection, (result, o) => {
      result.push(o.Position);
      return result;
    }, []);
  },
  NormalizeData(data, uniquePosition, chart) {
    let chartSeries = [...chart.options.series];
    const filteredData = filterOneDataPerPosition(data, uniquePosition);
    chartSeries = populateSeries(chartSeries, filteredData);
    return chartSeries;
  },

  GetData() {
    return axios.get('/torque');
  },

  GetDataNextTick(series) {
    // Dummy Simulation
    const seriesData = { ...series };
    seriesData.data = series.data.map(randomMovement);
    return seriesData;
  },

};
