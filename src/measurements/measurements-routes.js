import express from 'express';
import * as store from './measurement-store';
import { Measurement } from './measurement';
import { HttpError } from '../errors';
import constants from '../constants/constants'

const router = express.Router();
export function register(app) {
  app.use('/measurements', router);
}

router.post('/', (req, res) => {
  try {
    const measurement = parseMeasurement(req.body);
    store.add(measurement);
    res.location(`/measurements/${measurement.timestamp.toISOString()}`).sendStatus(201);
  } catch (e) {
    res.status(e.status).send({ error: `${e.message}: ${e.additionalInfo}` });
  }
});

router.get('/:timestamp', (req, res) => {
  const result = store.fetch(new Date(req.params.timestamp));
  if (result) res.json(serializeMeasurement(result));
  else res.sendStatus(404);
});

function parseMeasurement({ timestamp, ...metrics }) {
  const measurement = new Measurement();
  measurement.timestamp = new Date(timestamp);

  if (isNaN(measurement.timestamp)) throw new HttpError(400, constants.INVALID_TIMESTAMP);

  for (const metric in metrics) {
    if (!metrics.hasOwnProperty(metric)) continue;

    const value = metrics[metric];
    // ensure an empty string throws an erorr.
    if (isNaN(value) || value === '') {
      throw new HttpError(400, metric + constants.INVALID_PROPERTY_TYPE);
    }

    measurement.setMetric(metric, +value);
  }

  return measurement;
}

function serializeMeasurement(measurement) {
  const out = { timestamp: measurement.timestamp.toISOString() };

  for (const [metric, value] of measurement.metrics.entries()) {
    out[metric] = value;
  }

  return out;
}
