-- Schema: user_progress
-- Stores per-user progress and settings synced from localStorage.

create table if not exists user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique(user_id)
);

-- Enable row level security
alter table user_progress enable row level security;

-- Policies: each user can only access their own row
create policy "Users can select own progress"
  on user_progress
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on user_progress
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on user_progress
  for update
  using (auth.uid() = user_id);

create policy "Users can delete own progress"
  on user_progress
  for delete
  using (auth.uid() = user_id);
