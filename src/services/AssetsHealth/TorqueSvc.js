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

export default {
  GetUniquePosition(dataByDirection) {
    const uniqueCollection = _.uniqBy(dataByDirection, 'Position');
    return _.reduce(uniqueCollection, (result, o) => {
      result.push(o.Position);
      return result;
    }, []);
  },
  NormalizeData(data, uniquePosition, chart) {
    const chartSeries = [...chart.options.series];

    uniquePosition.forEach((position) => {
      const lastObj = _.findLast(data, { Position: position });

      chartSeries.forEach((series) => {
        series.data.push({
          name: `Position ${position}`,
          y: getAttrValue(lastObj, series.y),
        });
      });
    });

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
