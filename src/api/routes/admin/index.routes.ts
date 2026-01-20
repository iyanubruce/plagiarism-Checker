import { Router } from "express";

import paper from "./papers.routes";
import auth from "./auth.routes";

const router = Router();

router.use("/auth", auth);
router.use("/papers", paper);

export default router;
