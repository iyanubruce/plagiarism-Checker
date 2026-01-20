import { RequestHandler } from "express";
import { addPaperController } from "../../../controllers/admin/papers.controller";
import { itemResponse } from "../../../helpers/utilities";
import {
  AddPaperRequestBody,
  AddPaperResponse,
  AddPaperErrorResponse,
} from "../../../validations/admin/papers";

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
