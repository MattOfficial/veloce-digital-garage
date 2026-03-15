# Veloce UI Design System & Animation Patterns

## Overview
The UI adopts a specific design system referred to as "Veloce UI". It focuses on a premium, dark-mode, glassmorphic aesthetic to create an immersive, futuristic application feel. Any future components MUST adhere to these exact paradigms.

## CSS Styling Guidelines (Tailwind CSS V4)
Do NOT use generic standard Tailwind light-mode styles (e.g. `bg-white`, `text-black`, `border-gray-200`) anywhere in `(dashboard)` routes. 

1. **Backdrops and Surfaces:**
   - Surfaces (Cards, Modals, Sidebars) should rely heavily on glassmorphism.
   - Use deeply translucent backgrounds rather than solid dark colors: `bg-white/5` or `bg-black/20`.
   - Apply intense blur filters to blend with the interactive background layers: `backdrop-blur-xl` or `backdrop-blur-2xl`.

2. **Borders and Shadows:**
   - Use crisp, faint borders for container separation: `border-white/5` or `border-white/10`. Avoid thick opaque borders.
   - To build depth, leverage `shadow-md`, `shadow-lg`, inner shadows (`shadow-inner`), and specific drop shadows.

3. **Background Effects:**
   - The Root Layout (`src/app/layout.tsx`) includes an `<InteractiveBackground />` component. This component tracks the user's cursor position (`useMousePosition`) and renders a radial highlight interacting with a static "dot matrix" SVG pattern (`bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]`).
   - The glassmorphic surfaces (see point 1) allow this interactive light effect to softly bleed into the application containers.

4. **Accents:**
   - Instead of raw solid colors, try leveraging soft mesh gradients, e.g. `bg-gradient-to-br from-indigo-500/10 to-blue-600/10`.
   - Ensure `lucide-react` icons are distinct but not stark white. Rely on theme opacity (`text-white/70`, `text-primary`, `text-muted-foreground`).

## Animation (`framer-motion` & Next.js Top Loader)
We use a combination of synchronized `framer-motion` entries and global Next.js loading transitions to maintain a buttery smooth interface that never feels like it's blocking the user.

### Next.js Route Transitions
Veloce Tracker uses **`nextjs-toploader`** integrated into `RootLayout` alongside React **`<Suspense>` boundaries**. 
When transitioning across `/(dashboard)/*` routes, `nextjs-toploader` immediately shoots a glowing line across the top of the browser to guarantee responsive UI feedback. During the server fetch, `loading.tsx` renders `<SpeedometerLoading />`—a dynamic math-calculated physics simulation of an accelerating vehicle dashboard. Do NOT attempt to build custom loading boolean states for route transitions; rely on these native Suspense fallbacks.

### The `MotionWrapper` Component
Located statically at `src/components/motion-wrapper.tsx`. By default, this component creates a smooth `slide-up` (from `y: 20` to `0`) and `fade-in` (from `opacity: 0` to `1`) animation using the viewport (`whileInView`).

**How to Use:**
When rendering blocks of data (dashboard KPI cards, long tables, or `.map()`-generated arrays of components), wrap the immediate containers in `<MotionWrapper>`. To achieve a cascading "stagger" effect, manually increment the `delay` prop for each logical block from top-to-bottom.

**Example Pattern:**
```tsx
import { MotionWrapper } from "@/components/motion-wrapper";

export default function AnalyticsDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
        {/* KPI 1 slides in at 100ms */}
        <MotionWrapper delay={0.1}>
            <Card className="bg-white/5 backdrop-blur-2xl border-white/5 shadow-md">
                ... 
            </Card>
        </MotionWrapper>

        {/* Arrays automatically cascade based on index length */}
        {items.map((item, index) => (
             <MotionWrapper key={item.id} delay={0.3 + (index * 0.1)}>
                 <ListItem data={item} />
             </MotionWrapper>
        ))}
    </div>
  )
}
```

## Form Components (Shadcn UI)
The project utilizes the `shadcn/ui` ecosystem (`components/ui/*`). Several core primitives (`Card`, `Dialog`, `Sidebar`) have been fundamentally overridden to force the translucent styling globally. When extending from Shadcn or `radix-ui`, do not revert back to hard-coded `bg-background` and `border-border` colors if they obscure the interactive matrix wallpaper.

## Dashboard Layout Patterns

- Prefer tabbed layouts when a dashboard surface contains multiple distinct analytic modes. The current app uses this pattern in:
  - `src/app/dashboard/maintenance/maintenance-client.tsx`
  - `src/app/dashboard/insights/page.tsx`
- Use rounded tab lists that feel native to the glassmorphic shell: `rounded-full` on the list and triggers, with simple 2-3 tab groupings.
- Keep each tab internally cohesive. For example, the Insights route separates `Running Costs` from `Distance` instead of stacking all analytics into one scroll-heavy page.

## AI Assistant Paradigms (`VeloceCopilot`)
The UI implements an always-accessible global chat interface for the LLM Copilot:
- **Floating Action Button (FAB):** Placed `fixed bottom-6 right-6` with pulsating ambient scale bounds.
- **Chat Window:** Employs maximum backdrop blur and strict border containment (`animate-in slide-in-from-bottom-5 fade-in duration-300`).
- **Rich Text Rendering:** The application explicitly implements `react-markdown` and `remark-gfm` nested inside `prose prose-sm dark:prose-invert`. All generative AI output MUST go through this markdown parser to preserve the structural styling intended by LLMs (bolding, lists, code fences). Do not render literal `msg.content` text fields.
- **Source-aware assistant visuals:** The assistant iconography now changes based on the response path. Browser-local, local NLP, provider-backed server responses, analytics replies, and guardrail refusals each have distinct avatars instead of raw debug labels.
