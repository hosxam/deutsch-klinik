# Supabase Setup Guide

This guide walks you through setting up Supabase for the Deutsch Klinik app.

---

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Enter your organization, project name (e.g., "deutsch-klinik"), and a strong database password.
4. Choose the region closest to your users.
5. Click **Create new project** (takes ~1-2 minutes).

## 2. Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**.
2. Click **New query**.
3. Open `supabase/schema.sql` from this project and paste the entire contents.
4. Click **Run** (or **Cmd+Enter**).
5. Verify all 14 tables were created in **Table Editor**.

## 3. Apply Row Level Security Policies

1. In **SQL Editor**, click **New query**.
2. Open `supabase/rls_policies.sql` from this project and paste it.
3. Click **Run**.
4. Verify each table has RLS enabled in **Table Editor > Policies**.

## 4. Get Your API Credentials

1. In the Supabase dashboard, go to **Project Settings > API**.
2. Under **Project API keys**, copy:
   - **Project URL** (looks like `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

## 5. Configure Environment Variables

Create a `.env` file in the project root (or edit the existing one):

```bash
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

> **Important:** The `.env` file is listed in `.gitignore` and should never be committed to version control.

## 6. Verify It Works

Start the dev server and open the browser console:

```bash
npm run dev
```

You should see no Supabase-related errors in the console.

## 7. Test Authentication (Optional)

To test Supabase integration end-to-end, sign up a test user:

```sql
-- Run in SQL Editor to confirm auth.users exists
SELECT * FROM auth.users LIMIT 1;
```

Then try signing up through the app and check that `profiles`, `user_settings`, and other tables populate correctly.

---

## Notes

- **Environment variables are optional.** The app works without them. If `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` is missing, `getSupabase()` returns `null` and the app runs entirely client-side using localStorage.
- **Auth is handled by Supabase Auth.** The `auth.users` table is managed automatically by Supabase. You only need to create a row in `profiles` after signup.
- **RLS policies ensure data isolation.** Every user can only access their own rows. This is enforced at the database level.
- **The `updated_at` trigger** is auto-applied to all tables. No need to manually set `updated_at` in your queries.
