export class ApiError extends Error {
  constructor(httpStatus, code, message, details = []) {
    super(message);
    this.httpStatus = httpStatus;
    this.code = code;
    this.details = details;
  }
}