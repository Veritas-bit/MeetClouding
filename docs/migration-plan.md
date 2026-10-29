# Native migration plan

## Guiding rule
The existing web app is the product reference, not the implementation base. Build native clients from scratch against a shared backend contract. Keep `main` untouched until a tested replacement and explicit cutover decision exist.

## Phase 0 — Audit and baseline
- [x] Confirm GitHub access and create `rewrite/native-app-foundation`.
- [x] Inspect current tree, package metadata, app shell, map/home/chat/profile flows, stores, localization and AI translation.
- [x] Record initial screen inventory and architecture proposal.
- [ ] Inventory all routes and map visible actions to expected outcomes.
- [ ] Verify build/typecheck from a clean checkout.
- [ ] Remove tracked environment files from the rewrite branch and review exposed-key restrictions/rotation.
- [ ] Capture reference screenshots and document edge cases.

**Exit condition:** each user-facing screen and important interaction has a source reference, behavior definition and acceptance criterion.

## Phase 1 — Product contract and data model
- Define auth/onboarding, profile lifecycle, cloud publish/search, friendships, chat, media, notifications, localization and moderation flows.
- Decide cloud visibility, expiry, deletion, blocking/reporting and location precision.
- Draft schema migrations, OpenAPI contract and realtime event schema.
- Define error, pagination, upload and retry behavior.
- Confirm provider/hosting choices without committing production credentials.

**Exit condition:** both clients and backend can be implemented against the same reviewed contract.

## Phase 2 — Backend foundation
- Create FastAPI app, typed configuration, health endpoint, structured logs and tests.
- Add token validation and request-level authorization.
- Add schema migrations and repository/service boundaries.
- Implement profile read/update and cloud create/list/nearby endpoints first.
- Add privacy-safe location handling, rate limits and moderation hooks.
- Add CI and local development instructions.

**Exit condition:** integration tests cover auth, profile ownership, cloud creation and nearby queries against a test database.

## Phase 3 — Native project foundations
- Android: buildable Gradle project, Compose shell, navigation, design tokens, API client, secure session storage and tests.
- iOS: buildable Xcode project, SwiftUI shell, navigation, design tokens, API client, Keychain storage and tests.
- Add shared loading/error/empty states and localization framework.
- Add launch/navigation smoke tests.

**Exit condition:** both projects build independently and can reach backend health/auth endpoints.

## Phase 4 — First vertical slice
1. Sign in or restore session.
2. Load/edit profile.
3. Request location with explicit permission.
4. View nearby clouds on the native map.
5. Open a cloud/profile.
6. Create a cloud and see the server-confirmed result.

**Exit condition:** the same API-backed flow works on Android and iOS without mock users or fabricated markers.

## Phase 5 — Messaging and media
- Conversation list, history, sending/retry, delivery/read receipts and realtime reconnect.
- Replies/edits where confirmed by the existing product behavior.
- Image/video picker and camera capture, private uploads and media access controls.
- Translation through the backend provider interface.
- Gallery, retention/expiry and view-once only after semantics are specified.
- Push registration and notification routing.

**Exit condition:** integration and device tests cover normal and failure paths.

## Phase 6 — Remaining screens and hardening
- Search/categories, friendships, settings, blocked users, help/about and premium-related UI.
- Preserve RU/EN/BE/UK/ES localization.
- Accessibility, dynamic text, reduced motion, offline and slow-network handling.
- Security review, account deletion, privacy and retention behavior.
- Visual regression against reference screenshots.

## Phase 7 — Release readiness
- CI builds, automated tests, crash/error monitoring and dependency review.
- Android signing/Play Console and iOS signing/capabilities/App Store preparation.
- Staging, backups/restore drill, migration/export test, runbook and rollback/cutover plan.

## Work tracking rules
- Rewrite commits target `rewrite/native-app-foundation` until the owner approves another target.
- Do not delete or rewrite the legacy web app as part of the initial foundation.
- A phase is not complete just because files exist; require a build/test or explicit evidence.
- Keep provider credentials out of source control and client bundles.
