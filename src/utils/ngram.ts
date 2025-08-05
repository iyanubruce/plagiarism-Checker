import natural from "natural";

const tokenizer = new natural.WordTokenizer();

export function preprocess(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getNGrams(text: string, n: number = 5): string[] {
  const cleaned = preprocess(text);
  const words = tokenizer.tokenize(cleaned);
  const ngrams: string[] = [];

  for (let i = 0; i <= words.length - n; i++) {
    ngrams.push(words.slice(i, i + n).join(" "));
  }

  return ngrams;
}
