export function jaccardSimilarity(arrA: string[], arrB: string[]): number {
  const setA = new Set(arrA);
  const setB = new Set(arrB);

  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;

  return union === 0 ? 0 : intersection / union;
}
