# Data Policy

## Grammar Exercise IDs

Grammar exercise IDs (e.g. `A1_gr_1`, `B2_gr_145`) are **stable persistent identifiers** used across multiple localStorage paths.

### Where IDs Are Stored

| localStorage Path | Key Pattern | Example |
|---|---|---|
| `grammarMastery` | Direct key | `{ "A1_gr_1": { correct: 3, incorrect: 0, mastered: true } }` |
| `levels[level].grammar[]` | `exerciseId` field on each entry | `{ date: "...", exerciseId: "A1_gr_1", ... }` |
| `repeatedMistakes` | Compound key: `level_exerciseId` | `{ "A1_A1_gr_1": { topic: "...", count: 2 } }` |
| `mistakeNotebook` | Embedded in key | `"A1_A1_gr_1_1743768123456"` |

### Rules

1. **Never change or renumber existing IDs.** Doing so orphans saved progress in all four storage paths above.
2. **Numeric gaps are acceptable.** The A1 set has a gap between IDs 20 and 121. This causes no UI or functional issues because IDs are treated as opaque strings throughout the app.
3. **New exercises** should receive a new unique ID at the end of the relevant level's current range (e.g. if A1 ends at `A1_gr_313`, the next ID is `A1_gr_314`).
4. **Do not reuse old IDs** for different content, even if the original exercises were deleted. The old ID may still exist in a user's localStorage.
5. **Renumbering requires a migration map** that updates all four localStorage paths simultaneously. Do not renumber without writing and testing that migration first.

### Why JSON Key Comments Don't Work

JSON format does not support comments. This document serves as the authoritative reference instead.
