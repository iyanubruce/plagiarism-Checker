import { PaperDatabase } from "../database/PaperDatabase";
import { formatCitation } from "../utils/citationFormatter";
import { PaperChunk } from "../types";
import {
  GetCitationParams,
  GetCitationQuery,
  ConvertCitationInput,
} from "../validations/citation";

const db = new PaperDatabase();

export const getCitationController = async (data: {
  id: string;
  style?: string;
}) => {
  const { id: paperId, style = "apa" } = data;

  const chunks = db.getChunksForPaper(paperId);

  if (chunks.length === 0) {
    throw new Error("Paper not found");
  }

  const chunk = chunks[0]; // First chunk has the metadata
  const citation = formatCitation(chunk, style as "apa" | "ieee");

  return {
    success: true,
    paperId,
    title: chunk.title,
    citation: {
      style,
      formatted: citation,
    },
  };
};

export const convertCitationController = async (
  input: ConvertCitationInput,
) => {
  const { title, authors, year, source, doi, fromStyle, toStyle } = input;

  const citation = {
    title,
    authors,
    year,
    source,
    doi,
  } as PaperChunk;

  const converted = formatCitation(citation, toStyle as "apa" | "ieee");

  return {
    success: true,
    original: {
      style: fromStyle,
      citation,
    },
    converted: {
      style: toStyle,
      citation: converted,
    },
  };
};

export const getSupportedStylesController = async () => {
  return {
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
  };
};
