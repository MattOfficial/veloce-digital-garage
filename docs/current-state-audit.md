# Current State Audit

Audit date: 2026-03-15

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
- Browser-local Copilot support exists for Edge local models and Chrome Gemini Nano
- Copilot client routing now separates local NLP drafting, browser-local chat, server analytics, guardrails, and server fallback
- OCR and receipt upload are currently Gemini-key based
- The `documents`, `service_reminders`, and `user_badges` tables exist in migrations
- `/dashboard/insights` is now a broader insights hub with running-cost and distance tabs
- Distance-driven analytics now appear on the overview page, the insights page, and the profile page

## Stale Documentation That Was Corrected

- Old docs referred to a `profiles` table instead of `users`
- Old docs described Next.js 14, while this branch is on Next.js 16.1.6
- Old docs described a standalone `/dashboard/vault` route that is not present on this branch
- Old docs described `/dashboard/insights` as a running-cost-only screen
- Old schema docs described `documents.file_url` and `maintenance_logs.provider`, which do not match the current migrations
- `.env.example` contained speculative model guidance instead of the defaults actually used by the code

## Current Verified Behavior

- `npm run lint` passes
- `npm run build` passes
- Distance analytics use a shared odometer-based helper across dashboard UI and Copilot analytics
- The sidebar and header label the analytics route as `Insights`
- The Copilot UI now uses source-aware avatars and calmer provider/state messaging rather than debug tags

## Remaining Follow-Up Items

- Chat attachments are only handled end-to-end in the Gemini provider flow
- `service_reminders` has server support but is not surfaced in the main maintenance experience
- `supabase/schema.sql` is still an early bootstrap snapshot and may mislead future readers if treated as canonical
- There is still no standalone document vault page even though receipt/document persistence exists
