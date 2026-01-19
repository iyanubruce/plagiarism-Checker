import { z } from "zod";

export const checkPlagiarismSchema = {
  body: z.object({
    text: z
      .string()
      .min(50, "Text must be at least 50 characters for plagiarism check"),
  }),
};

export type CheckPlagiarismRequestBody = z.infer<
  typeof checkPlagiarismSchema.body
>;

export interface CheckPlagiarismResponse {
  success: true;
  textLength: number;
  chunksAnalyzed: number;
  similarityScore: number;
  matchesFound: number;
  detailedMatches: any[];
}

export interface CheckPlagiarismErrorResponse {
  error: string;
  details?: string;
}
