import { PaperChunk } from "../types";

export function formatCitation(
  chunk: PaperChunk,
  style: "apa" | "ieee" = "apa"
): string {
  // Fallback to title if no authors
  const authors =
    chunk.authors && chunk.authors.length > 0
      ? chunk.authors
      : [chunk.title.substring(0, 30) + "..."];

  const year = chunk.year ? chunk.year : new Date().getFullYear();
  const title = chunk.title;
  const source = chunk.source || "Unknown Publication";
  const doi = chunk.doi ? ` https://doi.org/${chunk.doi}` : "";

  if (style === "apa") {
    // APA: Author, A. A. (Year). Title. Source.
    const authorStr = formatAuthorsAPA(authors);
    return `${authorStr} (${year}). ${capitalize(title)}. ${source}.${doi}`;
  } else {
    // IEEE: #] A. Author, "Title," Source, year.
    const authorStr = formatAuthorsIEEE(authors);
    return `"${title}," ${source}, ${year}.${doi}`;
  }
}

function formatAuthorsAPA(authors: string[]): string {
  if (authors.length === 0) return "";

  // Convert to "Last, F., & Last, F." format
  const formatted = authors.map((name) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    const lastName = parts.pop()!;
    const initials = parts.map((p) => p[0] + ".").join("");
    return `${lastName}, ${initials}`;
  });

  if (formatted.length > 5) {
    return `${formatted.slice(0, 5).join(", ")}, ...`;
  }

  return formatted.join(", ");
}

function formatAuthorsIEEE(authors: string[]): string {
  if (authors.length === 0) return "";

  // Convert to "A. Author" format
  return authors
    .map((name) => {
      const parts = name.trim().split(/\s+/);
      if (parts.length === 1) return parts[0];
      const lastName = parts.pop()!;
      const initial = parts[0][0] + ".";
      return `${initial} ${lastName}`;
    })
    .join(", ");
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
