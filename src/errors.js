import { STATUS_CODES } from 'http';

export class HttpError extends Error {
  constructor(status, additionalInfo) {
    super(STATUS_CODES[status]);
    this.status = status;
    this.additionalInfo = additionalInfo
  }
}
