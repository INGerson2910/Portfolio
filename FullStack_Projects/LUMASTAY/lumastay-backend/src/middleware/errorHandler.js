import { ZodError } from "zod";
import { ApiError } from "../utils/apiError.js";

export function errorHandler(error, req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VAL-001",
        message: "Validation error",
        details: error.issues
      },
      correlationId: req.correlationId
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.httpStatus).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      },
      correlationId: req.correlationId
    });
  }

  console.error(error);

  return res.status(500).json({
    error: {
      code: "INT-500",
      message: "Internal server error",
      details: []
    },
    correlationId: req.correlationId
  });
}