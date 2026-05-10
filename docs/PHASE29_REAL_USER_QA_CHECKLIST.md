# Phase 29: Real User QA Checklist

Date: 2026-05-10

## How to Use

Test each flow on a **physical mobile device** (iPhone SE/12/14 or Android equivalent at 375px-414px width).
Use **Safari** and **Chrome** on mobile.
Also test on desktop at 375px viewport via DevTools.

Mark each test as PASS/FAIL/NOT_TESTED.

---

## 1. Fresh User Onboarding

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 1.1 | Open app on mobile for the first time | OnboardingPage loads, responsive layout, no overflow | |
| 1.2 | Tap "I know my level" | Level picker shows 5 levels in a vertical list | |
| 1.3 | Tap "A1" level | Navigates to /goal-setup | |
| 1.4 | On goal-setup: all 3 option grids (level, minutes, days) show 3 columns on mobile | `grid-cols-3` with readable button labels | |
| 1.5 | Select target level = B1, minutes = 15m, days = 5x | Buttons highlight correctly | |
| 1.6 | Tap "Set Goals" | Navigates to onboarding flow | |
| 1.7 | Tap "Take placement test" instead of picking level | Navigates to /placement-test, questions render correctly | |
| 1.8 | Complete placement test (all correct) | Shows result, navigates to correct level | |

## 2. Dashboard

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 2.1 | Dashboard loads on mobile | 2-column stat cards (Streak, Level, Completed, Exams, Days, Hours) | |
| 2.2 | Stat card text is readable | All labels fit in `text-xs` without overflow | |
| 2.3 | Scroll down to "Today's Plan" section | Plan items render in single column | |
| 2.4 | Tap any skill card (e.g. Grammar) | Navigates to correct page | |
| 2.5 | Quick action links are tappable | Touch targets are at least 44px | |

## 3. Practice Hub

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 3.1 | /practice loads on mobile | Cards in `grid-cols-1`, each full-width | |
| 3.2 | Scroll through all cards | Cards have adequate padding and spacing | |
| 3.3 | Tap "Conversation Practice" card | Navigates to /conversation | |
| 3.4 | Tap "FSP Hub" card | Navigates to /fsp-hub | |
| 3.5 | Tap "Flashcards" card | Navigates to flashcard page | |

## 4. Navigation

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 4.1 | Hamburger menu icon visible on mobile | 3-line menu icon in top nav | |
| 4.2 | Tap hamburger menu | Full-screen menu slides down with nav links | |
| 4.3 | Each nav link has adequate touch target (44px min) | Links with `py-3` vertical padding, ~44px touch target | |
| 4.4 | Level selector in nav works | Dropdown changes level | |
| 4.5 | Tap a nav item | Menu closes, navigates to route | |
| 4.6 | Back button on sub-pages | `< Back` links visible and tappable | |

## 5. Today's Plan (Daily Mission)

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 5.1 | /level/{level}/daily loads on mobile | Single column task list | |
| 5.2 | Task items have readable labels | No text truncation or overflow | |
| 5.3 | Check off a task | Checkbox updates, progress changes | |
| 5.4 | Complete all tasks in a session | Session complete state renders | |

## 6. Flashcards

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 6.1 | Flashcards mode selector (level, card type, medical filter) | All filter controls visible and tappable on mobile | |
| 6.2 | Start session | Card renders in center, clickable | |
| 6.3 | Tap flashcard to flip | Flips to show answer | |
| 6.4 | Rating buttons visible after flip | 4 buttons show below card: Again, Hard, Good, Easy | |
| 6.5 | Buttons are tappable on mobile | Each button ~70px+ wide, no overlap | |
| 6.6 | Rate a card "Good" | Card advances, progress updates | |
| 6.7 | Session complete screen | Rating breakdown with 4 columns fits on 375px | |
| 6.8 | Start new session | New session begins | |

