import { RequestHandler } from "express";
import { addPaperController } from "../../controllers/papers.controller";
import { itemResponse } from "../../helpers/utilities";
import {
  AddPaperRequestBody,
  AddPaperResponse,
  AddPaperErrorResponse,
} from "../../validations/papers";

export const addPaper: RequestHandler<
  {},
  AddPaperResponse | AddPaperErrorResponse,
  AddPaperRequestBody
> = async (req, res, next) => {
  try {
    const result = await addPaperController({
      file: req.file!,
      body: req.body,
    });

    res.status(201).json(itemResponse(result, 201, "Paper added successfully"));
  } catch (error) {
    next(error);
  }
};
