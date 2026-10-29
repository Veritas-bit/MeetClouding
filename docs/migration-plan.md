# Native migration plan

## Guiding rule

The existing web app is the product reference, not the implementation base. Build native clients from scratch against a shared backend contract. Keep `main` untouched until a tested replacement and explicit cutover decision exist.

## Phase 0 — Audit and baseline

- [x] Confirm GitHub access and create `rewrite/native-app-foundation`.
- [x] Inspect current tree, package metadata, app shell, map/home/chat/profile flows, stores, localization and AI translation.
- [x] Record initial screen inventory and architecture proposal.
- [x] Preserve all four source theme palettes and document source-backed animation findings.
- [x] Add product validity, safety, prioritization and monetization review.
- [ ] Inventory all routes and map visible actions to expected outcomes.
- [ ] Verify build/typecheck from a clean checkout.
- [ ] Remove tracked environment files from the rewrite branch and review exposed-key restrictions/rotation.
- [ ] Capture reference screenshots and document edge cases.

**Exit condition:** each user-facing screen and important interaction has a source reference, behavior definition and acceptance criterion; known prototype risks are recorded.

## Phase 1 — Product contract and data model

- Decide the first target segment and pilot city/community; treat these as hypotheses until user interviews validate them.
- Specify the core loop: discover a relevant cloud → express interest → accept/decline → chat → arrange activity → expire/complete.
- Define cloud activity, time window, group size, visibility, approximate location, expiry, edit/cancel behavior and participant lifecycle.
- Decide onboarding and permission timing; never silently use a fake location or fabricate people.
- Define block/report/mute, spam limits, moderation escalation, account deletion, media privacy and retention.
- Draft schema migrations, OpenAPI contract and realtime event schema.
- Define error, pagination, upload and retry behavior.
- Confirm provider/hosting choices without committing production credentials.

**Exit condition:** both clients and backend can be implemented against the same reviewed contract; safety and moderation have explicit owners/processes.

## Phase 2 — Backend foundation

- Create FastAPI app, typed configuration, health endpoint, structured logs and tests.
- Add token validation and request-level authorization.
- Add schema migrations and repository/service boundaries.
- Implement profile read/update and cloud create/list/nearby endpoints first.
- Add privacy-safe location handling, rate limits, abuse controls and moderation hooks.
- Add CI and local development instructions.

**Exit condition:** integration tests cover auth, profile ownership, cloud creation, nearby queries, visibility rules and blocking against a test database.

## Phase 3 — Native project foundations

- Android: buildable Gradle project, Compose shell, navigation, design tokens, API client, secure session storage and tests.
- iOS: buildable Xcode project, SwiftUI shell, navigation, design tokens, API client, Keychain storage and tests.
- Add shared loading/error/empty states and localization framework.
- Add launch/navigation smoke tests.

**Exit condition:** both projects build independently and can reach backend health/auth endpoints.

## Phase 4 — First vertical slice

1. Sign in or restore session.
2. Load/edit profile.
3. Request location with explicit permission, plus manual area fallback.
4. View real nearby clouds on the native map.
5. Open a cloud/profile and see privacy-appropriate location precision.
6. Express interest and receive a server-confirmed response.
7. Create a cloud and see the server-confirmed result.

**Exit condition:** the same API-backed flow works on Android and iOS without mock users, fabricated markers or misleading location fallbacks.

## Phase 5 — Messaging and media

- Conversation list, history, sending/retry, delivery/read receipts and realtime reconnect.
- Replies/edits where confirmed by the existing product behavior.
- Image/video picker and camera capture, private uploads and media access controls.
- Translation through the backend provider interface, with clear failure handling and non-AI fallback.
- Gallery, retention/expiry and view-once only after semantics are specified.
- Push registration and notification routing with user controls.

**Exit condition:** integration and device tests cover normal and failure paths; block/report actions work from relevant entry points.

## Phase 6 — Remaining screens and hardening

- Search/categories, friendships, settings, blocked users, help/about and premium-related UI.
- Preserve RU/EN/BE/UK/ES localization.
- Accessibility, dynamic text, reduced motion, offline and slow-network handling.
- Security review, account deletion, privacy and retention behavior.
- Visual regression against reference screenshots.
- Remove or defer low-value features that add complexity without improving the core loop.

**Exit condition:** visual parity and accessibility are evidenced; privacy and moderation are tested; no screen pretends that mocked data is real.

## Phase 7 — Pilot, monetization and release readiness

- Instrument privacy-aware activation, time-to-first-value, cloud response, conversation and retention events.
- Run a small local pilot and review user interviews, density, repeat use and safety reports.
- Test cosmetic packs and optional subscription with active users before committing to pricing.
- Keep core discovery, basic messaging and safety controls free; do not sell exact location or ranking dominance.
- Validate purchases server-side, restore purchases, entitlement state, refunds and cancellation.
- CI builds, automated tests, crash/error monitoring and dependency review.
- Android signing/Play Console and iOS signing/capabilities/App Store preparation.
- Staging, backups/restore drill, migration/export test, runbook and rollback/cutover plan.

**Exit condition:** product and release gates are met with real pilot evidence; revenue assumptions are not based solely on downloads or stated interest.

## Work tracking rules

- Rewrite commits target `rewrite/native-app-foundation` until the owner approves another target.
- Do not delete or rewrite the legacy web app as part of the initial foundation.
- A phase is not complete just because files exist; require a build/test or explicit evidence.
- Keep provider credentials out of source control and client bundles.
- Treat pricing, target audience and retention thresholds as hypotheses until validated with users.
