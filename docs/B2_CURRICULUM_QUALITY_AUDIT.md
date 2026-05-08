# B2 Curriculum Quality Audit

## Overview
This audit documents the quality assessment of the B2 German curriculum for the Deutsch-Klinik platform. B2 represents the upper-intermediate level focusing on complex grammar structures, formal communication, and abstract topics relevant to medical and professional contexts.

## Current State (Pre-Enrichment)

### B2 Lessons: 25 total
- **conceptId**: 0/25 assigned
- **estimatedMinutes**: 0/25 set
- **prerequisiteConceptIds**: 0/25 defined
- **conceptsTaught**: 0/25 defined
- **commonMistakes**: 0 lessons have structured mistakes (avg 0 per lesson)
- **formsTable**: 0 lessons have grammar tables
- **miniDrills**: 0 lessons have drills
- **trackTags**: 0/25 tagged
- **lessonDepthVersion**: 0/25 set
- **linkedQuestionIds**: 0/25 linked
- **Examples per lesson**: 4-5 (target: 10-12)

### B2 Grammar: 246 items
- **conceptId**: 0/246 assigned
- **difficulty**: 0/246 set
- **skillType**: 0/246 set
- **taughtInLessonId**: 80/246 assigned (166 unassigned)
- Wrong or inconsistent lesson assignments exist (e.g., Advanced Passive items assigned to B2_lesson_24 instead of B2_lesson_1)

### B2 Reading: 50 items
- **conceptId**: 0/50 assigned
- **taughtInLessonId**: 0/50 set
- **requiredConcepts**: 0/50 defined

### B2 Listening: 50 items
- **conceptId**: 0/50 assigned
- **taughtInLessonId**: 0/50 set
- **requiredConcepts**: 0/50 defined

### B2 Writing: 50 items
- **conceptId**: 0/50 assigned
- **taughtInLessonId**: 0/50 set
- **rubrics**: 40/50 have rubrics (items 11-50), 0/50 have checklists
- **requiredConcepts**: 0/50 defined

### B2 Speaking: 50 items
- **conceptId**: 0/50 assigned
- **taughtInLessonId**: 0/50 set
- **rubrics**: 0/50 have rubrics
- **requiredConcepts**: 0/50 defined

### B2 Vocabulary: 1071 items
- Plural forms exist but not audited for correctness
- **lessonId**: assigned

### Curriculum Map: 264 B2 entries
- conceptIds are stub values (e.g., `b2_lesson_1` instead of meaningful conceptIds)
- requiredConcepts: all empty `[]`
- tags: all empty `[]`

## Quality Gaps Summary

| Data Category | Items | Missing conceptId | Missing taughtInLessonId | Missing requiredConcepts |
|--------------|-------|-------------------|------------------------|------------------------|
| Lessons | 25 | 25 | N/A | 25 |
| Grammar | 246 | 246 | 166 | N/A |
| Reading | 50 | 50 | 50 | 50 |
| Listening | 50 | 50 | 50 | 50 |
| Writing | 50 | 50 | 50 | 50 |
| Speaking | 50 | 50 | 50 | 50 |

## Topic-Grammar Alignment Issues

Current grammar topics cover B2 structures but are not aligned to 25 lessons. Major grammar topics:
- Advanced Passive (9 items) - should map to Lesson 1
- Zustandspassiv (5 items) - should map to Lesson 1
- Subjunctive I (6 items) - should map to Lesson 8
- Subjunctive II (22 items) - review content
- Relative Clauses (16 items) - should map to Lesson 7
- Connectors (12 items) - should map to Lesson 6
- Nominalization (6 items) - should map to Lesson 5
- Passive with Modals (6 items) - should map to Lesson 5
- Modal Verb Meanings (6 items) - should map to Lesson 4
- Verb Fixed Prepositions (6 items) - should map to Lesson 3
- Prepositional Adverbs (12 items) - should map to Lesson 3

## Recommendations

1. Assign meaningful conceptIds to all 25 lessons
2. Add estimatedMinutes (45-60) to all lessons
3. Define prerequisiteConceptIds using B1 conceptIds
4. Add 4-5 structured commonMistakes per lesson
5. Add 1-2 formsTable entries per grammar-focused lesson
6. Add 4-6 miniDrills per lesson
7. Add trackTags with exam tags (goethe, telc, ösd)
8. Expand examples to 10-12 per lesson
9. Link grammar items to correct lessons via taughtInLessonId
10. Add conceptId, difficulty, skillType to all grammar items
11. Add conceptId, taughtInLessonId, requiredConcepts to all reading/listening/writing/speaking
12. Add rubrics to writing/speaking items
13. Update curriculum map with meaningful conceptIds and requiredConcepts
