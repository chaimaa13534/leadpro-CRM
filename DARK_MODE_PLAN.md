# Dark Mode Improvement Plan

## Information Gathered
- Dark mode is controlled via `.dark` class on `<html>` + CSS custom properties in `global.css`
- Theme toggling via `ThemeProvider` / `useTheme` hook (localStorage persisted)
- All UI components use shadcn/ui pattern with `cn()` utility (clsx + tailwind-merge)
- Framer Motion already used in: Modal, Dropdown, MobileDrawer, PageTransition, KPICard, ChartCard
- Components to improve: Button, Card, Input, Select, Checkbox, Radio, Modal, Dropdown, Badge, Alert, Tabs, Accordion, Progress, Avatar, Skeleton, Pagination, KPICard, Sidebar, Topbar, MobileDrawer, Footer, Breadcrumb

## Plan

### 1. `src/styles/global.css` — Dark Mode Color Palette Overhaul
- Replace near-black `--color-background: #09090b` with richer dark gray `#0a0a0f`
- Add layered surface system:
  - `--color-surface` → `#131318` (was `#141417`)
  - `--color-surface-elevated` → `#1a1a22` (new - for cards/modals)
  - `--color-surface-hover` → `#1e1e28` (was `#1a1a1f`)
  - `--color-surface-active` → `#252530` (was `#222228`)
- Improve borders (subtler, more transparent):
  - `--color-border` → `#1e1e2a` (was `#1f2028`)
  - `--color-border-hover` → `#2a2a3a` (was `#2e2f3a`)
- Enhance text contrast:
  - `--color-text-primary` → `#f0f0f5` (was `#ededf0`)
  - `--color-text-secondary` → `#a0a0b8` (was `#a8b0c3`)
  - `--color-text-tertiary` → `#6b6b82` (was `#636c87`)
- Improve accent: `#818cf8` (indigo-400) with better hover/active states
- Better semantic colors for dark mode (success, warning, danger, info)
- Redesign shadows for depth layering
- Better skeleton colors
- Add `--color-surface-overlay` for modals/popovers

### 2. `src/components/ui/Button.tsx` — Premium Button Design
- Add subtle gradient to primary variant: `bg-gradient-to-b from-accent to-accent-hover`
- Smooth hover animations with `transform-gpu transition-all duration-150 ease-out`
- Active press effect: `active:scale-[0.98]`
- Add `shadow-sm` on primary, `shadow-xs` on secondary
- Better loading state with colored spinner
- Improve disabled state styling
- Add focus-visible rings consistent with design system
- Better icon spacing

### 3. `src/components/ui/Card.tsx` — Card Enhancement
- Add `elevated` variant with better shadow: `shadow-lg` in dark mode
- Improve hover effect for interactive cards: `hover:border-border-hover hover:shadow-md hover:-translate-y-[1px]`
- Add subtle inner border glow
- Better padding defaults

### 4. `src/components/ui/Input.tsx` — Input Improvement
- Better focus ring with accent color glow
- Smoother border transitions
- Better error state styling with subtle background tint
- Improved disabled style
- Better label styling

### 5. `src/components/ui/Select.tsx` — Select Improvement
- Better chevron icon positioning
- Improved focus ring
- Better option styling (dropdown menu via browser)
- Error state improvements

### 6. `src/components/ui/Modal.tsx` — Modal Enhancement
- Better backdrop: `bg-black/60 backdrop-blur-sm`
- Smoother animation curve
- Better header with tighter spacing
- Elevated surface with `bg-surface-elevated`
- Better close button positioning and hover

### 7. `src/components/ui/Dropdown.tsx` — Dropdown Enhancement
- Better elevation with shadow and border
- Item hover animations
- Better separator styling
- Keyboard navigation improvements

### 8. `src/components/ui/Checkbox.tsx` — Checkbox Improvement
- Smoother check animation with transition
- Better focus ring
- Better hover state
- Better checked state styling

### 9. `src/components/ui/Radio.tsx` — Radio Improvement
- Better styling consistency with Checkbox
- Improved focus ring
- Better checked state animation

### 10. `src/components/ui/Badge.tsx` — Badge Enhancement
- Better dark mode contrast for all variants
- Add soft glow effect for semantic variants
- Improve dot styling

### 11. `src/components/ui/Alert.tsx` — Alert Improvement
- Better dark mode backgrounds with transparency
- Improved border styling
- Better icon placement
- Better text contrast in dark mode

### 12. `src/components/ui/Tabs.tsx` — Tabs Enhancement
- Better active indicator animation
- Improved hover states
- Better count badge styling
- Add Framer Motion for indicator

### 13. `src/components/ui/Pagination.tsx` — Pagination Improvement
- Better active page styling
- Improved hover states
- Better disabled states
- Responsive improvements

### 14. `src/components/ui/Accordion.tsx` — Accordion Enhancement
- Smooth height animation with Framer Motion (instead of CSS max-h)
- Better chevron rotation animation
- Improved hover states on headers
- Better content padding

### 15. `src/components/ui/Skeleton.tsx` — Skeleton Enhancement
- Better shimmer gradient for dark mode
- Improved border radius consistency
- Add more skeleton patterns

### 16. `src/components/layout/Sidebar.tsx` — Sidebar Enhancement
- Better active link styling with left border indicator
- Improved hover states with subtle background
- Better section headers with uppercase tracking
- User section improvements
- Collapse button styling
- Better icon colors for active/inactive states
- Add Framer Motion for collapse animation

### 17. `src/components/layout/Topbar.tsx` — Topbar Enhancement
- Better backdrop blur effect
- Improved search bar styling
- Better button spacing and hover states
- Improved notification badge
- Better avatar styling

### 18. `src/components/layout/MobileDrawer.tsx` — MobileDrawer Enhancement
- Better backdrop with blur
- Smoother slide animation
- Better close button positioning

### 19. `src/lib/motion-variants.ts` — Animation Refinement
- Add more reusable variants (stagger, list item, card enter)
- Refine existing curves for premium feel
- Add hover/tap scale variants

### 20. `src/components/ui/KPICard.tsx` — KPI Card Enhancement
- Better dark mode styling
- Improved trend indicators
- Better spacing and typography
- Add hover elevation effect

### 21. `src/components/ui/Progress.tsx` — Progress Enhancement
- Better dark mode track styling
- Improved label positioning
- Better variant colors in dark mode

### 22. `src/components/ui/Avatar.tsx` — Avatar Enhancement
- Better fallback styling
- Improved size consistency
- Better dark mode colors

## Dependent Files
- `src/styles/global.css` — Main token file (needs to be edited first)
- All component files listed above reference CSS variables from global.css
- `src/lib/motion-variants.ts` — Used by multiple components

## Followup Steps
- After editing all files, the dark mode will be fully improved
- No installation needed (only CSS + component changes)
- No testing needed (visual changes only, no logic changes)

