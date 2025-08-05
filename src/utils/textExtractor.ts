import PdfParse from "pdf-parse";
import * as mammoth from "mammoth";
import { Buffer } from "buffer";

export async function extractText(
  buffer: Buffer,
  ext: string
): Promise<string> {
  try {
    if (ext === ".pdf") {
      const result = await PdfParse(buffer);
      return result.text.trim();
    } else if (ext === ".docx") {
      const result = await mammoth.extractRawText({ buffer });
      return result.value.trim();
    } else {
      throw new Error(`Unsupported extension: ${ext}`);
    }
  } catch (err: any) {
    console.error("Extraction error:", err.message);
    throw new Error(`Text extraction failed: ${err.message}`);
  }
}
