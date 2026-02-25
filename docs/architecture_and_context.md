# Veloce Tracker - Core Architecture & Context

## Application Overview
Veloce Tracker is a premium, dark-mode, glassmorphic Next.js (App Router) web application designed for comprehensive vehicle management. It tracks fuel efficiency, maintenance schedules, and custom health metrics to calculate Total Cost of Ownership (TCO).

## Tech Stack & Tooling
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (`strict` mode)
- **Database / Auth**: Supabase (PostgreSQL, Row Level Security)
- **State Management**: Zustand (Client-side localized stores: `useVehicleStore`, `useUserStore`)
- **Styling**: Tailwind CSS V4 (utilizing `@theme` and `@custom-variant` directives in `globals.css`)
- **Animation**: Framer Motion (`framer-motion`)
- **UI Components**: custom Shadcn UI + Radix primitives + Lucide React icons
- **Data Visualization**: Recharts

## Core Domain Models (Zustand Stores)
### `user-store.ts`
Manages the authenticated user's profile state, including localization preferences.
- Tracks `id`, `email`, `currency` (e.g., 'USD', 'EUR'), `distanceUnit` ('km', 'miles'), `volumeUnit` ('Liters', 'Gallons (US)', 'Gallons (UK)').
- Core action: `fetchProfile()` - syncs local state with Supabase `profiles` table.

### `vehicle-store.ts`
Manages the user's "Digital Garage". A complex store holding an array of `VehicleWithLogs` (a nested relational type containing the vehicle data and all associated arrays of logs).
- Tracks `vehicles: VehicleWithLogs[]`, `selectedVehicleId: string | null`, `isLoading: boolean`.
- Core action: `fetchVehicles()` - performs a massive relational join `* , fuel_logs(*), maintenance_logs(*), custom_logs(*)` filtering by `user_id`.

## Routing Architecture (App Router)
- `/(auth)/login`: Supabase magic link / OAuth entry point.
- `/(dashboard)/`: Protected layout (`layout.tsx` validates session). Wraps children in `AppSidebar` and interactive dot-matrix background.
- `/(dashboard)/fuel`: Fuel efficiency tracking and analytics.
- `/(dashboard)/maintenance`: Maintenance schedules, service invoices, custom time-series trackers, and interactive tire lifecycle map.
- `/(dashboard)/insights`: High-level TCO dashboard (predictive cadence, aggregated expense breakdowns).
- `/(dashboard)/profile`: User settings (localization, currency).
- `/(dashboard)/vehicles/[id]`: Vehicle management (edit details, delete vehicle).

## Development Rules for Future Agents
1. **Never use `router.refresh()` for state updates.** Always rely on Zustand `fetchVehicles()` or optimistic updates to trigger client re-renders after a server action mutation. Next.js router cache invalidation causes UI stuttering in this architecture.
2. **Server Actions (`src/app/actions/...`)**: All database mutations must occur via async functions exported with `"use server"`. Use `supabase/server.ts` to instantiate the client to adhere to RLS.
3. **Data Fetching**: Initial data load relies on Next.js server components passing initial payload to client components (e.g., `page.tsx` -> `<ClientComponent initialData={data} />`). However, dynamic polling relies on Zustand.
4. **Veloce Aesthetics**: Always maintain the dark glassmorphic design system. Do not introduce opaque white components.
