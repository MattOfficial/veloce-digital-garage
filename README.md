# Veloce Digital Garage

Veloce is a Next.js vehicle ownership tracker for logging fuel, maintenance, custom vehicle health data, receipt documents, and hybrid AI-assisted garage workflows.

## Current Product Surface

- Marketing landing page at `/`
- Auth flow at `/login` with email/password and Google sign-in
- Protected dashboard shell at `/dashboard`
- Fuel analytics and log management at `/dashboard/fuel`
- Maintenance analytics, OCR-assisted invoice intake, tire tracking, and custom trackers at `/dashboard/maintenance`
- Insights hub at `/dashboard/insights` with tabbed running-cost and distance analytics
- Profile, BYOK provider settings, badges, garage management, and garage-wide distance metrics at `/dashboard/profile`
- Vehicle detail manager at `/dashboard/vehicles/[id]`
- Experimental telemetry demo at `/telemetry`

## Important Scope Notes

- Multi-provider Copilot is implemented for Gemini, OpenAI, and DeepSeek.
- Copilot can route between deterministic local NLP, browser-local AI, server analytics, and provider-backed server chat.
- Browser-local Copilot support exists for Edge local models and Chrome Gemini Nano when the browser exposes the Prompt API.
- OCR and receipt upload flows are currently Gemini-key based.
- The `documents` table and `vehicle-documents` storage bucket exist, but there is no standalone `/dashboard/vault` page on this branch.
- `service_reminders` exists in schema and server actions, but it is not currently surfaced in the main dashboard UI.

## Tech Stack

- Next.js 16.1.6 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase Auth, Postgres, and Storage
- Zustand for client-side state
- Framer Motion, Radix UI, and Shadcn UI primitives
- Recharts for analytics
- `compromise` plus provider-backed LLM calls for Copilot

## AI Routing Summary

The current Copilot flow is hybrid rather than provider-only:

- `local NLP` handles explicit fuel and maintenance draft flows
- `browser-local AI` handles in-scope text chat when supported by Edge or Chrome
- `server analytics` handles garage and vehicle metric questions
- `server chat` handles provider-backed conversational fallback

Attachment note:

- Chat attachments route through the server path, but inline attachment understanding is still Server-led today

Current server providers:

- Gemini
- OpenAI
- DeepSeek

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values.

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ENCRYPTION_MASTER_KEY`

Optional model overrides:

- `GEMINI_MODEL`
- `OPENAI_MODEL`
- `DEEPSEEK_MODEL`

`ENCRYPTION_MASTER_KEY` must be a 64-character hex string.

## Local Development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Apply the Supabase migrations with `npx supabase db push`.
4. Run the app with `npm run dev`.
5. Validate production readiness with `npm run lint`.
6. Validate production readiness with `npm run build`.

## Database and Storage

The source of truth for schema is `supabase/migrations`.

Key database tables:

- `users`
- `vehicles`
- `fuel_logs`
- `maintenance_logs`
- `custom_log_categories`
- `custom_logs`
- `documents`
- `service_reminders`
- `user_badges`

Storage buckets used by the app:

- `avatars`
- `vehicles`
- `vehicle-documents`

See [docs/database_schema.md](docs/database_schema.md) for the audited schema summary.

## Git Hooks

This repo now uses Husky for local safety checks before code leaves your machine.

Pre-commit:

- Hook: `.husky/pre-commit`
- Command: `npm run check:secrets`
- Blocks obvious staged secrets such as provider API keys, `ENCRYPTION_MASTER_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`

Pre-push:

- Hook: `.husky/pre-push`
- Commands: `npm run lint` then `npm run build`
- Runs ESLint first and then the production Next build, blocking pushes if either check fails

Placeholders in `.env.example` and docs are allowed by the secret scan.

## Additional Docs

- [Architecture and branch reality](docs/architecture_and_context.md)
- [Database schema summary](docs/database_schema.md)
- [Current audit notes](docs/current-state-audit.md)
- [UI and animation conventions](docs/ui_and_animations.md)
- [Vercel deployment guide](docs/vercel-deployment-guide.md)
