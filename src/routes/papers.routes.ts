// src/routes/papers.routes.ts
import { Router } from "express";
import multer from "multer";
import path from "path";
import { addPaper } from "../handlers/papers";
import { validate } from "../middlewares/validate";
import { addPaperSchema } from "../validations/papers";

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

// ✅ Improved file filter: uses file extension
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === ".pdf" || ext === ".docx") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const router = Router();

router.post("/", upload.single("paper"), validate(addPaperSchema), addPaper);

export default router;
