import { Request, Response } from "express";
import { preprocess, getNGrams } from "../utils/ngram";
import { simHash, hammingDistance } from "../utils/lsh";
import { chunkText } from "../utils/chunker";
import { jaccardSimilarity } from "../utils/similarity";
import { PaperDatabase } from "../database/PaperDatabase";
import { formatCitation } from "../utils/citationFormatter";
import { Recommendation, PaperChunk } from "../types";

const db = new PaperDatabase();

export const recommendPapers = async (req: Request, res: Response) => {
  const { text, limit = 5, minRelevance = 15 } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const cleaned = preprocess(text);
    const ngrams = getNGrams(cleaned, 5);

    if (ngrams.length < 3) {
      return res.json({
        results: [],
        message: "Not enough content to analyze",
      });
    }

    const querySimHash = simHash(ngrams);
    const threshold = 8;

    // Find relevant chunks
    const matchingChunks = db.getAllChunks().filter((chunk) => {
      return hammingDistance(querySimHash, chunk.simhash) <= threshold;
    });

    // Aggregate by paper
    const paperScores = new Map<
      string,
      {
        title: string;
        totalScore: number;
        matchCount: number;
        sampleChunk?: PaperChunk;
      }
    >();

    for (const chunk of matchingChunks) {
      const jaccard = jaccardSimilarity(ngrams, chunk.ngrams);
      if (jaccard > 0.1) {
        if (!paperScores.has(chunk.paperId)) {
          paperScores.set(chunk.paperId, {
            title: chunk.title,
            totalScore: 0,
            matchCount: 0,
            sampleChunk: chunk,
          });
        }

        const entry = paperScores.get(chunk.paperId)!;
        entry.totalScore += jaccard;
        entry.matchCount += 1;

        // Keep the strongest match as sample
        if (
          !entry.sampleChunk ||
          jaccard > jaccardSimilarity(ngrams, entry.sampleChunk.ngrams)
        ) {
          entry.sampleChunk = chunk;
        }
      }
    }

    // Format results
    const results = Array.from(paperScores.entries())
      .map(([id, data]) => {
        const relevance = Math.min(
          100,
          Math.round((data.totalScore / data.matchCount) * 100)
        );
        return {
          paperId: id,
          title: data.title,
          relevance,
          citation: {
            apa: formatCitation(data.sampleChunk!, "apa"),
            ieee: formatCitation(data.sampleChunk!, "ieee"),
          },
          sampleText: data.sampleChunk!.text.substring(0, 150) + "...",
        };
      })
      .filter((r) => r.relevance >= minRelevance)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit);

    res.json({
      success: true,
      queryLength: cleaned.split(" ").length,
      results,
    });
  } catch (err: any) {
    res.status(500).json({
      error: "Recommendation failed",
      details: err.message,
    });
  }
};
