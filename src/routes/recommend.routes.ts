import { Router } from "express";
import { recommendPapers } from "../controllers/recommend.controller";

const router = Router();

router.post("/recommend", recommendPapers);

export default router;
