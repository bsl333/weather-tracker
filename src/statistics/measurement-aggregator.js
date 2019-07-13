import { Measurement } from '../measurements/measurement';
import { HttpError } from '../errors';
import errorMessages from '../constants/constants';

/**
 * Compute statistics for given measurements
 * @param {Measurement[]} measurements
 * @param {String[]} metrics
 * @param {String[]} stats
 * @return {Object[]} arary of objects storing statistical information for given stats and metrics
 */
export function computeStats(measurements, metrics, stats) {
  if (!stats) throw new HttpError(400, errorMessages.MISSING_STATS);
  if (!metrics) throw new HttpError(400, errorMessages.MISSING_METRICS);
  if (!measurements.length) return [];

  return metrics.reduce((acc, metric) => {
    const cleansedData = cleanseData(measurements, metric);
    if (!cleansedData.length) return acc;
    stats.forEach(stat => {
      acc.push({
        metric,
        stat,
        value: calculateStat(stat, cleansedData)
      });
    });
    return acc;
  }, []);
}

// Helper functions to calculate various stats
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
 * Calcuate the stat if it exists or return a defualt string
 * @param {String} stat
 * @param {Number[]} data
 * @returns {Number|String} calculated value or "Cannot perform {stat}"
 */
function calculateStat(stat, data) {
  stat = stat.toLowerCase();
  if (statsFunctions[stat]) return +statsFunctions[stat](data).toFixed(1);
  else return `${errorMessages.CANNOT_PERFORM} ${stat}`;
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