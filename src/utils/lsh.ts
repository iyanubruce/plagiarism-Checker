import { getNGrams } from "./ngram";

export function simHash(ngrams: string[], hashBits: number = 32): string {
  const vector = new Array(hashBits).fill(0);

  ngrams.forEach((gram) => {
    let hash = 0;
    for (const char of gram) {
      hash =
        (char.charCodeAt(0) + (hash << 6) + (hash << 16) - hash) & 0xffffffff;
    }

    for (let i = 0; i < hashBits; i++) {
      if (hash & (1 << i)) {
        vector[i]++;
      } else {
        vector[i]--;
      }
    }
  });

  return vector.map((v) => (v >= 0 ? "1" : "0")).join("");
}

export function hammingDistance(a: string, b: string): number {
  if (a.length !== b.length) return Infinity;
  let distance = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) distance++;
  }
  return distance;
}
