import { RequestHandler } from "express";
import { recommendPapersController } from "../controllers/recommend.controller";
import { itemResponse } from "../helpers/utilities";
import {
  RecommendPapersInput,
  RecommendPapersResponse,
  RecommendPapersErrorResponse,
} from "../validations/recommended";

export const recommendPapers: RequestHandler<
  {},
  RecommendPapersResponse | RecommendPapersErrorResponse,
  RecommendPapersInput
> = async (req, res, next) => {
  try {
    const result = await recommendPapersController(req.body);

    res
      .status(200)
      .json(
        itemResponse(
          result,
          200,
          "Paper recommendations retrieved successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};
