# MeetClouding native rewrite — initial screen inventory

## Audit basis
Reviewed the current `main` tree, app shell, map/home/chat/profile flows, state stores, mock data, localization files, AI translation flow and visual tokens. This is a source-level inventory; runtime/build behavior remains to be verified.

The current project is a Next.js 15 / React web app. The rewrite target is two real native clients: Kotlin + Jetpack Compose for Android and Swift + SwiftUI for iOS. Do not ship a WebView wrapper.

## Screens and capabilities

| Area | Current source evidence | Native target |
|---|---|---|
| Welcome/auth | `src/app/auth/page.tsx`, profile store | Sign-in/sign-up, onboarding, session restore |
| Home | `src/app/(main)/main/page.tsx` | Create-cloud and find-cloud actions |
| Map | `src/app/(main)/map/page.tsx`, map components, location store | Native map, location permission, cloud markers, filters, profile/chat navigation |
| Create/search cloud | `src/components/want/WantSheet.tsx`, search components, wish/category data | Native sheets/forms, category selection, validation and publish/search |
| Profiles | `src/app/(main)/users/[id]/page.tsx`, user components | Public profile, avatar, bio and friendship actions |
| Profile edit | `src/app/(main)/profile/edit/page.tsx` | Native form, avatar picker/camera, validation |
| Chat list | `src/app/(main)/chats/page.tsx`, chat components | Conversation list, tabs, unread state and loading/empty/error states |
| Conversation | `src/app/(main)/chats/[id]/page.tsx` | History, sending, receipts, replies/edits, translation, media/location where confirmed |
| Chat gallery | `src/app/(main)/chats/[id]/gallery/page.tsx` | Native media gallery and system share/save |
| Search/categories | `src/app/(main)/search/page.tsx`, `src/app/(main)/want/categorize/page.tsx` | Search, category chooser and filters |
| Settings | `src/app/(main)/settings/**` | Account, notifications, language, blocked users, help/about and premium UI |
| Localization | `src/locales/{ru,en,be,uk,es}.json` | Preserve all five locales and test parity |
| AI translation | `src/ai/flows/translate-message.ts` | Backend provider interface; no AI key in clients |

## Visual identity
- MeetCloud / MeetClouding brand.
- Nunito typeface in the web app.
- Light theme: vivid violet and magenta; dark theme: deep blue with acid-green and bright-blue accents. Early-morning and evening themes also exist.
- Mobile-first layout with header, bottom navigation, bottom sheets, map-first discovery, compact chat rows and gradient primary action.
- Preserve category colors, icon meanings, information hierarchy and transitions where possible; use platform-native interactions rather than browser conventions.

## Data and behavior cautions
- `src/lib/mock-data.ts` is fixture data, not production persistence.
- `src/lib/location-store.ts` falls back to Moscow coordinates on location failure. Native apps must never silently represent a fallback city as the user's actual location.
- The map screen generates random markers from mock users. Replace them with authorized backend results; random markers must never be shown as real people.
- `src/lib/profile-store.ts` uses browser local storage. Native credentials belong in Android Keystore-backed storage / iOS Keychain; shared profile data belongs on the backend.
- Message types suggest translation, image/video, replies, edits, receipts, location and timed/view-once media. Confirm UI behavior and lifecycle semantics before implementing each.
- `docs/blueprint.md` describes a different app named LinguaLink and is not a reliable MeetCloud specification.

## Still to audit
- All routes and settings subpages; exact create-cloud fields, visibility, expiry and deletion behavior.
- Media capture, gallery, retention and view-once semantics.
- Whether a real backend exists outside this repository.
- Native map provider/key restrictions and visual parity.
- Clean checkout build/typecheck status and complete design reference screenshots.
