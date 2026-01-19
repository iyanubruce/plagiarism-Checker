import { z } from "zod";

export const recommendPapersSchema = {
  body: z.object({
    text: z.string().min(1, "Text is required"),
    limit: z.number().min(1).max(20).optional().default(5),
    minRelevance: z.number().min(0).max(100).optional().default(15),
  }),
};

export type RecommendPapersInput = z.infer<typeof recommendPapersSchema.body>;

export interface RecommendPapersResponse {
  success: true;
  queryLength: number;
  results: Array<{
    paperId: string;
    title: string;
    relevance: number;
    citation: {
      apa: string;
      ieee: string;
    };
    sampleText: string;
  }>;
}

export interface RecommendPapersErrorResponse {
  error: string;
  details?: string;
  message?: string;
}
