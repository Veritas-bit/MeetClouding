# Native visual parity specification

## Source of truth

The legacy web app's `src/app/globals.css` defines four named visual schemes. The native rewrite must preserve all four as user-selectable themes, rather than hard-code a single dark palette. The values below are transcribed from the current source CSS; convert HSL to each platform's color representation without visually shifting hue or contrast.

## Theme palette

The source CSS uses HSL triplets.

### Light (default root tokens)
- background: `0 0% 100%`; foreground: `222.2 84% 4.9%`
- card: `340 100% 97%`; card foreground: `222.2 84% 4.9%`
- primary: `271 91% 65%`; primary foreground: white
- secondary: `300 81% 59%`; secondary foreground: white
- accent: `204 100% 50%`
- muted: `210 40% 96.1%`; muted foreground: `215.4 16.3% 46.9%`
- border/input: `214.3 31.8% 91.4%`; radius: `0.5rem`

### Dark
- background: `224 71% 4%`; foreground: `220 15% 90%`
- card: `224 71% 8%`
- primary: acid green `80 90% 50%`; secondary: bright blue `210 90% 60%`
- accent: acid yellow `54 96% 54%`
- muted: `223 47% 11%`; border: `224 71% 12%`
- radius: `0.5rem`

### Early morning
- background: `30 50% 98%`; foreground: `30 10% 20%`
- card: `30 50% 95%`
- primary: warm pink `350 90% 70%`; secondary: peach `25 95% 75%`
- accent: `20 100% 70%`
- muted: `30 40% 94%`; border: `30 40% 90%`
- radius: `0.5rem`

### Evening
- background: `220 30% 12%`; foreground: `35 30% 90%`
- card: `220 30% 15%`
- primary: warm orange `25 90% 60%`; secondary: rose `350 70% 55%`
- accent: gold `35 95% 65%`
- muted: `220 30% 20%`; border: `220 30% 22%`
- radius: `0.5rem`

## Shared design tokens to extract and verify

- Typeface: Nunito where licensed/available; use platform fallback only when required.
- Primary action: violet-to-magenta gradient in light/brand surfaces, unless the selected theme defines a different semantic primary.
- Shape system: rounded cards, rounded primary actions and bottom sheets.
- Layout: mobile-first, map-forward discovery, compact conversation rows, category colors and consistent icon meaning.
- Preserve status colors, disabled/loading/error states, elevation, borders, text contrast and safe-area behavior.
- Keep theme selection persistent across launches and consistent across every screen, map overlays, sheets, navigation bars and dialogs.
- Do not force the operating-system dark appearance if the user selected another in-app theme.

## Animation parity requirements

The native implementation must audit the legacy UI and record source evidence for each animation before declaring parity. At minimum, test and implement:
- tab/screen transitions and navigation state;
- sheet/modal presentation and dismissal, including drag-to-dismiss where present;
- button press/disabled/loading feedback;
- map marker selection and cloud detail presentation;
- chat message insertion, send progress, read/delivery indicators and list updates;
- image/video viewer and gallery transitions;
- theme change transition without a flash or unreadable intermediate state;
- keyboard appearance, focus and form validation;
- reduced-motion/accessibility behavior.

Use native animation systems (Compose animation APIs and SwiftUI animation/transition APIs). Do not attempt to reproduce browser CSS animations literally if the platform equivalent looks and behaves better, but preserve timing, easing, hierarchy and interaction intent. Avoid adding decorative animations that do not exist in the source product.

## Acceptance criteria

1. All four named themes can be selected in both apps and persist after restart.
2. Every screen uses semantic theme tokens; no screen hard-codes a palette independently.
3. Representative screenshots for each theme are compared against the web reference at equivalent dimensions.
4. Animation inventory includes source file/component, trigger, expected motion, duration/easing where discoverable, and native implementation status.
5. Reduced-motion settings are respected and animations do not block interaction.
6. Visual parity is not considered complete until both clients build and screenshot/state checks pass.
