import { Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";
import { extractText } from "../utils/textExtractor";
import { preprocess, getNGrams } from "../utils/ngram";
import { simHash, hammingDistance } from "../utils/lsh";
import { chunkText } from "../utils/chunker";
import { jaccardSimilarity } from "../utils/similarity";
import { PaperDatabase } from "../database/PaperDatabase";
import { PlagiarismReport, MatchResult } from "../types";

const db = new PaperDatabase();

export const checkPlagiarism = async (req: Request, res: Response) => {
  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res
      .status(400)
      .json({
        error: 'Request must include a "text" field with string content',
      });
  }

  try {
    const cleanedText = preprocess(text);
    const queryChunks = chunkText(cleanedText, 100, 50);
    const allResults: MatchResult[] = [];

    for (const [chunkIndex, chunk] of queryChunks.entries()) {
      const ngrams = getNGrams(chunk, 5);
      if (ngrams.length === 0) continue;

      const docSimHash = simHash(ngrams);

      const threshold = 8;
      const matchingChunks = db.getAllChunks().filter((entry) => {
        return hammingDistance(docSimHash, entry.simhash) <= threshold;
      });

      for (const chunk of matchingChunks) {
        const jaccard = jaccardSimilarity(ngrams, chunk.ngrams);
        if (jaccard > 0.2) {
          allResults.push({
            chunkIndex,
            paperId: chunk.paperId,
            title: chunk.title,
            similarity: Math.round(jaccard * 100),
            matchingText: chunk.text,
            querySnippet: chunk.text.substring(0, 100) + "...",
            databaseSnippet: chunk.text.substring(0, 100) + "...",
          });
        }
      }
    }

    const resultsByPaper = Object.values(
      allResults.reduce((acc, result) => {
        if (!acc[result.paperId]) {
          acc[result.paperId] = {
            paperId: result.paperId,
            title: result.title,
            matches: [],
            maxSimilarity: 0,
          };
        }

        acc[result.paperId].matches.push(result);
        acc[result.paperId].maxSimilarity = Math.max(
          acc[result.paperId].maxSimilarity,
          result.similarity
        );

        return acc;
      }, {} as Record<string, any>)
    ).sort((a, b) => b.maxSimilarity - a.maxSimilarity);

    const finalScore =
      resultsByPaper.length > 0 ? resultsByPaper[0].maxSimilarity : 0;

    const report: PlagiarismReport = {
      success: true,
      textLength: cleanedText.split(" ").length,
      chunksAnalyzed: queryChunks.length,
      similarityScore: finalScore,
      matchesFound: allResults.length,
      detailedMatches: resultsByPaper,
    };

    return res.json(report);
  } catch (err: any) {
    console.error("Plagiarism check failed:", err);
    return res.status(500).json({
      error: "Internal server error during plagiarism check",
      details: err.message,
    });
  }
};

export const addPaper = async (req: Request, res: Response) => {
  if (!req.file || !req.body.title) {
    return res.status(400).json({ error: "Missing file or title" });
  }

  const originalname = req.file.originalname;
  const ext = path.extname(originalname).toLowerCase();

  if (ext !== ".pdf" && ext !== ".docx") {
    return res.status(400).json({
      error: "Only PDF and DOCX files are supported",
    });
  }

  try {
    const buffer = fs.readFileSync(req.file.path);
    const rawText = await extractText(buffer, ext);
    const cleanedText = preprocess(rawText);

    if (cleanedText.length < 100) {
      return res.status(400).json({
        error: "Document contains too little text to analyze",
      });
    }

    // Get optional metadata from request
    const metadata = {
      authors: req.body.authors ? JSON.parse(req.body.authors) : undefined,
      year: req.body.year ? parseInt(req.body.year) : undefined,
      source: req.body.source,
      doi: req.body.doi,
    };

    const paperId = Date.now().toString();
    db.addPaperChunks(paperId, req.body.title, cleanedText, metadata);
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      id: paperId,
      chunksAdded: db.getChunksForPaper(paperId).length,
    });
  } catch (err: any) {
    console.error("Add paper failed:", err);
    res.status(500).json({ error: err.message });
  }
};
