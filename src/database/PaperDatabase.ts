import { PaperChunk } from "../types";
import { chunkText } from "../utils/chunker";
import { preprocess, getNGrams } from "../utils/ngram";
import { simHash } from "../utils/lsh";
import * as fs from "fs";
import * as path from "path";

const DB_PATH = path.join(__dirname, "../../database/chunks.json");
const DB_DIR = path.dirname(DB_PATH);

export class PaperDatabase {
  private chunks: PaperChunk[] = [];

  constructor() {
    this.ensureDatabase();
    this.load();
  }

  private ensureDatabase(): void {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, "[]", "utf-8");
    }
  }

  load(): void {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    this.chunks = JSON.parse(data);
  }

  save(): void {
    fs.writeFileSync(DB_PATH, JSON.stringify(this.chunks, null, 2), "utf-8");
  }

  getAllChunks(): PaperChunk[] {
    return this.chunks;
  }

  getChunksForPaper(paperId: string): PaperChunk[] {
    return this.chunks.filter((chunk) => chunk.paperId === paperId);
  }

  addPaperChunks(
    paperId: string,
    title: string,
    text: string,
    metadata?: {
      authors?: string[];
      year?: number;
      source?: string;
      doi?: string;
    }
  ): void {
    const chunks = chunkText(text, 100, 50);

    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i];
      const ngrams = getNGrams(chunkText, 5);

      if (ngrams.length === 0) continue;

      const chunk: PaperChunk = {
        id: `${paperId}-chunk-${i}`,
        paperId,
        title,
        text: chunkText,
        ngrams,
        simhash: simHash(ngrams),
        position: i,
        authors: metadata?.authors,
        year: metadata?.year,
        source: metadata?.source,
        doi: metadata?.doi,
      };

      this.chunks.push(chunk);
    }

    this.save();
  }
}
