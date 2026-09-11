export function tasteMatchScore(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  const shared = [...setA].filter((slug) => setB.has(slug)).length;
  const union = new Set([...setA, ...setB]).size;
  return Math.round((shared / union) * 100);
}
