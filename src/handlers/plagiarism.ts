import { RequestHandler } from "express";
import { checkPlagiarismController } from "../controllers/plagiarism.controller";
import { itemResponse } from "../helpers/utilities";
import {
  CheckPlagiarismRequestBody,
  CheckPlagiarismResponse,
  CheckPlagiarismErrorResponse,
} from "../validations/plagiarism";

export const checkPlagiarism: RequestHandler<
  {},
  CheckPlagiarismResponse | CheckPlagiarismErrorResponse,
  CheckPlagiarismRequestBody
> = async (req, res, next) => {
  try {
    const { text } = req.body;

    const result = await checkPlagiarismController(text);

    res
      .status(200)
      .json(
        itemResponse(result, 200, "Plagiarism check completed successfully"),
      );
  } catch (error) {
    next(error);
  }
};
