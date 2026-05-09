-- ============================================================
-- Deutsch Klinik - Complete Supabase Schema
-- Run this in Supabase SQL Editor to create all tables.
-- ============================================================

-- -----------------------------------------------------------
-- 1. PROFILES
-- -----------------------------------------------------------
create table if not exists profiles (
  user_id      uuid        not null primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- -----------------------------------------------------------
-- 2. USER SETTINGS
-- -----------------------------------------------------------
create table if not exists user_settings (
  user_id            uuid        not null primary key references auth.users(id) on delete cascade,
  onboarding_complete boolean    not null default false,
  start_level        text,
  target_level       text,
  daily_minutes      int         not null default 0,
  days_per_week      int         not null default 0,
  deadline           text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- -----------------------------------------------------------
-- 3. USER PROGRESS
-- -----------------------------------------------------------
create table if not exists user_progress (
  user_id      uuid        not null primary key references auth.users(id) on delete cascade,
  current_level text       not null default 'A1',
  levels       jsonb       not null default '{}'::jsonb,
  payload      jsonb       not null default '{}'::jsonb,
  settings     jsonb       not null default '{}'::jsonb,
  version      int         not null default 1,
  profile      text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- -----------------------------------------------------------
-- 4. LESSON PROGRESS
-- -----------------------------------------------------------
create table if not exists lesson_progress (
  user_id           uuid        not null references auth.users(id) on delete cascade,
  lesson_id         text        not null,
  completed         boolean     not null default false,
  score             numeric(5,2),
  time_spent_seconds int        not null default 0,
  last_activity_at  timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- -----------------------------------------------------------
-- 5. DAILY SESSIONS
-- -----------------------------------------------------------
create table if not exists daily_sessions (
  user_id           uuid        not null references auth.users(id) on delete cascade,
  session_date      date        not null,
  minutes_studied   int         not null default 0,
  lessons_completed int         not null default 0,
  streak_count      int         not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  primary key (user_id, session_date)
);

-- -----------------------------------------------------------
-- 6. MISTAKES
-- -----------------------------------------------------------
create table if not exists mistakes (
  user_id         uuid        not null references auth.users(id) on delete cascade,
  id              uuid        not null default gen_random_uuid() primary key,
  item_id         text        not null,
  item_type       text        not null check (item_type in ('vocab', 'grammar', 'reading', 'listening')),
  level           text        not null,
  context         jsonb,
  times_mistaken  int         not null default 1,
  last_mistake_at timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (user_id, item_id, item_type, level)
);

-- -----------------------------------------------------------
-- 7. FLASHCARDS
-- -----------------------------------------------------------
create table if not exists flashcards (
  user_id    uuid        not null references auth.users(id) on delete cascade,
  id         uuid        not null default gen_random_uuid() primary key,
  item_id    text        not null,
  item_type  text        check (item_type in ('vocab', 'phrase', 'word')),
  front      text        not null,
  back       text        not null,
  level      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------
-- 8. FLASHCARD REVIEWS
-- -----------------------------------------------------------
create table if not exists flashcard_reviews (
  user_id          uuid        not null references auth.users(id) on delete cascade,
  id               uuid        not null default gen_random_uuid() primary key,
  flashcard_id     uuid        not null references flashcards(id) on delete cascade,
  ease_factor      numeric(3,2) not null default 2.50,
  interval_days    int         not null default 0,
  next_review_at   timestamptz,
  last_reviewed_at timestamptz,
  review_count     int         not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- -----------------------------------------------------------
-- 9. EXAM ATTEMPTS
-- -----------------------------------------------------------
create table if not exists exam_attempts (
  user_id      uuid        not null references auth.users(id) on delete cascade,
  id           uuid        not null default gen_random_uuid() primary key,
  exam_type    text        not null check (exam_type in ('placement', 'level', 'fsp')),
  level        text        not null,
  score        numeric(5,2),
  max_score    numeric(5,2),
  answers      jsonb,
  passed       boolean,
  completed_at timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- -----------------------------------------------------------
-- 10. WRITING ATTEMPTS
-- -----------------------------------------------------------
create table if not exists writing_attempts (
  user_id      uuid        not null references auth.users(id) on delete cascade,
  id           uuid        not null default gen_random_uuid() primary key,
  prompt_id    text,
  user_response text,
  evaluation   jsonb,
  level        text,
  score        numeric(5,2),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- -----------------------------------------------------------
-- 11. SPEAKING ATTEMPTS
-- -----------------------------------------------------------
create table if not exists speaking_attempts (
  user_id      uuid        not null references auth.users(id) on delete cascade,
  id           uuid        not null default gen_random_uuid() primary key,
  prompt_id    text,
  user_response text,
  evaluation   jsonb,
  level        text,
  score        numeric(5,2),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- -----------------------------------------------------------
-- 12. FSP PROGRESS
-- -----------------------------------------------------------
create table if not exists fsp_progress (
  user_id           uuid        not null references auth.users(id) on delete cascade,
  id                uuid        not null default gen_random_uuid() primary key,
  module_id         int,
  lesson_id         text,
  completed         boolean     not null default false,
  score             numeric(5,2),
  vocab_studied     jsonb       not null default '[]'::jsonb,
  anamnese_practiced jsonb      not null default '[]'::jsonb,
  writing_practiced  jsonb      not null default '[]'::jsonb,
  speaking_practiced jsonb      not null default '[]'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- -----------------------------------------------------------
-- 13. SYNC METADATA
-- -----------------------------------------------------------
create table if not exists sync_metadata (
  user_id           uuid        not null primary key references auth.users(id) on delete cascade,
  last_sync_at      timestamptz,
  local_updated_at  timestamptz,
  cloud_updated_at  timestamptz,
  conflicts_resolved int        not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- -----------------------------------------------------------
-- 14. PLACEMENT RESPONSES
-- -----------------------------------------------------------
create table if not exists placement_responses (
  user_id     uuid        not null references auth.users(id) on delete cascade,
  id          uuid        not null default gen_random_uuid() primary key,
  question_id text,
  response    text,
  score       numeric(3,2),
  section     text        check (section in ('vocab', 'grammar', 'reading', 'listening', 'self')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, question_id)
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Foreign key indexes
create index if not exists idx_lesson_progress_user_id on lesson_progress(user_id);
create index if not exists idx_daily_sessions_user_id on daily_sessions(user_id);
create index if not exists idx_mistakes_user_id on mistakes(user_id);
create index if not exists idx_flashcards_user_id on flashcards(user_id);
create index if not exists idx_flashcard_reviews_user_id on flashcard_reviews(user_id);
create index if not exists idx_flashcard_reviews_flashcard_id on flashcard_reviews(flashcard_id);
create index if not exists idx_exam_attempts_user_id on exam_attempts(user_id);
create index if not exists idx_writing_attempts_user_id on writing_attempts(user_id);
create index if not exists idx_speaking_attempts_user_id on speaking_attempts(user_id);
create index if not exists idx_fsp_progress_user_id on fsp_progress(user_id);
create index if not exists idx_placement_responses_user_id on placement_responses(user_id);

-- Performance indexes for common queries
create index if not exists idx_lesson_progress_completed on lesson_progress(user_id, completed);
create index if not exists idx_daily_sessions_date on daily_sessions(user_id, session_date);
create index if not exists idx_mistakes_item on mistakes(user_id, item_id, item_type);
create index if not exists idx_flashcard_reviews_next_review on flashcard_reviews(user_id, next_review_at);
create index if not exists idx_exam_attempts_type on exam_attempts(user_id, exam_type);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- APPLY TRIGGER TO ALL TABLES
-- ============================================================

do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'profiles', 'user_settings', 'user_progress', 'lesson_progress',
      'daily_sessions', 'mistakes', 'flashcards', 'flashcard_reviews',
      'exam_attempts', 'writing_attempts', 'speaking_attempts',
      'fsp_progress', 'sync_metadata', 'placement_responses'
    ])
  loop
    execute format(
      'create trigger if not exists trg_%I_updated_at
       before update on %I
       for each row
       execute function update_updated_at_column()',
      t, t
    );
  end loop;
end;
$$;
