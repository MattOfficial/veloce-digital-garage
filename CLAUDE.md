# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Veloce Digital Garage is a Next.js 16 vehicle ownership tracker for logging fuel, maintenance, and hybrid AI-assisted garage workflows. It uses a monorepo structure with the main app in `src/` and a shared UI component package in `packages/veloce-ui/`.

## Commands

```bash
bun run dev          # Start development server with Turbopack
bun run build        # Production build
bun run lint         # ESLint validation
bun run test         # Run tests (vitest)
bun run test:coverage # Run tests with coverage (80% threshold)
```

**UI Package** (at `packages/veloce-ui/`):
```bash
cd packages/veloce-ui && bun run build    # Build the UI package
cd packages/veloce-ui && bun run dev       # Dev mode for UI package
cd packages/veloce-ui && bun run test      # Package tests
```

**Supabase**:
```bash
bunx supabase db push   # Push migrations to local Supabase instance
```

## Architecture

### Monorepo Structure

- **`src/`** — Next.js app (App Router pages, components, stores, actions)
- **`packages/veloce-ui/`** — Shared UI component library published to npm as `@mattofficial/veloce-ui`
- **`supabase/migrations/`** — Database schema migrations

### Path Aliases

The root `tsconfig.json` defines these aliases:
- `@/*` → `./src/*`
- `@mattofficial/veloce-ui` → `./packages/veloce-ui/src/index.ts`

### UI Package

The veloce-ui package is the canonical source for all reusable components (Button, Card, Dialog, Sidebar, etc.). Edit components in `packages/veloce-ui/src/components/`. Components are client-ready via the package entry point.

Import from the package:
```tsx
import { Button, Card } from "@mattofficial/veloce-ui";
```

### Theme System (Tailwind CSS v4)

The app uses Tailwind v4 with CSS variables defined in `src/app/globals.css`. The theme has two modes:

- **Light mode**: Modern pastel theme using oklch colors
- **Dark mode**: Glassmorphic dark theme with `bg-white/5` and `border-white/5` opacities

Dark mode is toggled via the `.dark` class on `<html>`. The theme initialization script in `src/app/layout.tsx` reads from localStorage and applies the class before first paint.

CSS variables for theming include: `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--border`, `--input`, `--card`, `--destructive`, `--ring`, and veloce-specific `--color-veloce-glass`, `--color-veloce-border`.

### Client State (Zustand)

- `src/store/user-store.ts` — User profile, display units, provider keys
- `src/store/vehicle-store.ts` — Vehicles and nested logs (selectedVehicleId persisted in localStorage)
- `src/store/theme-store.ts` — Theme mode state

### Server Actions

Data mutations live in `src/app/actions/`:
- `fuel.ts`, `maintenance.ts`, `vehicles.ts` — CRUD operations
- `ocr.ts` — Gemini-based receipt parsing
- `reminders.ts`, `badges.ts`, `custom-trackers.ts` — Domain-specific actions

### Auth

Supabase Auth with SSR. Middleware at `src/utils/supabase/middleware.ts` refreshes sessions and redirects unauthenticated users. Protected routes are under `/dashboard`.

### Copilot / AI Routing

The copilot (`src/components/veloce-copilot.tsx`) routes through:
1. Local NLP (`src/utils/nlp-engine.ts`) — explicit fuel/maintenance flows
2. Browser-local AI (`src/utils/browser-ai.ts`) — Edge/Chrome Prompt API
3. Server analytics/chat (`/api/copilot`) — Gemini, OpenAI, DeepSeek

### Route Structure

- `/` — Public landing page
- `/login` — Auth flow
- `/dashboard` — Overview with sidebar
- `/dashboard/fuel` — Fuel logging and analytics
- `/dashboard/maintenance` — Maintenance, OCR, tire tracking, custom trackers
- `/dashboard/insights` — Running costs and distance analytics (tabbed)
- `/dashboard/profile` — User profile, provider keys, badges, garage management
- `/dashboard/vehicles/[id]` — Vehicle detail editor

## Design Conventions

### Glassmorphism (Dark Mode)

The dark theme uses translucent glass effects:
- `bg-white/5` or `bg-white/10` for backgrounds
- `border-white/5` or `border-white/10` for borders
- `backdrop-blur-2xl` for blur effects
- `--color-veloce-glass: rgba(255, 255, 255, 0.03)` for cards

### Light Mode Styling

Do NOT use hardcoded `bg-white`, `border-white/5`, etc. in light mode. Use CSS variables instead:
- `bg-background`, `bg-secondary`, `bg-muted`, `bg-accent`
- `border-input`, `border-border`

For colored states (status pills, alerts), use higher opacity in light mode (e.g., `bg-red-500/20`) with darker text (`text-red-700`), and lower opacity with light text in dark mode (`dark:bg-red-500/15 dark:text-red-200`).

### Animation

Use `framer-motion` with `MotionWrapper` (`src/components/motion-wrapper.tsx`) for page-load animations. Route transitions are handled by `nextjs-toploader` and React Suspense — do not build custom loading states for route transitions.

### Markdown Rendering

All AI-generated content must be rendered via `react-markdown` + `remark-gfm` inside a `prose prose-sm dark:prose-invert` wrapper. Never render raw text from LLM responses.
