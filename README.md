# MeetCloud / MeetClouding

MeetCloud is a social app for finding nearby people with shared interests and plans. Users create “clouds” representing what they want to do and discover nearby matches.

## Native rewrite

Work is isolated on `rewrite/native-app-foundation`. Current testing priority is Android; the browser preview has been removed to keep the test focus on the native client.

- `android/` — native Android client: Kotlin + Jetpack Compose.
- `ios/` — native iOS client: Swift + SwiftUI + MapKit (later priority).
- `backend/` — Python/FastAPI service foundation.
- `api/openapi.yaml` — initial shared API contract.
- `docs/native-screen-inventory.md` — initial screen/behavior inventory.
- `docs/architecture.md` — proposed system architecture and domain model.
- `docs/migration-plan.md` — implementation phases and exit criteria.
- `docs/design-system.md` — preserved source palettes and visual parity requirements.
- `docs/animation-inventory.md` — source-backed animation audit and native equivalents.
- `docs/product-review.md` — product validity, user safety, feature priorities, monetization hypotheses and validation plan.
- `docs/security.md` — initial security/privacy requirements and configuration finding.

The Android map UI is currently a prototype: the map is schematic, sample clouds are demo content, newly created clouds and interest markers are local-only, and no real location or backend data is used yet. Authentication, persistence, real cloud discovery, chat, media, push and production deployment remain to be implemented and tested. The UI must not represent mock users or generated coordinates as real people.

## Backend local development

See [backend/README.md](backend/README.md). The initial API exposes health endpoints only.

## Product and implementation principles

- Real native UI only: no WebView wrapper.
- Shared backend and OpenAPI contract for Android and iOS.
- Server-side authorization and provider secrets.
- Explicit location permissions; never silently substitute a fake user location.
- Preserve existing Russian, English, Belarusian, Ukrainian and Spanish localization.
- Keep the legacy web app and `main` unchanged until the native replacement is tested and a cutover is approved.
- Prove the core loop (discover a relevant cloud → express interest → chat → arrange an activity) before adding heavy gamification or paid feature restrictions.
- Keep basic discovery, messaging and safety controls available without a subscription.
