// src/routes/plagiarism.routes.ts
import { Router } from "express";
import { checkPlagiarism } from "../handlers/plagiarism";
import { validate } from "../middlewares/validate";
import { checkPlagiarismSchema } from "../../validations/plagiarism";
const router = Router();

router.post("/", validate(checkPlagiarismSchema), checkPlagiarism);

export default router;
