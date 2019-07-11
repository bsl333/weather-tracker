import { Measurement } from './measurement';
import { HttpError } from '../errors';
import constants from '../constants/constants';

// NOTE:
//  Chose to use a map over an array or object
//    1) Achieve O(1) look up times for a single record. Would be O(n) for an array
//    2) Query date range function could be optimized.
//        - If records are inserted sequentially,then we can stop looking thru map
//          once 'to' value has been found. Map guarantees
//          insertion order and objects do not.
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

  const measurements = [];
  for (const measurement of store.values()) {
    const time = measurement.timestamp.getTime();
    if (time >= fromTime && time < toTime) {
      measurements.push(measurement)
    };
    // Assumption: Here I am assuming records are stored in chronological order
    // If this is not the case, this line needs to be removed. Otherwise,
    // as the data set grows, this will help optimize this function since we can't have
    // a matching record if we exceed the upper bound for the date range.
    if (time >= toTime) {
      break;
    }
  }

  return measurements;
}