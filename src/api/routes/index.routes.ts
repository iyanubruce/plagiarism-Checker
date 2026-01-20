import { Router } from "express";

import recommend from "./recommend.routes";
import plagiarism from "./plagiarism.routes";
import citation from "./citation.routes";
import paper from "./admin/papers.routes";
const router = Router();

router.use("/recommend", recommend);
router.use("/plagiarism", plagiarism);
router.use("/citation", citation);
router.use("/papers", paper);

export default router;
