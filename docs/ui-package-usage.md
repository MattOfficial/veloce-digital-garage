# Veloce UI Package (@mattofficial/veloce-ui)

This document describes the UI component package extracted from the main application into a
standalone package at `packages/veloce-ui/`.

## Overview

`@mattofficial/veloce-ui` contains the canonical, reusable UI components for Veloce Digital
Garage — Button, Card, Dialog, Sidebar, and the rest of the shadcn/ui-derived primitives. It is
built as a standalone library with Vite and TypeScript, and is also published to npm as
`@mattofficial/veloce-ui` so it can be used outside this repository.

**Inside this repo, the main app does not consume the built package.** There is no workspace
dependency entry for it in the root `package.json` — instead, `tsconfig.json` aliases the
package name straight to source:

```json
// tsconfig.json
"paths": {
  "@mattofficial/veloce-ui": ["./packages/veloce-ui/src/index.ts"],
  "@mattofficial/veloce-ui/*": ["./packages/veloce-ui/src/*"]
}
```

Editing a component under `packages/veloce-ui/src/components/` takes effect immediately in the
main app's dev server — no build or publish step required. The package's own `build`/`publish`
scripts exist for shipping it to npm for external consumers, not for wiring it into this app.

## Usage

### Importing Components

```typescript
import { Button, Card, CardContent } from "@mattofficial/veloce-ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@mattofficial/veloce-ui";
```

### Available Components

The exhaustive, current list is `packages/veloce-ui/src/index.ts` — it changes as components are
added, so treat this as illustrative rather than complete:

- **Basic**: `Button`, `Input`, `Textarea`, `Label`, `Switch`
- **Layout**: `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardDescription`, `CardFooter`, `CardAction`
- **Navigation**: `Sidebar`, `SidebarProvider`, `Tabs`, `DropdownMenu`
- **Overlays**: `Dialog`, `Sheet`, `Popover`, `Tooltip`
- **Data Display**: `Avatar`, `AvatarGroup`, `Table`, `ChartContainer`, `ChartTooltip`
- **Forms**: `Form`, `FormField`, `Select`, `Calendar`
- **Utilities**: `cn` utility function, `useIsMobile` hook

## Development

All commands run from `packages/veloce-ui/`, with `bun` (the package itself uses `npm`-named
scripts internally, but this monorepo runs everything through `bun run`).

### Building the package (for npm publishing, not required for local app dev)

```bash
cd packages/veloce-ui && bun run build
```

Produces `dist/index.js` (ESM), `dist/index.cjs` (CJS), `dist/index.d.ts`, and `dist/globals.css`
(exported via the package's `./styles` entry).

### Dev mode (Vite, for working on the package in isolation — e.g. Storybook)

```bash
cd packages/veloce-ui && bun run dev
```

### Testing

The package's own test runner is **Jest**, not the root app's Vitest:

```bash
cd packages/veloce-ui && bun run test
cd packages/veloce-ui && bun run test:watch
```

### Storybook

```bash
cd packages/veloce-ui && bun run storybook
```

### End-to-end (Playwright)

```bash
cd packages/veloce-ui && bun run e2e
```

## Architecture Notes

### Path Aliases

The package resolves its own internal imports the same way the main app resolves the package
itself — via a `paths` alias, not a runtime dependency:

```json
// packages/veloce-ui/tsconfig.json
{
  "paths": {
    "@/*": ["src/*"]
  }
}
```

This lets components import `@/lib/utils`, which resolves to `packages/veloce-ui/src/lib/utils.ts`.

### Client Components

The package entry point (`packages/veloce-ui/src/index.ts`) starts with `"use client"`, so
Next.js treats every export as a client component regardless of which server component imports it.

### Styling

- Uses Tailwind CSS v4 with the same configuration as the main app
- CSS variables are defined in the main app's `src/app/globals.css`
- Components rely on those variables for theming — see [ui_and_animations.md](ui_and_animations.md)
  for the glassmorphic conventions they're expected to follow

## Known Duplication (Unresolved)

`src/components/ui/` still has its own `card.tsx`, `chart.tsx`, `dialog.tsx`, `select.tsx`,
`sidebar.tsx`, `switch.tsx`, and `tabs.tsx` — separate implementations from the ones in
`packages/veloce-ui/src/components/`, not re-exports. As of this writing, 16 files still import
from `@/components/ui/*` for these instead of `@mattofficial/veloce-ui`. This is leftover from
before the package existed; migrating those imports and deleting the duplicates is the remaining
cleanup, tracked informally rather than as a ticket. `src/components/ui/form.tsx` is not part of
this — it is an app-specific `react-hook-form` wrapper, not a duplicate, and has no equivalent in
the package.

## Troubleshooting

1. **"use client" errors**: check that components requiring React hooks are only used in client
   components
2. **TypeScript errors**: run `cd packages/veloce-ui && bun run type-check`
3. **A component change isn't showing up**: confirm you edited `packages/veloce-ui/src/...` and
   not the `src/components/ui/` duplicate of the same name — see above

## Future Work

1. Increase test coverage for components (Jest suite is currently thin)
2. Expand Storybook documentation
3. Extract theme configuration into its own package
4. Audit and improve ARIA attributes
