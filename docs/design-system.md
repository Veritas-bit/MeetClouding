# Native visual parity specification

## Source of truth

The canonical source is `src/app/globals.css` on the legacy `main` branch. This document preserves the palette before native implementation. Values below are the source CSS HSL triplets, not approximations. Keep them unchanged when implementing Kotlin/Compose and SwiftUI; convert HSL to platform colors without shifting hue or contrast.

## Theme palettes

### Light (root/default)

| Token | HSL |
|---|---|
| background | `0 0% 100%` |
| foreground | `222.2 84% 4.9%` |
| card | `340 100% 97%` |
| card-foreground | `222.2 84% 4.9%` |
| popover | `0 0% 100%` |
| popover-foreground | `222.2 84% 4.9%` |
| primary | `271 91% 65%` |
| primary-foreground | `0 0% 100%` |
| secondary | `300 81% 59%` |
| secondary-foreground | `0 0% 100%` |
| muted | `210 40% 96.1%` |
| muted-foreground | `215.4 16.3% 46.9%` |
| accent | `204 100% 50%` |
| accent-foreground | `222.2 47.4% 11.2%` |
| destructive | `0 84.2% 60.2%` |
| destructive-foreground | `0 0% 98%` |
| border / input | `214.3 31.8% 91.4%` |
| ring | `271 91% 65%` |
| chart-1..5 | `271 70% 50%`, `300 70% 50%`, `330 70% 50%`, `224 70% 50%`, `0 70% 50%` |
| sidebar-background | `215 28% 97%` |
| sidebar-foreground | `222.2 84% 4.9%` |
| sidebar-primary / ring | `271 91% 65%` |
| sidebar-primary-foreground | `0 0% 100%` |
| sidebar-accent | `210 40% 94%` |
| sidebar-accent-foreground | `222.2 47.4% 11.2%` |
| sidebar-border | `214.3 31.8% 91.4%` |
| radius | `0.5rem` |

### Dark

| Token | HSL |
|---|---|
| background | `224 71% 4%` |
| foreground | `220 15% 90%` |
| card | `224 71% 8%` |
| card-foreground | `220 15% 90%` |
| popover | `224 71% 4%` |
| popover-foreground | `220 15% 90%` |
| primary | `80 90% 50%` |
| primary-foreground | `224 71% 4%` |
| secondary | `210 90% 60%` |
| secondary-foreground | `224 71% 4%` |
| muted | `223 47% 11%` |
| muted-foreground | `220 15% 65%` |
| accent | `54 96% 54%` |
| accent-foreground | `224 71% 4%` |
| destructive | `0 84% 60%` |
| destructive-foreground | `0 0% 98%` |
| border | `224 71% 12%` |
| input | `224 71% 10%` |
| ring | `80 90% 50%` |
| chart-1..5 | `80 90% 50%`, `210 90% 60%`, `330 70% 50%`, `224 70% 50%`, `0 70% 50%` |
| sidebar-background | `224 71% 6%` |
| sidebar-foreground | `220 15% 90%` |
| sidebar-primary / ring | `80 90% 50%` |
| sidebar-primary-foreground | `224 71% 4%` |
| sidebar-accent | `210 90% 60%` |
| sidebar-accent-foreground | `224 71% 4%` |
| sidebar-border | `224 71% 12%` |
| radius | `0.5rem` |

### Early morning

