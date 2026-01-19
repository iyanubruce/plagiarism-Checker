import { z } from "zod";

export const getCitationSchema = {
  params: z.object({
    id: z.string().min(1, "Paper ID is required"),
  }),
  query: z.object({
    style: z.enum(["apa", "ieee"]).optional().default("apa"),
  }),
};

export const convertCitationSchema = {
  body: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    year: z.number(),
    source: z.string().optional(),
    doi: z.string().optional(),
    fromStyle: z.enum(["apa", "ieee"], {
      message: 'Invalid style. Use "apa" or "ieee"',
    }),
    toStyle: z.enum(["apa", "ieee"], {
      message: 'Invalid style. Use "apa" or "ieee"',
    }),
  }),
};

export type GetCitationParams = z.infer<typeof getCitationSchema.params>;
export type GetCitationQuery = z.infer<typeof getCitationSchema.query>;
export type ConvertCitationInput = z.infer<typeof convertCitationSchema.body>;

export interface GetCitationResponse {
  success: true;
  paperId: string;
  title: string;
  citation: {
    style: string;
    formatted: string;
  };
}

export interface ConvertCitationResponse {
  success: true;
  original: {
    style: string;
    citation: string;
  };
  converted: {
    style: string;
    citation: string;
  };
}

export interface SupportedStylesResponse {
  success: true;
  styles: Array<{
    name: string;
    description: string;
    example: string;
  }>;
}

export interface CitationErrorResponse {
  error: string;
  details?: string;
}
