# User Testing Regression Report

Date: 2026-05-06

## Login / Cloud Sync

- Verified: the app has a Supabase-backed sync panel, but cloud sync depends on environment configuration.
- Regression risk: when sync is not configured, a login-style panel can make local progress feel broken.
- Fix direction: show local mode clearly and keep the app usable without cloud sync.

## Study Goal Is Not Adaptive

- Verified: the goal tracker accepted a target date and daily minutes, but several plan calculations depended on a date.
- Regression: a learner choosing Medical FSP, full mastery, and 90 minutes/day did not get a visibly larger daily plan or predicted finish date.
- Fix direction: make goal date optional, predict finish date from remaining work and daily minutes, and scale daily tasks by 15/30/60/90 minute plans.

## Writing AI Flow

- Verified: Cloudflare Worker AI integration exists and writing uses automatic correction when available.
- Regression risk: copy-prompt fallback must stay backup only.
- Fix direction: keep Worker-first behavior and structured fallback.

## Speaking AI Flow

- Verified: speaking supports typed transcript, recording, browser speech recognition fallback, and Cloudflare Worker feedback.
- Regression risk: transcription must not dead-end when unavailable.
- Fix direction: keep typed transcript and structured feedback as completion paths.

## Mistake Notebook

- Verified: mistake state exists for incorrect answers, repeated mistakes, topic weakness, and review.
- Regression: Mark as mastered used fragile filtered-array indexes.
- Regression: vocabulary mistakes were tracked as spaced-repetition misses but were not always visible as notebook mistakes.
- Fix direction: remove mistakes by stable exercise/date metadata and record vocabulary misses as vocab mistakes.

## Weak Topics

- Verified: weak topics are listed from topic weakness.
- Regression: actions were too generic.
- Fix direction: provide practice, recommended lesson, and filtered mistake review actions.

## Vocab Review

- Verified: Vocab Review used due-word logic.
- Regression: default review could expose thousands of words and Knew it did not visibly advance the queue.
- Fix direction: filter to current level due/weak/recent-mistake words and remove reviewed cards from the visible queue.

## Flashcard Plan

- Verified: flashcards update vocabulary mastery and level vocabulary progress on the standalone page.
- Regression: daily plan did not include flashcards.
- Fix direction: include flashcards when due, weak, mistake-driven, full mastery, or Medical FSP repetition is relevant.

## Dashboard / Navigation Crowding

- Verified: top navigation showed every level as a separate link.
- Regression: the nav became noisy on desktop and mobile.
- Fix direction: keep Dashboard prominent, use a level selector, and group Practice, Review, FSP, Resources, and Settings/Goal.

## Curriculum Gap

- Verified: lessons, grammar curriculum, questions, and remediation exist as separate pieces.
- Regression: there is no universal question-to-lesson concept map across A1-C1/FSP.
- Fix direction: add a concept-tag framework and pilot one A1 grammar module before scaling.
