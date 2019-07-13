import { Measurement } from './measurement';
import { HttpError } from '../errors';
import constants from '../constants/constants';

const store = new Map();

/**
 * Add new measurement
 * @param {Measurement} measurement to be added
 */
export function add(measurement) {
  if (measurement.metrics.size) {
    store.set(measurement.timestamp.toISOString(), measurement);
  }
}

/**
 * Get existing measurement
 * @param {Date} timestamp when measurement was taken
 * @returns {Measurement} measurement for the particular date
 */
export function fetch(timestamp) {
  return store.get(timestamp.toISOString())
}

/**
 * Get the measurements within the given date range
 * @param {Date} from Lower bound for the query, inclusive
 * @param {Date} to Upper bound for the query, exclusive
 */
export function queryDateRange(from, to) {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  if (isNaN(toTime) || isNaN(fromTime)) {
    throw new HttpError(400, constants.INVALID_TIMESTAMP);
  }
  if (fromTime >= toTime) {
    throw new HttpError(400, constants.INVALID_DATE_RANGE);
  }

  const measurements = [];
  for (const measurement of store.values()) {
    const time = measurement.timestamp.getTime();
    // Can exit loop since records are stored in chronological order
    if (time >= toTime) break;

    if (time >= fromTime && time < toTime) {
      measurements.push(measurement);
    }
  }

  return measurements;
}