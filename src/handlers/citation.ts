import { RequestHandler } from "express";
import {
  getCitationController,
  convertCitationController,
  getSupportedStylesController,
} from "../controllers/citation.controller";
import * as utilities from "../helpers/utilities";
import {
  GetCitationParams,
  GetCitationQuery,
  GetCitationResponse,
  ConvertCitationInput,
  ConvertCitationResponse,
  SupportedStylesResponse,
  CitationErrorResponse,
} from "../validations/citation";

export const getCitation: RequestHandler<
  GetCitationParams,
  GetCitationResponse | CitationErrorResponse,
  {},
  GetCitationQuery
> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { style } = req.query;

    const result = await getCitationController({
      id,
      style,
    });

    res
      .status(200)
      .json(
        utilities.itemResponse(result, 200, "Citation retrieved successfully"),
      );
  } catch (error) {
    next(error);
  }
};

export const convertCitation: RequestHandler<
  {},
  ConvertCitationResponse | CitationErrorResponse,
  ConvertCitationInput
> = async (req, res, next) => {
  try {
    const result = await convertCitationController(req.body);

    res
      .status(200)
      .json(
        utilities.itemResponse(result, 200, "Citation converted successfully"),
      );
  } catch (error) {
    next(error);
  }
};

export const getSupportedStyles: RequestHandler<
  {},
  SupportedStylesResponse | CitationErrorResponse
> = async (req, res, next) => {
  try {
    const result = await getSupportedStylesController();

    res
      .status(200)
      .json(
        utilities.itemResponse(
          result,
          200,
          "Supported styles retrieved successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};
