import axios from 'axios';
import _ from 'lodash';

const AVERAGE_TORQUE = 'AverageTorque';
const LAST_TORQUE = 'LastTorque';
const FORECAST_TORQUE = 'ForecastTorque';
export const CHART_SERIES = [AVERAGE_TORQUE, LAST_TORQUE, FORECAST_TORQUE];

function randomMovement(value) {
  const randomValue = Math.random() < 0.5 ? -0.1 : 0.1;
  return value + randomValue;
}

function getUniquePosition(dataByDirection) {
  const uniqueCollection = _.uniqBy(dataByDirection, 'Position');
  return _.reduce(uniqueCollection, (result, o) => {
    result.push(o.Position);
    return result;
  }, []);
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

function Series(name) {
  this.name = name;
  this.data = [];
}

function CreateSeries(seriesNames) {
  const result = [];
  seriesNames.forEach((name) => {
    result.push(new Series(name));
  });
  return result;
}

export default {
  NormalizeData(data) {
    const result = new CreateSeries(CHART_SERIES);
    const uniquePosition = getUniquePosition(data);

    uniquePosition.forEach((position) => {
      const lastObj = _.findLast(data, { Position: position });
      result.forEach((series) => {
        series.data.push(getAttrValue(lastObj, series.name));
      });
    });

    return result;
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
