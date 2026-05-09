# Phase 18B Revised: Replace Vocabulary Practice with Flashcards

## Plan

1. **PracticeHubPage.jsx** — Remove "Vocabulary Practice" card, reorder/keep everything else
2. **PracticePage.jsx** — Replace with a redirect/wrapper that sends users to flashcards 
3. **App.jsx** — Route `/level/:levelId/vocabulary/practice` → redirect to flashcards
4. **VocabularyPage.jsx** — Change "Practice" button to link to flashcards
5. **FlashcardPage.jsx** — Major upgrade: session size selector, noun-specific card types (article/plural/meaning), better queue with card type generation
6. **store.js** — Add or update card type generation + stable card IDs
7. **Tests** — Cover all the requirements
8. **Final report** — docs/PHASE18B_FLASHCARDS_FINAL_REPORT.md
9. **Commit + push**
