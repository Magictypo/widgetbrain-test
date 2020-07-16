import axios from 'axios';
import _ from 'lodash';

const AVERAGE_TORQUE = 'AverageTorque';
const LAST_TORQUE = 'LastTorque';
const FORECAST_TORQUE = 'ForecastTorque';
export const CHART_SERIES = [AVERAGE_TORQUE, LAST_TORQUE, FORECAST_TORQUE];

function randomMovement(obj) {
  const newObj = { ...obj };
  const randomValue = Math.random() < 0.5 ? -0.1 : 0.1;
  newObj.y += randomValue;
  return newObj;
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

export default {
  NormalizeData(data, chart) {
    const result = [...chart.options.series];
    const uniquePosition = getUniquePosition(data);

    uniquePosition.forEach((position) => {
      const lastObj = _.findLast(data, { Position: position });
      result.forEach((series) => {
        series.data.push({
          name: `Position ${position}`,
          y: getAttrValue(lastObj, series.y),
        });
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
