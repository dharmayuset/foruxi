/**
 * Parse a page-range expression like "1, 3-5, 8" into a sorted, de-duplicated
 * 1-indexed page list. Validates against the document's `totalPages`.
 *
 * Throws an Error with a friendly message if the input is invalid.
 */
export function parsePageRanges(input: string, totalPages: number): number[] {
  const trimmed = input.trim();
  if (!trimmed) throw new Error('Please enter a page range, e.g. "1, 3-5, 8".');

  const pages = new Set<number>();

  for (const raw of trimmed.split(',')) {
    const part = raw.trim();
    if (!part) continue;

    if (part.includes('-')) {
      const [aStr, bStr] = part.split('-').map((s) => s.trim());
      const a = Number(aStr);
      const b = Number(bStr);
      if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < 1) {
        throw new Error(`Invalid range: "${part}".`);
      }
      const [lo, hi] = a <= b ? [a, b] : [b, a];
      if (hi > totalPages) {
        throw new Error(`Page ${hi} is beyond this document (${totalPages} pages).`);
      }
      for (let i = lo; i <= hi; i++) pages.add(i);
    } else {
      const n = Number(part);
      if (!Number.isInteger(n) || n < 1) throw new Error(`Invalid page: "${part}".`);
      if (n > totalPages) {
        throw new Error(`Page ${n} is beyond this document (${totalPages} pages).`);
      }
      pages.add(n);
    }
  }

  if (pages.size === 0) throw new Error('No valid pages selected.');
  return [...pages].sort((a, b) => a - b);
}
