import PdfParse from "pdf-parse";
import * as mammoth from "mammoth";
import { Buffer } from "buffer";
import BadRequestError from "../errors/badRequestError";
import logger from "./logger";

export async function extractText(
  buffer: Buffer,
  ext: string,
): Promise<string> {
  try {
    if (ext === ".pdf") {
      const result = await PdfParse(buffer);
      return result.text.trim();
    } else if (ext === ".docx") {
      const result = await mammoth.extractRawText({ buffer });
      return result.value.trim();
    } else {
      throw new BadRequestError(`Unsupported extension: ${ext}`);
    }
  } catch (err: any) {
    logger.error("Extraction error:", err.message);
    throw new BadRequestError(`Text extraction failed: ${err.message}`);
  }
}
