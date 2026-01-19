import HttpStatus from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
// import * as Sentry from '@sentry/node';
import { errResponse } from "../../helpers/utilities";
import logger from "../../utils/logger";
import ErrorHandler from "../../errors/errorHandler";

import { ZodError } from "zod";

export type ZodFieldError = {
  field: string; // e.g. "email" or "address.city"
  message: string;
};

export const formatZodError = (err: ZodError): ZodFieldError[] => {
  return err.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
};

export default function handleErrors(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  //   if (env.application.nodeEnv === 'production') {
  //     Sentry.captureException(err);
  //   }

  if (err instanceof ErrorHandler) {
    logger.error("HANDLED ERROR ==> ", err);
    return errResponse<string>(res, err.message, err.getHttpCode());
  }

  if (err instanceof z.ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    logger.info("Validation error", { errors: formattedErrors });

    logger.error(
      `VALIDATION ERROR ==> ${req.method} ${req.path}`,
      JSON.stringify(formattedErrors, null, 2),
    );

    return res.status(HttpStatus.BAD_REQUEST).json({
      status: "error",
      message: "Validation failed. Please check your inputs.",
      data: formattedErrors,
    });
  }

  // Handle MongoDB duplicate key error (E11000)
  if ((err as any).code === 11000 || (err as any).code === 11001) {
    const mongoErr = err as any;
    const field =
      Object.keys(mongoErr.keyPattern || mongoErr.keyValue || {})[0] || "field";
    const value = mongoErr.keyValue?.[field] || "value";

    logger.error(`MONGODB DUPLICATE KEY ERROR ==> ${req.method} ${req.path}`, {
      field,
      value,
      error: mongoErr.message,
    });

    return res.status(HttpStatus.CONFLICT).json({
      status: "error",
      message: `A record with this ${field} already exists: ${value}`,
      data: {
        field,
        value,
        type: "duplicate_key",
      },
    });
  }

  // Handle invalid ObjectId errors (BSONError)
  if (
    (err.message && err.message.includes("24 character hex string")) ||
    (err.message && err.message.includes("12 byte Uint8Array")) ||
    (err as any).name === "BSONError" ||
    (err as any).name === "BSONTypeError"
  ) {
    logger.error(`INVALID OBJECTID ERROR ==> ${req.method} ${req.path}`, {
      message: err.message,
      url: req.url,
      params: req.params,
    });

    return res.status(HttpStatus.BAD_REQUEST).json({
      status: "error",
      message: "Invalid ID format. Please provide a valid ID.",
      data: {
        type: "invalid_id",
        details: "ID must be a valid MongoDB ObjectId",
      },
    });
  }

  // Handle TypeError for undefined property access
  if (
    err instanceof TypeError &&
    err.message.includes("Cannot read properties of undefined")
  ) {
    // Extract the property name from the error message
    const propertyMatch = err.message.match(/reading '([^']+)'/);
    const property = propertyMatch ? propertyMatch[1] : "unknown property";

    logger.error(
      `TYPE ERROR - UNDEFINED PROPERTY ACCESS ==> ${req.method} ${req.path}`,
      {
        message: err.message,
        stack: err.stack,
        property,
      },
    );

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message:
        "An unexpected error occurred while processing your request. Please try again.",
      data: {
        type: "undefined_property_access",
        details: `Attempted to access property '${property}' of an undefined object`,
      },
    });
  }

  logger.error("INTERNAL SERVER ERROR --> ", {
    name: err.name,
    message: err.message,
    stack: err.stack,
    raw: JSON.stringify(err, Object.getOwnPropertyNames(err), 2),
  });

  return errResponse<string>(
    res,
    "Internal server error, please report this to the support team",
    500,
  );
}

// src/utils/zodErrorFormatter.ts
