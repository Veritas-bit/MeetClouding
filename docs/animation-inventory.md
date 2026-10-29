# Legacy animation inventory and native migration plan

Status: initial source-backed audit. This is not a claim of complete animation discovery; remaining product screens need a file-by-file pass before visual parity can be signed off.

## Findings from the legacy source

| Area | Source evidence | Observed behavior / source parameters | Native equivalent to implement |
|---|---|---|---|
| Welcome entrance | `src/app/page.tsx` | Main welcome content uses `animate-in fade-in duration-1000 ease-out`: fade-in, 1000 ms, ease-out. | Fade/opacity entrance in Compose and SwiftUI; respect reduced-motion preferences. |
| Sheet overlay | `src/components/ui/sheet.tsx` | Radix dialog overlay uses `animate-in/out` and `fade-in-0/fade-out-0`. Exact duration is inherited from animation utilities, not set on this overlay. | Native dimming overlay, animated with the sheet presentation/dismissal. |
| Sheet panel | `src/components/ui/sheet.tsx` | Panel transitions in/out with directional slide classes for top/bottom/left/right. Closed duration is 300 ms; open duration is 500 ms; transition easing is `ease-in-out`. Default side is right. | Native sheet/bottom-sheet presentation appropriate to each flow; preserve directional intent, drag-to-dismiss when applicable, and modal accessibility. |
| Dialog overlay/content | `src/components/ui/dialog.tsx` | Overlay fades. Dialog content uses 200 ms duration, fade in/out, zoom from/to 95%, and slide positioning around 48% vertical. | Native alert/dialog or custom modal transition. Keep motion shorter/subtler than full-screen sheets. |
| Buttons | `src/components/ui/button.tsx` | Color transition via `transition-colors`; hover/active color changes; disabled state uses opacity 50% and disables pointer events. No explicit transition duration in this component. | Native pressed/disabled states with brief color/opacity feedback; do not invent a large scale bounce. |
| Wish composer focus | `src/components/want/WantSheet.tsx` | Gradient border wrapper uses `transition-all duration-300`; focus-within increases gradient opacity. Send icon color transitions; disabled when trimmed input is empty. | Animate focus emphasis over ~300 ms and maintain clear enabled/disabled states. |
| Random wish loading | `src/components/want/WantSheet.tsx` | A generating state displays a cloud icon, then clears after a 200 ms timeout. This is state feedback, not a documented animated keyframe. | Native short progress/placeholder state; don't claim a spin/pulse unless another source confirms it. |
| Accordion | `tailwind.config.ts` | `accordion-down` and `accordion-up` keyframes change height between 0 and Radix content height over 0.2 s ease-out. | Compose expand/shrink and SwiftUI disclosure expansion with equivalent quick easing. |
| Running progress | `tailwind.config.ts` | `running-progress`: horizontal translation from -100% to 100%, 2 s linear infinite. | Native indeterminate progress shimmer only in the component(s) that actually use this class. Locate usages before applying. |
| Global theme changes | `src/app/layout.tsx` | Theme provider uses class attribute, defaults to system, enables system theme, and sets `disableTransitionOnChange`. This explicitly disables CSS transitions during a theme swap. | Apply theme atomically to avoid intermediate unreadable colors; don't add a long animated color crossfade unless the product decision intentionally changes this behavior. |
| Base button and surface states | `src/components/ui/button.tsx`, `src/components/ui/sheet.tsx`, `src/components/ui/dialog.tsx` | Radix/Tailwind utility classes provide hover, focus-ring, active, disabled, overlay and modal states. | Native focus, pressed, disabled, modal and accessibility states; platform conventions are acceptable if the intent is preserved. |

## What is not yet confirmed

- Whether the project uses Framer Motion or another JS animation library elsewhere. It is not listed as a direct dependency in the inspected `package.json`; CSS/Tailwind and Radix transitions are confirmed.
- Exact animation behavior for map markers, chat message insertion, read/delivery indicators, media viewer, profile/settings, onboarding subpages and all other product routes. Do not invent effects based only on the feature names.
- Exact reduced-motion behavior in the web source. Native implementation must still respect OS accessibility settings.
- Which screens actually use `accordion-down` or `running-progress`; the keyframes exist in config, but usage must be located before migrating them.

## Implementation order

1. Finish source discovery for route-level transitions, map, chat, media, profile and settings components; add exact file evidence to this inventory.
2. Establish a shared motion vocabulary in each native app (durations, easing, visibility transitions) without copying browser-specific mechanics.
3. Implement native modal/sheet, welcome entrance, button states and observed loading transitions.
4. Add theme tokens and persistent theme selection separately; source currently disables transitions on theme change, so favor an atomic update initially.
5. Test normal and reduced-motion behavior, rapid repeated taps, keyboard interaction, dismissal and accessibility focus.
6. Compare actual native recordings/screenshots against the web app before marking any row complete.

## Definition of done

Every observed animation has a source reference, trigger, motion, timing/easing when present in source, native implementation status, and a test result. Unconfirmed effects remain explicitly marked unverified.
