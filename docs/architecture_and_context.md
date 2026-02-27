# Veloce Tracker - Core Architecture & Context

## Application Overview
Veloce Tracker is a premium, dark-mode, glassmorphic Next.js (App Router) web application designed for comprehensive multi-modal vehicle management. It natively tracks dynamic health metrics, efficiency, and maintenance for **Internal Combustion (ICE), Electric (EV), Plug-in Hybrid (PHEV), and Motorcycles**, calculating Total Cost of Ownership (TCO).

## Tech Stack & Tooling
- **Framework**: Next.js 14+ (App Router) with React Suspense Boundaries
- **Language**: TypeScript (`strict` mode)
- **Database / Auth / Storage**: Supabase (PostgreSQL, Row Level Security, Supabase Storage for Vault/OCR)
- **State Management**: Zustand (Client-side localized stores with local storage `persist` middleware: `useVehicleStore`, `useUserStore`)
- **AI & NLP (Hybrid Flow)**: `compromise.js` for instant browser-side intent parsing, gracefully falling back to Google Gemini (`@google/genai`) for complex Q&A and Document OCR.
- **Security**: AES-256-GCM encryption (`src/utils/crypto.ts`) applied to user-provided LLM API keys before database storage.
- **Styling**: Tailwind CSS V4 (utilizing `@theme` and `@custom-variant` directives in `globals.css`)
- **Animation & UX**: Framer Motion (`framer-motion`) and `nextjs-toploader`
- **UI Components**: custom Shadcn UI + Radix primitives + Lucide React icons
- **Data Visualization**: Recharts

## Core Domain Models (Zustand Stores)
### `user-store.ts`
Manages the authenticated user's profile state, including localization preferences.
- Tracks `id`, `email`, `currency` (e.g., 'USD', 'EUR'), `distanceUnit` ('km', 'miles'), `volumeUnit` ('Liters', 'Gallons (US)', 'Gallons (UK)'), and `hasLlmKey` (boolean flag detecting if an encrypted BYOK key exists).
- Core action: `fetchProfile()` - syncs local state with Supabase `profiles` table.

### `vehicle-store.ts`
Manages the user's "Digital Garage". A complex store holding an array of `VehicleWithLogs` (a nested relational type containing the vehicle data and all associated arrays of logs).
- Tracks `vehicles: VehicleWithLogs[]`, `selectedVehicleId: string | null`, `isLoading: boolean`.
- **Persistence**: Employs `zustand/middleware` `persist` to save `selectedVehicleId` directly to local storage to persist active vehicle contexts across page reloads.
- Core action: `fetchVehicles()` - performs a massive relational join `* , fuel_logs(*), maintenance_logs(*), custom_logs(*)` filtering by `user_id`.

## Routing Architecture (App Router)
- `/(auth)/login`: Supabase magic link / OAuth entry point.
- `/(dashboard)/`: Protected layout (`layout.tsx` validates session). Wraps children in `AppSidebar` and interactive dot-matrix background.
- `/(dashboard)/loading.tsx`: A framer-motion powered Suspense boundary serving as a skeleton/loading state during route transitions.
- `/(dashboard)/fuel`: Efficiency tracking (supports both liquid Fuel volume and EV Battery range trends).
- `/(dashboard)/maintenance`: Maintenance schedules, `vehicle_id`-bound custom time-series trackers, Service Reminders (mileage/date-based logic), and interactive tire lifecycle map.
- `/(dashboard)/insights`: High-level TCO dashboard (predictive cadence, aggregated expense breakdowns).
- `/(dashboard)/vault`: Document Vault module for storing receipts, insurance, and vehicle paperwork securely via Supabase Storage.
- `/(dashboard)/profile`: User settings (localization, currency) and Garage Management (vehicle creation/powertrain tuning).

## Development Rules for Future Agents
1. **Never use `router.refresh()` for state updates**, UNLESS fetching RSC props (like dashboard server queries). Always rely on Zustand `fetchVehicles()` to immediately trigger client re-renders after a server action mutation, followed by `router.refresh()` strictly to keep Next.js Server Components in sync (e.g., custom trackers).
2. **Server Actions (`src/app/actions/...`)**: All database mutations must occur via async functions exported with `"use server"`. Use `supabase/server.ts` to instantiate the client to adhere to RLS.
3. **Multi-Powertrain Polymorphism**: Always respect `vehicle.powertrain` ('ev', 'ice', 'phev') and `vehicle.vehicle_type` ('car', 'motorcycle') when building components. UIs must dynamically collapse non-applicable fields (e.g., don't ask for Engine Type on an EV; only render 2 tires for motorcycles).
4. **Data Fetching**: Initial data load relies on Next.js server components passing initial payload to client components. Dynamic polling relies on Zustand.
5. **Veloce Aesthetics**: Always maintain the dark glassmorphic design system. Do not introduce opaque white components. Leverage Suspense and TopLoaders instead of primitive blocking "loading..." text arrays.
6. **AI Architecture (Hybrid Copilot)**: The chat interface (`src/components/veloce-copilot.tsx`) follows a hybrid cost-saving paradigm:
    - **Tier 1 (Local NLP)**: All user input is *first* parsed by `src/utils/nlp-engine.ts` using `compromise.js` and a time-series state loop. If basic intents (logging fuel/maintenance dates and costs) are detected, it drafts standard payloads with zero latency and $0 cost.
    - **Tier 2 (Cloud LLM)**: If the local engine returns `unknown` (e.g. analytical questions) AND the user has `hasLlmKey` enabled (their BYOK Gemini key is securely saved), the payload is sent to Next.js `POST /api/copilot`. The server decrypts their key using the `ENCRYPTION_MASTER_KEY` environment variable, queries Gemini via function calling, and passes the action back down.
