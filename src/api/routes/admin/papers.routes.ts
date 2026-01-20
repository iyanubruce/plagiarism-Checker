// src/routes/papers.routes.ts
import { Router } from "express";
import multer from "multer";
import path from "path";
import { addPaper } from "../../handlers/admin/papers";
import { validate } from "../../middlewares/validate";
import { addPaperSchema } from "../../../validations/admin/papers";
import BadRequestError from "../../../errors/badRequestError";

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + suffix + path.extname(file.originalname));
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === ".pdf" || ext === ".docx") {
    cb(null, true);
  } else {
    cb(new BadRequestError("Only PDF and DOCX files are allowed"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const router = Router();

router.post("/", upload.single("paper"), validate(addPaperSchema), addPaper);

export default router;