## 7. Grammar Practice

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 7.1 | Grammar page loads on mobile | Exercise selectors scroll horizontally | |
| 7.2 | Exercise content fits | Text areas and options are full-width | |
| 7.3 | Submit answer | Shows correct/incorrect feedback | |
| 7.4 | All exercises scrollable | Horizontal scroll for exercise numbers works | |

## 8. Reading Practice

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 8.1 | Reading page loads on mobile | Text is full-width, readable | |
| 8.2 | Back to level link visible | `< Back` link at top | |
| 8.3 | Exercise selector scrolls horizontally | Number buttons with `overflow-x-auto` | |
| 8.4 | Tap "All correct" option | Green highlight on correct answer | |
| 8.5 | Submit | Progress updates | |

## 9. Listening Practice

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 9.1 | Listening page loads on mobile | Audio player renders | |
| 9.2 | Play audio button tappable | Visible and responsive | |
| 9.3 | Answer input visible | Full-width input | |
| 9.4 | Submit answer | Feedback renders | |

## 10. Writing Practice

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 10.1 | Writing page loads on mobile | Full-width textarea | |
| 10.2 | Type text in textarea | 256px height (h-64) adequate for typing | |
| 10.3 | German character helper buttons visible | Buttons below textarea, not cut off | |
| 10.4 | Tap "Submit" without typing | Shows validation message (minimum 10 chars) | |
| 10.5 | Write 10+ characters, submit | Shows AI correction or manual checklist | |
| 10.6 | AI feedback visible (if enabled) | Feedback content is scrollable, no overflow | |

## 11. Speaking Practice

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 11.1 | Speaking page loads on mobile | Textarea or recording UI visible | |
| 11.2 | Type response in textarea | Full-width, adequate height | |
| 11.3 | Submit response | Shows feedback | |
| 11.4 | Rubric breakdown renders on mobile | Labels don't overflow (fixed `min-w-[80px]`) | |

## 12. Conversation Roleplay

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 12.1 | /conversation loads on mobile | Scenario cards in single column | |
| 12.2 | Level filter works | Filters by level | |
| 12.3 | Type filter works | Filters by type (everyday/FSP) | |
| 12.4 | Tap a scenario | Opens scenario with scenario description and user role | |
| 12.5 | Type response in textarea | Full-width textarea | |
| 12.6 | Submit for AI feedback | Feedback renders in chat format | |
| 12.7 | Manual fallback mode | Checklist checkboxes + score slider visible | |
| 12.8 | Self-score slider works | Drag/thumbs work on mobile touch | |
| 12.9 | Submit manual feedback | Result saves, progress updates | |

## 13. Mistake Notebook

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 13.1 | /mistakes loads on mobile | Single column mistake list | |
| 13.2 | Filter controls (level, skill) | Dropdowns/buttons work on mobile | |
| 13.3 | Expand a mistake card | Details show without page shift | |
| 13.4 | Mark mistake as mastered | Card updates | |
| 13.5 | Clear filter | All mistakes shown | |

## 14. FSP Hub

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 14.1 | /fsp-hub loads on mobile | Module list in single column | |
| 14.2 | Progress cards fit | 3-column stats grid shows on mobile | |
| 14.3 | Expand a module | Module contents show | |
| 14.4 | Tap module lesson link | Navigates to lesson page | |
| 14.5 | Specialty filter works | Filter buttons responsive | |
| 14.6 | Quick actions (exam, cases) | Buttons tappable on mobile | |

## 15. FSP Case Practice

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 15.1 | FSP cases page loads on mobile | Case list in single column | |
| 15.2 | Expand a case | Patient info in grid-cols-2, fields use col-span-2 for long text | |
| 15.3 | Red flags section visible | Red background, readable | |
| 15.4 | "Practice" button tappable | Navigates to case practice | |

## 16. FSP Exam (Mock)

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 16.1 | FSP exam page loads on mobile | Exam controls visible | |
| 16.2 | Exam scoring shows 3 columns on mobile | Anamnese/Arztbrief/Uebergabe at `gap-1` fits | |
| 16.3 | Submit exam | Results visible, no overflow | |

