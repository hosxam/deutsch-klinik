# Phase 14: UI Polish Audit

**Date:** 2026-05-08
**Status:** Baseline for Phase 14

## Current State

The app went through 13 phases adding A1-C1 curriculum, FSP, onboarding, Supabase, Cloudflare AI, and data splitting. UI has been functional but not polished. Styling uses inline styles with CSS variables defined in `<style>` tags in the HTML shell.

## Inconsistencies Found

### 1. Layout
- Pages use different padding: some use `px-4 py-8`, others `px-6 py-6`, some `px-3 py-4`
- No consistent `PageShell` or shared wrapper
- `max-w-lg` vs `max-w-2xl` vs `max-w-4xl` vs no max-width
- Background colors vary: `#060912`, `#0a0e1a`, `var(--bg-page)`, `var(--bg-card)`

### 2. Cards
- Multiple card styles: `rounded-xl p-5 mb-4` with `var(--bg-card)` and `1px solid var(--border)`
- Some have hover effects, some don't
- No consistent card component
- FSP pages have their own card styles

### 3. Headers
- Page titles vary: some use `h1 text-2xl font-bold`, others `h2 text-lg font-semibold`
- No consistent `SectionHeader` component
- Some pages have back buttons, some don't
- FSP hub uses `mt-12` which centers poorly on mobile

### 4. Buttons
- Multiple button patterns: `py-2.5 rounded-lg font-semibold text-sm`
- Some use `var(--accent)` background, some use hardcoded `#00f0ff`
- Danger buttons use `#ff3355`
- Inconsistent hover states
- No shared `Button` component

### 5. Loading States
- `Loading()` component exists in App.jsx with animated dots
- Most pages have no loading/error state for their data fetches
- DailyMissionPage has a basic "Loading..." text fallback
- No skeleton/shimmer loading pattern

### 6. Empty States
- Most pages have no empty state at all
- If a level has no items, the page just shows nothing or breaks
- No "Nothing to review" or "All complete" messages
- Flashcards have the most empty-state handling (showing stats)

### 7. Dashboard
- Uses flex-wrap cards with no clear hierarchy
- No progress ring for overall completion
- Weak area card is text-heavy
- Exam readiness is a small inline element
- FSP card only shows if targetLevel is FSP (reasonable but plain)
- No "start today's practice" CTA
- No streak visualization
- No estimated finish date progress bar

### 8. DailyMissionPage
- Very long page (2600+ lines)
- No section headers
- Grammar/vocab lessons appear as simple lists
- Reading/listening/writing/speaking sections are minimal
- AI states inline without good UX
- No completion celebration

### 9. Flashcards
- Basic card flip with click
- Again/Hard/Good/Easy buttons are plain
- No progress ring/bar during review
- No due/new/review counts visible
- Mobile layout is functional but not polished

### 10. MistakeNotebookPage
- Dense filter layout
- Mistake cards are text-heavy
- Convert-to-flashcard button is small
- No visual skill categorization
- No resolved/unresolved visual state

### 11. Onboarding/Placement/GoalSetup
- OnboardingPage has 3 paths as text+icon buttons
- PlacementTest has long scroll with inline questions
- GoalSetup is the most polished but still plain
- No progress indicator across the flow
- Results screen is basic

### 12. FSP Pages
- Hub page has 20 card grid (good) but cards are text-only
- No visual category icons
- FSP case pages are dense tables
- Anamnesis/vocab pages are plain card lists
- Speaking/writing pages lack polish

### 13. Level Navigation
- Level cards in LevelPage are text-heavy
- No visual progression (level circle/ring)
- Locked/unlocked states use simple lock icon
- Exam readiness is text inline

### 14. Animations
- No page transitions
- No card hover effects (except a few)
- No progress animation
- No completion feedback
- Only SettingsPage has `hover:scale-[1.005]`

### 15. Mobile
- Most pages work at mobile widths
- Dashboard cards stack vertically (good)
- But tables (FSP cases, vocab lists) overflow on small screens
- No mobile-specific navigation tweaks
- Touch targets are adequate but not optimized

## Priority Fixes

1. Create shared component library (PageShell, SectionHeader, StatCard, Button, Badge)
2. Polish Dashboard as main control center
3. Polish DailyMissionPage (loading states, sections, completion)
4. Polish Flashcards (progress, buttons, mobile)
5. Polish onboarding flow (steps, progress, result)
6. Polish FSP pages (cards, icons, layout)
7. Polish Mistakes page (filters, states, CTAs)
8. Add page transitions
9. Add skeleton loading states
10. Mobile refinement
