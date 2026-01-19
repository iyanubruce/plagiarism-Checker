import { Router } from "express";
import { recommendPapers } from "../handlers/recommend";
import { validate } from "../middlewares/validate";
import { recommendPapersSchema } from "../../validations/recommended";

const router = Router();

router.post("/", validate(recommendPapersSchema), recommendPapers);

export default router;
