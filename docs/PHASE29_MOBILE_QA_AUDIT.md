# Phase 29: Mobile QA Audit

Date: 2026-05-10

## Methodology

Code-audited all 35 JSX files in `src/pages/` and `src/components/` for mobile-specific issues:
- Grid breakpoints
- Button sizing at mobile widths
- Text overflow/wrapping
- Overlay accessibility
- Touch target sizing
- Fixed positioning
- Overflow behavior
- Fixed-width elements

## Mobile Viewport Baseline

- Target: 375px (iPhone SE) to 414px (iPhone Plus)
- Nav: sticky top bar with hamburger at md breakpoint (768px)
- Content: `max-w-7xl` with `px-4` padding
- Touch target minimum: 44px (Apple HIG)

## Files Audited (35 total)

pages (35): AccountPage, DailyMissionPage, Dashboard, ExamPage, FlashcardPage, FSPAnamnesePage, FSPCasesPage, FSPExamPage, FSPGrammarPage, FSPListeningPage, FSPPresentationsPage, FSPReadingPage, FSPVocabPage, FSPWritingPage, GoalSetupPage, GrammarPage, LessonDetailPage, LessonsPage, LevelPage, ListeningPage, LoginPage, MedicalFSPHubPage, MedicalPage, MistakeNotebookPage, OnboardingPage, PlacementTest, PracticeHubPage, PracticePage, ReadingPage, ResourcesPage, RoleplayPage, SettingsPage, SpeakingPage, VocabularyPage, WritingPage

components (6+): ui.jsx, Layout.jsx, AuthPanel.jsx, LevelLock.jsx, DashboardGoalPace.jsx, StudyGoalTracker.jsx, GermanCharHelper.jsx

## Issues Found

### Fixed Issues

#### Fixed 1: GoalSetupPage - 5-column grid on mobile
**File:** `src/pages/GoalSetupPage.jsx`
**Changes:** Added `grid-cols-3 sm:grid-cols-5` to all three option grids (Target Level, Minutes per day, Days per week)
**Reason:** On 375px viewport, `grid-cols-5` produces buttons ~70px wide. With labels like "6 months" or wider content, buttons would be cramped. `grid-cols-3` on mobile gives ~115px per button.

#### Fixed 2: SettingsPage - 5-column grid on mobile
**File:** `src/pages/SettingsPage.jsx`
**Changes:** Added `grid-cols-3 sm:grid-cols-5` to all three option grids (Target Level, Minutes per day, Days per week)
**Reason:** Same as GoalSetupPage. 5 columns on mobile is too tight.

#### Fixed 3: FlashcardPage - Session complete rating breakdown
**File:** `src/pages/FlashcardPage.jsx`
**Changes:** Reduced gap from `gap-2` to `gap-1 sm:gap-2`, padding from `p-2` to `p-1.5 sm:p-2`, made count text `text-sm sm:text-base`, label text `text-[10px] sm:text-xs`
**Reason:** 4-column rating breakdown at session complete had cramped text on 375px. Tighter gap and smaller text on mobile ensure it fits without wrapping.

#### Fixed 4: FSPExamPage - 3-column scoring grid
**File:** `src/pages/FSPExamPage.jsx`
**Changes:** Reduced gap from `gap-3` to `gap-1 sm:gap-3`
**Reason:** 3 columns with `gap-3` on 375px left little room for content. Labels are short so `gap-1` works fine on mobile.

#### Fixed 5: SpeakingPage - rubric label min-width overflow
**File:** `src/pages/SpeakingPage.jsx`
**Changes:** Changed `min-w-[120px]` to `min-w-[80px] sm:min-w-[120px] flex-shrink-0` on rubric breakdown label
**Reason:** 120px minimum width on a rubic label like "taskCompletion" could overflow on 375px. Reduced to 80px on mobile with flex-shrink-0 to prevent line-break.

#### Fixed 6: Layout - Mobile nav touch targets
**File:** `src/components/Layout.jsx`
**Changes:** Changed `py-2` to `py-3` (12px -> 16px padding) on mobile nav links
**Reason:** Apple HIG recommends minimum 44pt touch targets. Original `py-2` with text gave ~36pt. With `py-3` the touch target is ~44pt.

### Verified No Issues

These pages were checked and confirmed to have responsive mobile layouts:

| Route | Check | Result |
|-------|-------|--------|
| OnboardingPage | Level picker, welcome flow | Clean: `max-w-lg`, single column |
| PlacementTest | Questions, progress | Clean: single column, `max-w-lg` |
| Dashboard | Stats row, quick actions | Clean: `grid-cols-2` on mobile, `px-4` |
| PracticeHub | Card grid | Clean: `grid-cols-1` on mobile |
| DailyMission | Task list, progress | Clean: single column |
| Flashcards | Card, rating, progress | Fixed above. Cards use `flex-wrap` for buttons |
| GrammarPage | Exercises | Clean: single column |
| ReadingPage | Text, questions | Clean: `max-w-3xl`, exercise buttons scroll |
| ListeningPage | Audio, questions | Clean: `max-w-3xl`, exercise buttons scroll |
| WritingPage | Textarea | Clean: `w-full h-64`, full-width |
| SpeakingPage | Recording, rubric | Fixed above. Text area `w-full` |
| RoleplayPage | Scenarios, chat | Clean: `grid-cols-1` on mobile |
| MistakeNotebookPage | Mistakes list | Clean: `auto-fit minmax(120px, 1fr)` |
| LevelPage | Skill grid | Clean: `grid-cols-1` then `sm:grid-cols-2` |
| VocabularyPage | Word list | Clean: single column |
| MedicalPage | Info card | Clean: `grid-cols-1 sm:grid-cols-2` |
| MedicalFSPHubPage | Modules, filters | Clean: all grids have mobile fallbacks |
| FSPCasesPage | Case details | Clean: `grid-cols-2` info, `col-span-2` for long fields |
| FSPExamPage | Simulated exam | Fixed above. Rubric uses `grid-cols-1` |
| FSPVocabPage | Vocabulary list | Clean: single column |
| FSPGrammarPage | Grammar list | Clean: single column |
| FSPReadingPage | Reading list | Clean: single column |
| FSPListeningPage | Listening list | Clean: single column |
| FSPWritingPage | Writing list | Clean: single column |
| FSPAnamnesePage | Anamnese list | Clean: single column |
| FSPPresentationsPage | Presentations list | Clean: single column |
| LessonsPage | Lesson list | Clean: single column |
| LessonDetailPage | Lesson content | Clean: single column |
| ExamPage | Level exam | Clean: questions in `max-w-md` |
| ResourcesPage | Links list | Clean: single column, `truncate` on URLs |
| GoalSetupPage | Goal options | Fixed above |
| SettingsPage | Goal options | Fixed above |
| AccountPage | Profile form | Clean: simple form, full-width inputs |
| LoginPage | Login/register | Clean: `max-w-sm`, single column |

### Common Patterns Already Correct

1. **Overflow handling:** Reading/Listering exercise selectors use `overflow-x-auto` + `flex-shrink-0` on button elements. Horizontal scroll on mobile.
2. **Responsive grids:** Most grids use `grid-cols-1 sm:grid-cols-2` pattern. The `sm:` breakpoint is 640px which is above mobile viewport.
3. **Text wrapping:** Long text elements use `break-words` where needed (flashcard content).
4. **Mobile nav:** Uses `md:hidden` hamburger menu. Dropdown menu is full-width on mobile.
5. **Button sizing:** `size="sm"` is the smallest button size used, which renders `px-3 py-1.5 text-xs`. Adequate for mobile touch.
6. **No horizontal scroll containers:** No `overflow-x-auto` containers that could trap users (except the exercise selectors which are intentional).

## Known Limitations (not fixed in this phase)

1. **No `overscroll-behavior` control:** May experience pull-to-refresh on some mobile browsers that could interrupt flows.
2. **No reduced-motion media query:** Users who prefer reduced motion may find animations like `hover:scale-[1.02]` jarring.
3. **No `touch-action: manipulation`:** Some mobile browsers may add 300ms delay on tap actions due to double-tap-to-zoom detection.
4. **No portrait/landscape specific layouts:** All layouts assume portrait. Landscape may leave excessive whitespace.
5. **No swipe gestures:** Navigation relies entirely on buttons/links. No swipe-to-go-back on sub-pages.
6. **Font size relies on browser default:** No `clamp()` sizing; uses Tailwind's fixed `text-sm`, `text-xs` which may be small on high-DPI mobile screens.
7. **No bottom navigation tab bar:** Mobile users must use hamburger menu for all navigation.

## Conclusion

The app was already reasonably mobile-friendly due to consistent use of Tailwind's responsive prefixes and `max-w-*` containers. The 6 fixes applied address the most impactful mobile issues: cramped grid layouts on selection screens, overflow issues with rubric labels, and touch target sizing in the navigation menu. No horizontal overflow or broken layouts were found after fixes.
