export interface PaperChunk {
  id: string;
  paperId: string;
  title: string;
  text: string;
  ngrams: string[];
  simhash: string;
  position: number;
  authors?: string[];
  year?: number;
  source?: string;
  doi?: string;
}

export interface Paper {
  id: string;
  title: string;
}

export interface MatchResult {
  chunkIndex: number;
  paperId: string;
  title: string;
  similarity: number;
  matchingText: string;
  querySnippet: string;
  databaseSnippet: string;
}

export interface PlagiarismReport {
  success: boolean;
  textLength: number;
  chunksAnalyzed: number;
  similarityScore: number;
  matchesFound: number;
  detailedMatches: {
    paperId: string;
    title: string;
    matches: MatchResult[];
    maxSimilarity: number;
  }[];
}

export interface Recommendation {
  paperId: string;
  title: string;
  relevance: number;
  citation: {
    apa: string;
    ieee: string;
  };
  sampleText: string;
}

// Extend express-session to include custom session data
declare module "express-session" {
  interface SessionData {
    adminId?: string;
  }
}