| Token | HSL |
|---|---|
| background / popover | `30 50% 98%` |
| foreground | `30 10% 20%` |
| card | `30 50% 95%` |
| card-foreground / popover-foreground | `30 10% 20%` |
| primary / ring | `350 90% 70%` |
| primary-foreground | `30 10% 10%` |
| secondary | `25 95% 75%` |
| secondary-foreground | `30 10% 10%` |
| muted | `30 40% 94%` |
| muted-foreground | `30 10% 45%` |
| accent | `20 100% 70%` |
| accent-foreground | `30 10% 10%` |
| destructive | `0 84% 60%` |
| destructive-foreground | `0 0% 98%` |
| border / input | `30 40% 90%` |
| chart-1..5 | `350 80% 60%`, `25 85% 65%`, `50 80% 60%`, `200 80% 70%`, `0 70% 50%` |
| sidebar-background | `30 50% 96%` |
| sidebar-foreground | `30 10% 20%` |
| sidebar-primary / ring | `350 90% 70%` |
| sidebar-primary-foreground | `30 10% 10%` |
| sidebar-accent | `25 95% 75%` |
| sidebar-accent-foreground | `30 10% 10%` |
| sidebar-border | `30 40% 90%` |
| radius | `0.5rem` |

### Evening

| Token | HSL |
|---|---|
| background / popover | `220 30% 12%` |
| foreground | `35 30% 90%` |
| card | `220 30% 15%` |
| card-foreground / popover-foreground | `35 30% 90%` |
| primary / ring | `25 90% 60%` |
| primary-foreground | `220 30% 10%` |
| secondary | `350 70% 55%` |
| secondary-foreground | `0 0% 100%` |
| muted | `220 30% 20%` |
| muted-foreground | `35 30% 70%` |
| accent | `35 95% 65%` |
| accent-foreground | `220 30% 10%` |
| destructive | `0 84% 60%` |
| destructive-foreground | `0 0% 98%` |
| border | `220 30% 22%` |
| input | `220 30% 18%` |
| chart-1..5 | `25 90% 60%`, `350 70% 55%`, `30 80% 50%`, `200 70% 50%`, `0 70% 50%` |
| sidebar-background | `220 30% 14%` |
| sidebar-foreground | `35 30% 90%` |
| sidebar-primary / ring | `25 90% 60%` |
| sidebar-primary-foreground | `220 30% 10%` |
| sidebar-accent | `350 70% 55%` |
| sidebar-accent-foreground | `0 0% 100%` |
| sidebar-border | `220 30% 22%` |
| radius | `0.5rem` |

## Shared design tokens and constraints

- Typeface: Nunito (legacy app loads it via `next/font/google`); bundle a properly licensed font file in native clients if permitted, otherwise document the fallback.
- Light theme's primary/secondary colors form the familiar violet-to-magenta brand gradient. Dark, Early morning and Evening use their own semantic primary/secondary colors.
- Rounded cards, rounded primary actions, gradient actions where present in the original screen, category colors, and compact mobile-first layouts.
- Preserve semantic tokens for foreground, surfaces, borders, input, focus ring, disabled/loading/error states, chart/sidebar surfaces, and safe-area behavior.
- The web provider uses `defaultTheme="system"` with system mode enabled, but also defines named `early-morning` and `evening` classes. Verify the actual theme picker/options and persistence in source before finalizing native theme names and defaults.
- This is a source palette record only. Native theme implementation is intentionally deferred until after the source audit; do not treat the starter screens' hard-coded colors as final.

## Animation parity requirements

Audit the legacy UI and record source evidence before declaring parity. At minimum cover screen/tab transitions, sheet/modal, button feedback, map markers/cloud details, chat list updates and status indicators, media viewer, theme changes, keyboard/form validation, loading states and reduced-motion behavior. Use Compose and SwiftUI native equivalents, preserving interaction intent, timing/easing where discoverable, and motion hierarchy.

## Acceptance criteria

1. All four named palettes remain documented with source values.
2. Native apps eventually expose persistent theme selection and apply semantic tokens consistently to screens, navigation, map overlays, sheets and dialogs.
3. Representative screenshots are compared against the web reference at equivalent dimensions.
4. Animation inventory records source file/component, trigger, observed behavior, source timing/easing where discoverable, and native implementation status.
5. Reduced-motion settings are respected; animations never block interaction.
6. Visual parity is not complete until both clients build and screenshot/state checks pass.
