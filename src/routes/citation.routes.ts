import { Router } from "express";
import {
  getCitation,
  convertCitation,
  getSupportedStyles,
} from "../controllers/citation.controller";

const router = Router();

// SPECIFIC routes FIRST
router.get("/citation/styles", getSupportedStyles); // This must come before parameterized routes

// PARAMETERIZED routes AFTER
router.get("/citation/:id", getCitation);

// Other routes
router.post("/citation/convert", convertCitation);

export default router;
