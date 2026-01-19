import { z } from "zod";
import { Request } from "express";
export const addPaperSchema = {
  body: z.object({
    title: z.string().min(1, "Title is required").max(500, "Title is too long"),
    authors: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          try {
            const parsed = JSON.parse(val);
            return (
              Array.isArray(parsed) &&
              parsed.every((a) => typeof a === "string")
            );
          } catch {
            return false;
          }
        },
        { message: "Authors must be a valid JSON array of strings" },
      ),
    year: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          const num = parseInt(val);
          return (
            !isNaN(num) && num >= 1900 && num <= new Date().getFullYear() + 1
          );
        },
        {
          message: "Year must be a valid number between 1900 and current year",
        },
      ),
    source: z.string().max(200, "Source is too long").optional(),
    doi: z
      .string()
      .max(100, "DOI is too long")
      .regex(/^(10\.\d{4,}\/\S+)?$/, "Invalid DOI format")
      .optional()
      .or(z.literal("")),
  }),
};

export type AddPaperRequestBody = z.infer<typeof addPaperSchema.body>;

// Define the Request type with file upload
export type AddPaperRequest = Request<
  {}, // Params
  {}, // ResBody
  AddPaperRequestBody, // ReqBody
  {} // ReqQuery
> & {
  file: Express.Multer.File;
};

// Define response types
export type AddPaperResponse = {
  success: true;
  id: string;
  chunksAdded: number;
};

export type AddPaperErrorResponse = {
  error: string;
  details?: string;
};
