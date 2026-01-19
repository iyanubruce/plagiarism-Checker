import { Response } from "express";
import HttpStatus from "http-status-codes";

export const itemResponse = (
  payload: any,
  p0: number,
  message = "success",
): any => ({
  status: true,
  message,
  data: payload,
});

export const listResponse = (
  payload: any[],
  p0: number,
  p1: number,
  p2: number,
  message = "success",
): any => ({
  status: true,
  message,
  data: payload,
  pageInfo: {
    totalItems: p0,
    currentPage: p1,
    totalPages: p2,
  },
});

export const errResponse = <T>(
  res: Response,
  payload: T,
  statusCode: number = HttpStatus.OK,
  errors: unknown = null,
): Response => {
  const isError = statusCode >= 400;
  const status = isError ? "error" : "success";
  const payloadKey = isError ? "message" : "data";

  const response = {
    status,
    [payloadKey]: payload,
    ...(isError && errors ? { data: errors } : {}),
  };

  return res.status(statusCode).json(response);
};
