import { Router } from "express";
import {
  getCitation,
  convertCitation,
  getSupportedStyles,
} from "../handlers/citation";
import { validate } from "../middlewares/validate";
import {
  getCitationSchema,
  convertCitationSchema,
} from "../../validations/citation";

const router = Router();

// SPECIFIC routes FIRST
router.get("/citation/styles", getSupportedStyles); // This must come before parameterized routes

// PARAMETERIZED routes AFTER
router.get("/citation/:id", validate(getCitationSchema), getCitation);

// Other routes
router.post(
  "/citation/convert",
  validate(convertCitationSchema),
  convertCitation,
);

export default router;
