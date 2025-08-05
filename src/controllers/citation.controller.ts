import { Request, Response } from "express";
import { PaperDatabase } from "../database/PaperDatabase";
import { formatCitation } from "../utils/citationFormatter";
import { PaperChunk } from "../types";

const db = new PaperDatabase();

/**
 * Get citation for a specific paper by ID
 *
 * Example request:
 * GET /api/citation/1719283746123?style=apa
 */
export const getCitation = async (req: Request, res: Response) => {
  const paperId = req.params.id;
  const style = ((req.query.style as string) || "apa").toLowerCase();

  if (!["apa", "ieee"].includes(style)) {
    return res.status(400).json({
      error: 'Invalid citation style. Use "apa" or "ieee".',
    });
  }

  try {
    // Get any chunk from this paper (they all have same metadata)
    const chunks = db.getChunksForPaper(paperId);

    if (chunks.length === 0) {
      return res.status(404).json({
        error: "Paper not found",
      });
    }

    const chunk = chunks[0]; // First chunk has the metadata
    const citation = formatCitation(chunk, style as "apa" | "ieee");

    res.json({
      success: true,
      paperId,
      title: chunk.title,
      citation: {
        style,
        formatted: citation,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      error: "Citation generation failed",
      details: err.message,
    });
  }
};

/**
 * Convert citation between styles
 *
 * Example request:
 * POST /api/citation/convert
 * {
 *   "citation": "Smith, J., & Doe, J. (2023). Machine Learning in Healthcare. Journal of AI Research.",
 *   "fromStyle": "apa",
 *   "toStyle": "ieee"
 * }
 */
export const convertCitation = async (req: Request, res: Response) => {
  const { citation, fromStyle, toStyle } = req.body;

  if (!citation || !fromStyle || !toStyle) {
    return res.status(400).json({
      error: "Missing required parameters: citation, fromStyle, toStyle",
    });
  }

  if (
    !["apa", "ieee"].includes(fromStyle) ||
    !["apa", "ieee"].includes(toStyle)
  ) {
    return res.status(400).json({
      error:
        'Invalid style. Use "apa" or "ieee" for both fromStyle and toStyle.',
    });
  }

  try {
    // In a real implementation, we would parse the citation
    // For simplicity, we'll assume we have a paper chunk object
    // This is a simplified demo - real implementation would need citation parsing

    // For demo purposes, create a fake paper chunk
    const fakeChunk = {
      title: "Machine Learning in Healthcare",
      authors: ["Smith, John", "Doe, Jane"],
      year: 2023,
      source: "Journal of AI Research",
      doi: "10.1234/abcd123",
    } as PaperChunk;

    const converted = formatCitation(fakeChunk, toStyle as "apa" | "ieee");

    res.json({
      success: true,
      original: {
        style: fromStyle,
        citation,
      },
      converted: {
        style: toStyle,
        citation: converted,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      error: "Citation conversion failed",
      details: err.message,
    });
  }
};

/**
 * Get all citation styles supported
 */
export const getSupportedStyles = async (req: Request, res: Response) => {
  res.json({
    success: true,
    styles: [
      {
        name: "APA",
        description: "American Psychological Association style",
        example:
          "Smith, J., & Doe, J. (2023). Machine Learning in Healthcare. Journal of AI Research.",
      },
      {
        name: "IEEE",
        description: "Institute of Electrical and Electronics Engineers style",
        example:
          '"Machine Learning in Healthcare," Journal of AI Research, 2023.',
      },
    ],
  });
};
