import { randomUUID } from "crypto";

export function correlation(req, res, next) {
  const correlationId = req.headers["x-correlation-id"] || randomUUID();
  req.correlationId = correlationId;
  res.setHeader("x-correlation-id", correlationId);
  next();
}