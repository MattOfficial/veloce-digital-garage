# Veloce Architecture And Context

This document describes the current branch, not the original product vision.

## Application Shape

Veloce is a protected Next.js 16 App Router application with a public landing page, a Supabase-backed auth flow, and a client-heavy dashboard experience driven by Zustand stores.

Primary routes:

- `/` public landing page
- `/login` auth UI
- `/auth/callback` Supabase OAuth callback
- `/dashboard` overview
- `/dashboard/fuel` fuel history and fuel-efficiency analysis
- `/dashboard/maintenance` maintenance analytics, OCR review, custom trackers, and tire tracking
- `/dashboard/insights` tabbed insights for running costs and distance analytics
- `/dashboard/profile` profile, provider key management, badges, garage management, and garage-wide distance metrics
- `/dashboard/vehicles/[id]` vehicle detail editor and service history
- `/telemetry` experimental visual demo

## Runtime Architecture

### Auth

- `src/proxy.ts` delegates to `src/utils/supabase/middleware.ts`
- the Next.js proxy refreshes the Supabase session and redirects unauthenticated users away from protected routes
- `/login` redirects to `/dashboard` when a user already has a session

### Data Loading

- Dashboard pages fetch only route-specific server data such as tracker categories or a specific vehicle record
- The main user and garage state is fetched client-side through Zustand
- `AppSidebar` triggers `fetchProfile()` and `fetchVehicles()` on route changes so the shell stays in sync after mutations

### Client State

`src/store/user-store.ts`

- Reads from the `users` table
- Stores display name, avatar, currency, distance unit, provider-key availability, and preferred provider
- Derives display units such as liters versus gallons

`src/store/vehicle-store.ts`

- Reads vehicles and nested logs from Supabase
- Persists only `selectedVehicleId` in local storage
- Drives most dashboard screens from a shared selected-vehicle context

## AI And OCR

### Copilot

`src/components/veloce-copilot.tsx` uses a client-side router plus server fallback:

1. Local parsing via `src/utils/nlp-engine.ts` for explicit fuel and maintenance draft flows
2. Guardrail / analytics / general-chat routing via `src/utils/copilot-routing.ts`
3. Browser-local chat via `src/utils/browser-ai.ts` when Edge local models or Chrome Gemini Nano are available
4. Server fallback via `POST /api/copilot` for analytics, provider-backed chat, and attachment-routed flows

Supported providers in the current branch:

- Gemini
- OpenAI
- DeepSeek

Supported browser-local paths in the current branch:

- Edge local built-in model path
- Chrome Gemini Nano Prompt API path

Current limitation:

- Chat attachments route through the server path, but inline attachment understanding is still Gemini-led today
- OCR and receipt extraction remain Gemini-key based

### OCR

- OCR is triggered from the maintenance screen after uploading a receipt to Supabase Storage
- `src/app/actions/ocr.ts` currently requires the user to have a Gemini key saved
- The OCR review modal writes a maintenance log plus a `documents` row after user confirmation

## Storage

The app currently uses three storage buckets:

- `avatars` for profile images
- `vehicles` for vehicle images
- `vehicle-documents` for maintenance receipts and chat-uploaded files

## Server Mutation Pattern

Most data mutations live in `src/app/actions/*` and execute through the server Supabase client so RLS remains in effect.

Current action groups:

- `fuel.ts`
- `maintenance.ts`
- `vehicles.ts`
- `custom-trackers.ts`
- `reminders.ts`
- `badges.ts`
- `ocr.ts`
- `dashboard/profile/actions.ts`

## What Is Present Versus Planned

Implemented in this branch:

- Multi-vehicle garage
- Fuel logging, editing, and deletion
- Maintenance logging, editing, and deletion
- Invoice upload plus OCR review
- Custom trackers
- Tire tracking
- Badges
- Multi-provider Copilot
- Browser-local AI support for Edge and Chrome
- Distance analytics on overview, insights, and profile surfaces

Partially implemented:

- `documents` table and storage-backed document persistence exist, but there is no standalone vault page
- `service_reminders` exists in schema and server actions, but not in the main dashboard flow

## Known Maintenance Notes

- `src/types/supabase.ts` should be kept aligned with `supabase/migrations`
- `supabase/schema.sql` is historical bootstrap SQL, not the best source of truth for the current schema
- `npm run lint` currently passes on this branch
- `npm run build` currently passes on this branch
