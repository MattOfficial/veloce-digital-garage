# Current State Audit

Audit date: 2026-03-14

## What Was Verified

- The app builds successfully with `npm run build`
- The active route surface is:
  - `/`
  - `/login`
  - `/auth/callback`
  - `/dashboard`
  - `/dashboard/fuel`
  - `/dashboard/maintenance`
  - `/dashboard/insights`
  - `/dashboard/profile`
  - `/dashboard/vehicles/[id]`
  - `/telemetry`
- The app uses the `users` table for profile data, not `profiles`
- Multi-provider Copilot is implemented for Gemini, OpenAI, and DeepSeek
- OCR and receipt upload are currently Gemini-key based
- The `documents`, `service_reminders`, and `user_badges` tables exist in migrations

## Stale Documentation That Was Corrected

- Old docs referred to a `profiles` table instead of `users`
- Old docs described Next.js 14, while this branch is on Next.js 16.1.6
- Old docs described a standalone `/dashboard/vault` route that is not present on this branch
- Old schema docs described `documents.file_url` and `maintenance_logs.provider`, which do not match the current migrations
- `.env.example` contained speculative model guidance instead of the defaults actually used by the code

## Code Fixes Made During This Audit

- Fixed vehicle links that incorrectly pointed to `/vehicles/[id]` instead of `/dashboard/vehicles/[id]`
- Fixed redirect fallback from vehicle detail to `/dashboard/profile`
- Fixed several stale `revalidatePath()` targets that still pointed at pre-dashboard paths
- Updated OCR to use `GEMINI_MODEL` from environment when provided
- Updated Copilot to honor `DEEPSEEK_MODEL` from environment when provided
- Fixed Copilot cloud-access gating so OpenAI and DeepSeek users are not treated as Gemini-only users
- Removed an OCR write to a nonexistent `maintenance_logs.provider` column
- Synced `src/types/supabase.ts` with newer migrated columns and tables
- Added Husky hooks for pre-commit secret scanning and pre-push production build verification

## Remaining Follow-Up Items

- `npm run lint` still reports 64 problems on this branch: 42 errors and 22 warnings
- Chat attachments are only handled end-to-end in the Gemini provider flow
- `service_reminders` has server support but is not surfaced in the main maintenance experience
- `supabase/schema.sql` is still an early bootstrap snapshot and may mislead future readers if treated as canonical
