/**
 * normalizeGerman — normalize a typed answer for comparison.
 * Converts German special characters to ASCII equivalents so that
 * typed input using either proper characters or transliterations
 * both match the stored answer in either form.
 *
 * Safe direction: proper char → ASCII transliteration
 *   ä/Ä → ae, ö/Ö → oe, ü/Ü → ue, ß → ss
 *
 * This means normalizeAnswer("fünf") === normalizeAnswer("fuenf")
 *          normalizeAnswer("hei\u00dft") === normalizeAnswer("heisst")
 *          normalizeAnswer("muss") === normalizeAnswer("muss")  // ss NOT converted to ß
 *
 * Never do the reverse (ae→ä, ss→ß) as that introduces false matches
 * (e.g., "muss" → "muß" which is a different word).
 */
export function normalizeGerman(str) {
  return (str || '')
    .trim()
    .toLowerCase()
    .replace(/[.!?,;:]+$/, '')
    .replace(/\s+/g, ' ')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');
}
