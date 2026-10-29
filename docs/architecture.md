# MeetClouding architecture (proposal)

## Goals
- Two real native clients: Android with Kotlin + Jetpack Compose; iOS with Swift + SwiftUI.
- No WebView, hybrid wrapper, Next.js runtime or React Native in shipped apps.
- Preserve the product experience described in `docs/native-screen-inventory.md`.
- One backend/API contract shared by both clients; secrets and privileged operations stay server-side.

## Proposed repository layout

```text
android/                 Kotlin / Compose project
 ios/                    Swift / SwiftUI project
backend/app/
  api/                   Versioned REST and realtime entry points
  core/                  Configuration, auth, errors, logging
  modules/{profiles,clouds,geo,chat,media,notifications,ai,moderation}/
backend/tests/
database/{migrations,seeds}/
api/openapi.yaml
infra/
docs/
```

## Clients

### Android
- Kotlin, Compose, Navigation Compose, ViewModel, coroutines/Flow and repository interfaces.
- Room only for intentional local cache/offline support; backend remains authoritative.
- Android system photo picker for ordinary media selection; CameraX only for in-app capture.
- Native location with while-in-use permission by default.
- Android Keystore-backed secure session storage; FCM for push.

### iOS
- Swift, SwiftUI, NavigationStack and structured concurrency.
- MapKit is the default native-map candidate, pending parity/provider review against the existing Yandex map.
- PhotosPicker for ordinary media selection; AVFoundation only for in-app capture.
- Core Location with when-in-use permission by default.
- Keychain for credentials; APNs for push.

Share OpenAPI definitions, domain rules and acceptance tests—not UI code. Every network-backed screen needs loading, empty, offline, permission-denied and error states. Never use mock users or random coordinates in production.

## Backend and data

Proposed starting point: Python + FastAPI modular monolith. Supabase Auth, PostgreSQL/PostGIS and Storage are candidates, not yet a locked decision. Validate cost, hosting region, backup/export and privacy requirements before production setup.

- Validate auth tokens and authorize every protected operation on the server.
- PostgreSQL stores profiles, clouds, friendships, conversations, messages, moderation records and device tokens.
- PostGIS supports proximity queries and spatial indexes.
- Store media privately; expose only authenticated access or short-lived signed URLs.
- Use REST for history and retry; define authenticated realtime events and reconnect behavior for chat.
- Translation and nickname generation go through backend provider interfaces. Provider keys never ship in apps.
- Push payloads should avoid sensitive message content unless explicitly designed and documented otherwise.

## Initial domain model

- `profiles`: auth subject ID, nickname, bio, avatar reference, locale, timestamps.
- `clouds`: owner, text, category, geospatial point, visibility/status, timestamps and optional expiry.
- `friendships`: requester, recipient, status, timestamps and unique pair constraints.
- `conversations`: membership and timestamps.
- `messages`: conversation, sender, body/type, media references, reply/edit metadata and timestamps.
- `message_receipts`: per-recipient delivery/read state where required.
- `media_assets`: storage key, owner, type, size/dimensions/duration and lifecycle state.
- `blocks`, `reports`, `device_tokens`: moderation, safety and push registration.

Finalize schema from audited workflows. Use migrations, foreign keys, indexes, uniqueness constraints and explicit retention rules. Do not store precise location history without a justified feature requirement.

## API conventions

- REST prefix `/api/v1`; publish `api/openapi.yaml` as the contract.
- Stable opaque IDs, UTC timestamps, cursor pagination, consistent error envelopes and request IDs.
- Initial resources may include `/me`, `/profiles/{id}`, `/clouds`, `/clouds/nearby`, `/friendships`, `/conversations`, `/conversations/{id}/messages`, `/media/upload-url`, `/devices` and `/ai/translate`.
- Validate input, ownership, upload limits and rate limits server-side.
- Specify realtime event names, reconnect and resume semantics before implementing chat sync.

## Visual parity

1. Capture reference screenshots for each screen and state.
2. Record spacing, typography, colors, radii, icons, gradients and transitions as design tokens.
3. Rebuild with native components while retaining the same information hierarchy.
4. Compare screenshots on representative screen sizes.
5. Allow deliberate platform-specific differences for accessibility and platform conventions.

## Decisions before production

Hosting/region; Supabase versus self-hosted data/auth/storage; map provider and key restrictions; realtime delivery guarantees; cloud visibility/expiry/moderation; media retention/view-once semantics; account deletion and data export.
