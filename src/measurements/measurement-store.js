import { Measurement } from './measurement';
import { HttpError } from '../errors';

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
  throw new HttpError(501);
}

/**
 * Get the measurements within the given date range
 * @param {Date} start Lower bound for the query, inclusive
 * @param {Date} end Upper bound for the query, exclusive
 */
export function queryDateRange(from, to) {
  throw new HttpError(501);
}
