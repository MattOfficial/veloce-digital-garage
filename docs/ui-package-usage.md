# Veloce UI Package (@veloce/ui)

This document describes the UI component package extracted from the main application into a standalone package.

## Overview

The `@veloce/ui` package contains all reusable UI components from the Veloce Digital Garage application. It's built as a standalone library using Vite with TypeScript and Tailwind CSS.

## Current Status

✅ **Migration Complete** - All UI components have been successfully extracted and migrated.

### What's Been Done:

1. **Package Setup**: Created `packages/ui/` with proper build configuration (Vite + TypeScript)
2. **Component Migration**: All UI components from `src/components/ui/` moved to `packages/ui/src/components/`
3. **Import Fixes**: Fixed malformed import statements with nested braces (e.g., `import { { Button }, { Dialog } } from "@veloce/ui"`)
4. **Client Component Support**: Added `"use client"` directive to package entry point
5. **Build Verification**: Both UI package and main application build successfully
6. **Duplicate Components**: Legacy components remain in `src/components/ui/` for backward compatibility during migration

## Usage

### Installation

The package is already included as a workspace dependency in the monorepo:

```json
// package.json
{
  "dependencies": {
    "@veloce/ui": "workspace:*"
  }
}
```

### Importing Components

```typescript
// Correct import syntax
import { Button, Card, CardContent } from "@veloce/ui";

// Multiple components from same import
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@veloce/ui";
```

### Available Components

- **Basic**: `Button`, `Input`, `Textarea`, `Label`, `Switch`
- **Layout**: `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardDescription`, `CardFooter`, `CardAction`
- **Navigation**: `Sidebar`, `SidebarProvider`, `Tabs`, `DropdownMenu`
- **Overlays**: `Dialog`, `Sheet`, `Popover`, `Tooltip`
- **Data Display**: `Avatar`, `Table`, `ChartContainer`, `ChartTooltip`
- **Forms**: `Form`, `FormField`, `Select`, `Calendar`
- **Utilities**: `cn` utility function, `useIsMobile` hook

## Development

### Building the Package

```bash
cd packages/ui
npm run build
```

This creates:

- `dist/index.js` (ES modules)
- `dist/index.cjs` (CommonJS)
- `dist/index.d.ts` (TypeScript declarations)

### Development Mode

```bash
cd packages/ui
npm run dev
```

### Testing

```bash
cd packages/ui
npm test
npm run test:watch
```

### Storybook

```bash
cd packages/ui
npm run storybook
```

## Architecture Notes

### Path Aliases

The UI package uses TypeScript path aliases internally:

```json
// packages/ui/tsconfig.json
{
  "paths": {
    "@/*": ["src/*"]
  }
}
```

This allows components to import utilities like `@/lib/utils` which resolves to `packages/ui/src/lib/utils.ts`.

### Client Components

All components are marked as client components via the package entry point (`packages/ui/src/index.ts`). This ensures Next.js treats them correctly when imported into server components.

### Styling

- Uses Tailwind CSS with the same configuration as the main app
- CSS variables are defined in the main app's `globals.css`
- Components rely on the main app's CSS variables for theming

## Migration Status

### Completed

- ✅ All UI components extracted to `@veloce/ui`
- ✅ Import statements fixed across the codebase
- ✅ Builds successfully in both dev and production
- ✅ "use client" directive properly added

### Remaining (Optional Cleanup)

- ⚠️ Duplicate components in `src/components/ui/` can be removed
- ⚠️ Update remaining imports that still use `@/components/ui/`

### Files Using @veloce/ui

Currently 7 files import from `@veloce/ui`:

1. `src/app/dashboard/dashboard-client.tsx`
2. `src/app/dashboard/insights/page.tsx`
3. `src/app/dashboard/fuel/page.tsx`
4. `src/app/dashboard/maintenance/maintenance-client.tsx`
5. `src/components/custom-tracker-widget.tsx`
6. `src/components/add-tracker-modal.tsx`
7. `src/app/dashboard/layout.tsx`

## Troubleshooting

### Common Issues

1. **Import syntax errors**: Ensure imports don't have nested braces
2. **"use client" errors**: Check that components requiring React hooks are only used in client components
3. **TypeScript errors**: Run `npm run type-check` in the UI package
4. **Build failures**: Ensure both UI package and main app are built

### Fix Script

If import syntax issues reappear, run:

```bash
node scripts/fix-ui-imports-final.js
```

This script fixes malformed imports with nested braces.

## Future Work

1. **Version Management**: Add proper versioning and publishing workflow
2. **Documentation**: Expand Storybook documentation
3. **Testing**: Increase test coverage for components
4. **Theming**: Extract theme configuration into separate package
5. **Accessibility**: Audit and improve ARIA attributes
