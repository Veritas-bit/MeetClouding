# MeetCloud / MeetClouding

MeetCloud is a social app for finding nearby people with shared interests and plans. Users create “clouds” representing what they want to do and discover nearby matches.

## Browser preview

A responsive, interactive map-first prototype is available at `/preview` in the Next.js app. It is designed for quick inspection on desktop and mobile browsers and is separate from the native clients.

To run it locally:

```bash
npm install
npm run dev
```

Then open `http://localhost:9002/preview` on the computer. To view it on a phone connected to the same Wi-Fi, open `http://<computer-LAN-IP>:9002/preview` and allow the development server through the computer firewall if prompted.

**Preview limitations:** the map is schematic, cloud cards are demo content, and creating a cloud or marking interest only changes local page state. No real location is requested and no data is sent to a backend. The page is a browser prototype, not a WebView wrapper around the native apps. A public shareable URL requires deployment of this branch to a web host.

## Current product reference

The existing `main` branch contains the legacy Next.js web app. Its UI, category catalog, translations and workflows are the reference for the native rewrite; it is not the implementation target for shipped mobile apps.

## Native rewrite

Work is isolated on `rewrite/native-app-foundation`.

- `android/` — native Android client: Kotlin + Jetpack Compose.
- `ios/` — native iOS client: Swift + SwiftUI + MapKit.
- `backend/` — Python/FastAPI service foundation.
- `api/openapi.yaml` — initial shared API contract.
- `docs/native-screen-inventory.md` — initial screen/behavior inventory.
- `docs/architecture.md` — proposed system architecture and domain model.
- `docs/migration-plan.md` — implementation phases and exit criteria.
- `docs/design-system.md` — preserved source palettes and visual parity requirements.
- `docs/animation-inventory.md` — source-backed animation audit and native equivalents.
- `docs/product-review.md` — product validity, user safety, feature priorities, monetization hypotheses and validation plan.
- `docs/security.md` — initial security/privacy requirements and configuration finding.

The mobile projects currently contain starter shells, not feature-complete apps. Authentication, persistence, real cloud discovery, chat, media, push and production deployment remain to be implemented and tested. The UI must not represent mock users or generated coordinates as real people.

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