## 17. Level Page

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 17.1 | /level/{id} loads on mobile | Skill modules in single column | |
| 17.2 | Skill card renders | Icon + label + desc + progress + chevron all fit | |
| 17.3 | Exam section (if unlocked) | Requirements list readable | |
| 17.4 | Missing requirements (if locked) | Red card with requirements in responsive grid | |

## 18. Settings / Account

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 18.1 | /settings loads on mobile | Options page shows correctly | |
| 18.2 | Goal option grids show 3 columns on mobile | `grid-cols-3 sm:grid-cols-5` | |
| 18.3 | Account page loads | Profile form full-width | |
| 18.4 | Cloud sync panel visible (if logged in) | Panel doesn't overflow | |
| 18.5 | Logout button tappable | Visible and working | |

## 19. Cloud Sync & Cross-Device

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 19.1 | Log in on mobile | Auth shows success | |
| 19.2 | Complete an exercise (e.g. grammar) on mobile | Progress saved to cloud | |
| 19.3 | Log in on desktop (same account) | Progress reflects mobile session | |
| 19.4 | Complete an exercise on desktop | Progress appears on mobile after refresh | |
| 19.5 | Toggle cloud sync off/on | Settings persist correctly | |

## 20. Reset & Error States

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 20.1 | Clear app data (localStorage) | App reinitializes to onboarding | |
| 20.2 | Navigate to unknown route | 404 or error page renders, no crash | |
| 20.3 | Cloud sync fails (airplane mode) | Graceful fallback to local storage | |
| 20.4 | AI correction unavailable | Writing/Speaking/Roleplay show manual mode | |
| 20.5 | Refresh mid-session (flashcards, writing, exam) | State is preserved or recovers gracefully | |

## 21. Mobile Browser Tests

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 21.1 | Test in Safari on iOS | All flows render correctly | |
| 21.2 | Test in Chrome on Android | All flows render correctly | |
| 21.3 | Test in mobile browser private/incognito | Works, no localStorage issues | |
| 21.4 | Test in landscape orientation | Content is readable (not distorted) | |
| 21.5 | Test with browser zoom at 150% | Text reflows, no horizontal scroll | |

## 22. Performance & Stability

| # | Test | Expected | PASS/FAIL |
|---|------|----------|-----------|
| 22.1 | Page load on slow 3G (throttled) | Page is interactive within 10s | |
| 22.2 | Rapid navigation between 5+ pages | No memory issues or crashes | |
| 22.3 | Large flashcard session (50 cards) | Rating buttons remain responsive | |
| 22.4 | Switch tabs on mobile and return | App state is preserved | |
| 22.5 | Keyboard dismiss on text input | UI doesn't jump on keyboard close | |

## Summary

| Section | Tests | Passed | Failed | Not Tested |
|---------|-------|--------|--------|------------|
| 1. Fresh Onboarding | 8 | | | |
| 2. Dashboard | 5 | | | |
| 3. Practice Hub | 5 | | | |
| 4. Navigation | 6 | | | |
| 5. Today's Plan | 4 | | | |
| 6. Flashcards | 8 | | | |
| 7. Grammar | 4 | | | |
| 8. Reading | 5 | | | |
| 9. Listening | 4 | | | |
| 10. Writing | 6 | | | |
| 11. Speaking | 4 | | | |
| 12. Conversation | 9 | | | |
| 13. Mistake Notebook | 5 | | | |
| 14. FSP Hub | 6 | | | |
| 15. FSP Cases | 4 | | | |
| 16. FSP Exam | 3 | | | |
| 17. Level Page | 4 | | | |
| 18. Settings | 5 | | | |
| 19. Cloud Sync | 5 | | | |
| 20. Reset & Error | 5 | | | |
| 21. Mobile Browser | 5 | | | |
| 22. Performance | 5 | | | |
| **Total** | **116** | | | |
