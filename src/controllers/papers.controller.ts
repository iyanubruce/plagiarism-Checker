import * as fs from "fs";
import * as path from "path";
import { extractText } from "../utils/textExtractor";
import { preprocess } from "../utils/ngram";
import { PaperDatabase } from "../database/PaperDatabase";
import { AddPaperRequestBody } from "../validations/papers";

const db = new PaperDatabase();

interface AddPaperInput {
  file: Express.Multer.File;
  body: AddPaperRequestBody;
}

export const addPaperController = async (input: AddPaperInput) => {
  const { file, body } = input;
  const { title, authors, year, source, doi } = body;

  if (!file) {
    throw new Error("No file uploaded");
  }

  const originalname = file.originalname;
  const ext = path.extname(originalname).toLowerCase();

  if (ext !== ".pdf" && ext !== ".docx") {
    throw new Error("Only PDF and DOCX files are supported");
  }

  const buffer = fs.readFileSync(file.path);
  const rawText = await extractText(buffer, ext);
  const cleanedText = preprocess(rawText);

  if (cleanedText.length < 100) {
    throw new Error("Document contains too little text to analyze");
  }

  // Get optional metadata from request
  const metadata = {
    authors: authors ? JSON.parse(authors) : undefined,
    year: year ? parseInt(year) : undefined,
    source: source,
    doi: doi,
  };

  const paperId = Date.now().toString();
  db.addPaperChunks(paperId, title, cleanedText, metadata);
  fs.unlinkSync(file.path);

  return {
    success: true,
    id: paperId,
    chunksAdded: db.getChunksForPaper(paperId).length,
  };
};
