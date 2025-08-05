// src/utils/chunker.ts
import { preprocess } from "./ngram";

export function chunkText(
  text: string,
  wordsPerChunk = 100,
  overlap = 50
): string[] {
  const cleaned = preprocess(text);
  const words = cleaned.split(/\s+/);
  const chunks: string[] = [];

  // Create overlapping chunks
  for (let i = 0; i < words.length; i += wordsPerChunk - overlap) {
    const chunk = words.slice(i, i + wordsPerChunk).join(" ");
    if (chunk.trim().length > 0) {
      chunks.push(chunk);
    }
  }

  return chunks;
}
