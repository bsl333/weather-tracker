import { Measurement } from '../measurements/measurement';

/**
 * Compute statistics for given measurements
 * @param {Measurement[]} measurements
 * @param {String[]} metrics
 * @param {String[]} stats
 * @return {Object[]} objects storing statistical information for given stats and metrics
 */

export function computeStats(measurements, metrics, stats) {
  if (!measurements.length || !metrics || !stats) {
    return [];
  }

  return metrics.reduce((acc, metric) => {
    const cleansedData = cleanseData(measurements, metric);
    if (!cleansedData.length) return acc;

    stats.forEach(stat => {
      acc.push({
        metric,
        stat,
        value: +statsFunctions[stat](cleansedData).toFixed(1)
      });
    });
    return acc;
  }, []);
}

/**
 * Object that contains helper functions to calculate various stats
 * Note: opted not to use arrow functions to allow this.existingMethod
 *       to always work, in case new calculations require use of existing methods.
 */
const statsFunctions = {
  max(data) {
    return Math.max(...data);
  },

  min(data) {
    return Math.min(...data);
  },

  average(data) {
    return data.reduce((acc, val) => acc + val) / data.length;
  }
}
/**
 * Removes undefined data, then map remaining measurement values to an array.
 * @param {Measurement[]} measurements
 * @param {String} metric
 * @return {Number[]} an array of numbers
 */
function cleanseData(measurements, metric) {
  return measurements
    .filter(({ metrics }) => metrics.get(metric) !== undefined)
    .map(({ metrics }) => metrics.get(metric));
}