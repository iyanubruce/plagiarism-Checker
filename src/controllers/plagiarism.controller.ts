import { preprocess, getNGrams } from "../utils/ngram";
import { simHash, hammingDistance } from "../utils/lsh";
import { chunkText } from "../utils/chunker";
import { jaccardSimilarity } from "../utils/similarity";
import { PaperDatabase } from "../database/PaperDatabase";
import { MatchResult } from "../types";
import { CheckPlagiarismRequestBody } from "../validations/plagiarism";

const db = new PaperDatabase();

export const checkPlagiarismController = async (text: string) => {
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
    allResults.reduce(
      (acc, result) => {
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
          result.similarity,
        );

        return acc;
      },
      {} as Record<string, any>,
    ),
  ).sort((a, b) => b.maxSimilarity - a.maxSimilarity);

  const finalScore =
    resultsByPaper.length > 0 ? resultsByPaper[0].maxSimilarity : 0;

  return {
    success: true,
    textLength: cleanedText.split(" ").length,
    chunksAnalyzed: queryChunks.length,
    similarityScore: finalScore,
    matchesFound: allResults.length,
    detailedMatches: resultsByPaper,
  };
};
