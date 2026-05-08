-- ============================================================
-- Deutsch Klinik - Row Level Security Policies
-- Run this AFTER schema.sql in Supabase SQL Editor.
-- ============================================================

-- -----------------------------------------------------------
-- PROFILES
-- -----------------------------------------------------------
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = user_id);

create policy "Users can delete own profile"
  on profiles for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------
-- USER SETTINGS
-- -----------------------------------------------------------
alter table user_settings enable row level security;

create policy "Users can view own user_settings"
  on user_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert own user_settings"
  on user_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own user_settings"
  on user_settings for update
  using (auth.uid() = user_id);

create policy "Users can delete own user_settings"
  on user_settings for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------
-- USER PROGRESS
-- -----------------------------------------------------------
alter table user_progress enable row level security;

create policy "Users can view own user_progress"
  on user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own user_progress"
  on user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own user_progress"
  on user_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own user_progress"
  on user_progress for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------
-- LESSON PROGRESS
-- -----------------------------------------------------------
alter table lesson_progress enable row level security;

create policy "Users can view own lesson_progress"
  on lesson_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own lesson_progress"
  on lesson_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own lesson_progress"
  on lesson_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own lesson_progress"
  on lesson_progress for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------
-- DAILY SESSIONS
-- -----------------------------------------------------------
alter table daily_sessions enable row level security;

create policy "Users can view own daily_sessions"
  on daily_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own daily_sessions"
  on daily_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own daily_sessions"
  on daily_sessions for update
  using (auth.uid() = user_id);

create policy "Users can delete own daily_sessions"
  on daily_sessions for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------
-- MISTAKES
-- -----------------------------------------------------------
alter table mistakes enable row level security;

create policy "Users can view own mistakes"
  on mistakes for select
  using (auth.uid() = user_id);

create policy "Users can insert own mistakes"
  on mistakes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own mistakes"
  on mistakes for update
  using (auth.uid() = user_id);

create policy "Users can delete own mistakes"
  on mistakes for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------
-- FLASHCARDS
-- -----------------------------------------------------------
alter table flashcards enable row level security;

create policy "Users can view own flashcards"
  on flashcards for select
  using (auth.uid() = user_id);

create policy "Users can insert own flashcards"
  on flashcards for insert
  with check (auth.uid() = user_id);

create policy "Users can update own flashcards"
  on flashcards for update
  using (auth.uid() = user_id);

create policy "Users can delete own flashcards"
  on flashcards for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------
-- FLASHCARD REVIEWS
-- -----------------------------------------------------------
alter table flashcard_reviews enable row level security;

create policy "Users can view own flashcard_reviews"
  on flashcard_reviews for select
  using (auth.uid() = user_id);

create policy "Users can insert own flashcard_reviews"
  on flashcard_reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update own flashcard_reviews"
  on flashcard_reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete own flashcard_reviews"
  on flashcard_reviews for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------
-- EXAM ATTEMPTS
-- -----------------------------------------------------------
alter table exam_attempts enable row level security;

create policy "Users can view own exam_attempts"
  on exam_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert own exam_attempts"
  on exam_attempts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own exam_attempts"
  on exam_attempts for update
  using (auth.uid() = user_id);

create policy "Users can delete own exam_attempts"
  on exam_attempts for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------
-- WRITING ATTEMPTS
-- -----------------------------------------------------------
alter table writing_attempts enable row level security;

create policy "Users can view own writing_attempts"
  on writing_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert own writing_attempts"
  on writing_attempts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own writing_attempts"
  on writing_attempts for update
  using (auth.uid() = user_id);

create policy "Users can delete own writing_attempts"
  on writing_attempts for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------
-- SPEAKING ATTEMPTS
-- -----------------------------------------------------------
alter table speaking_attempts enable row level security;

create policy "Users can view own speaking_attempts"
  on speaking_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert own speaking_attempts"
  on speaking_attempts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own speaking_attempts"
  on speaking_attempts for update
  using (auth.uid() = user_id);

create policy "Users can delete own speaking_attempts"
  on speaking_attempts for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------
-- FSP PROGRESS
-- -----------------------------------------------------------
alter table fsp_progress enable row level security;

create policy "Users can view own fsp_progress"
  on fsp_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own fsp_progress"
  on fsp_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own fsp_progress"
  on fsp_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own fsp_progress"
  on fsp_progress for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------
-- SYNC METADATA
-- -----------------------------------------------------------
alter table sync_metadata enable row level security;

create policy "Users can view own sync_metadata"
  on sync_metadata for select
  using (auth.uid() = user_id);

create policy "Users can insert own sync_metadata"
  on sync_metadata for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sync_metadata"
  on sync_metadata for update
  using (auth.uid() = user_id);

create policy "Users can delete own sync_metadata"
  on sync_metadata for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------
-- PLACEMENT RESPONSES
-- -----------------------------------------------------------
alter table placement_responses enable row level security;

create policy "Users can view own placement_responses"
  on placement_responses for select
  using (auth.uid() = user_id);

create policy "Users can insert own placement_responses"
  on placement_responses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own placement_responses"
  on placement_responses for update
  using (auth.uid() = user_id);

create policy "Users can delete own placement_responses"
  on placement_responses for delete
  using (auth.uid() = user_id);
