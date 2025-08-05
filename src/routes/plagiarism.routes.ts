// src/routes/plagiarism.routes.ts
import { Router } from "express";
import multer from "multer";
import path from "path";
import {
  checkPlagiarism,
  addPaper,
} from "../controllers/plagiarism.controller";

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
  cb: multer.FileFilterCallback
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

router.post("/check-plagiarism", checkPlagiarism);
router.post("/add-paper", upload.single("paper"), addPaper);

export default router;
