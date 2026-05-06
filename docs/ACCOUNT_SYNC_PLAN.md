# Account Sync Plan

## Goal

Keep local mode fully usable while adding account sync through Supabase when configuration is available. The frontend must never expose service-role keys or pretend cloud sync works when the provider is missing.

## Recommended Supabase Schema

Tables:

- `profiles`: `id uuid primary key references auth.users`, `email`, `display_name`, `created_at`, `updated_at`
- `progress`: `user_id`, `state_json`, `updated_at`, `schema_version`
- `completed_lessons`: `user_id`, `level`, `lesson_id`, `completed_at`
- `level_progress`: `user_id`, `level`, `skill`, `item_id`, `result_json`, `updated_at`
- `vocabulary_mastery`: `user_id`, `word_id`, `level`, `correct`, `incorrect`, `mastered`, `ease`, `interval`, `due`, `updated_at`
- `mistake_notebook`: `user_id`, `level`, `skill`, `exercise_id`, `user_answer`, `correct_answer`, `topic`, `mastered`, `created_at`, `updated_at`
- `study_goal`: `user_id`, `target_level`, `target_date`, `daily_minutes`, `plan_type`, `updated_at`
- `daily_sessions`: `user_id`, `date_key`, `level`, `plan_json`, `completed_json`, `minutes`, `updated_at`
- `exam_results`: `user_id`, `level`, `score`, `passed`, `answers_json`, `completed_at`

## Auth Flow

1. Sign up with email/password through Supabase Auth.
2. Confirm email if confirmation is enabled.
3. Sign in and fetch cloud progress.
4. If local progress exists, show local-to-cloud migration options:
   - keep local and upload,
   - use cloud on this device,
   - merge when timestamps are compatible.
5. Logout keeps local data available unless the user explicitly clears it.

## Conflict Resolution

- Prefer per-record `updated_at` when available.
- For arrays such as completed lessons, merge unique IDs.
- For mastery records, keep the highest repetitions/ease only when the due date is not older than the local due date.
- For mistakes, keep unresolved mistakes and mark mastered items by latest timestamp.

## RLS And Security

- Enable RLS on every table.
- Policies: users can select/insert/update/delete only rows where `user_id = auth.uid()`.
- Never commit Supabase service-role keys.
- GitHub Pages frontend may use only public anon key and project URL.

## GitHub Pages Frontend Notes

- Required environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Missing env vars must show local mode with disabled sign-in/sign-up shell.
- All sync writes should debounce and keep localStorage as fallback.

## Staged Implementation

1. Polish local/account UI and disabled provider state.
2. Add schema migrations outside the frontend repo or in a guarded `supabase/` folder.
3. Implement sign up/sign in/logout.
4. Implement local-to-cloud migration.
5. Add per-skill sync and conflict resolution.
6. Add sync status, retry, and last-sync history.
