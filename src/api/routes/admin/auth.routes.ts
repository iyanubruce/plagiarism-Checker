import { Router } from "express";
import { login, logout, getCurrentAdmin } from "../../handlers/admin/auth";
import { validate } from "../../middlewares/validate";
import { loginSchema } from "../../../validations/admin/auth";
import { requireAuth } from "../../middlewares/session-middleware";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, getCurrentAdmin);

export default router;
