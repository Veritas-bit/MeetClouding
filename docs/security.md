# Security and privacy requirements

## Initial repository finding
The current repository tracks a root `.env` containing `NEXT_PUBLIC_YANDEX_MAP_API_KEY`. The value is deliberately not copied into this document or logs. A `NEXT_PUBLIC_` variable is designed for browser exposure, but a tracked environment file is an unsafe configuration pattern and can accidentally collect secrets in future revisions.

For the rewrite branch:
- remove the tracked root `.env`;
- ignore `.env` and local variants;
- provide a sanitized `.env.example` with placeholders only;
- keep privileged keys in server-side configuration;
- restrict map keys by app/API/referrer where supported and rotate the key if it was not intended to be public.

Deleting a file in a new commit does not erase earlier Git history or the existing `main` branch. Review and rotate credentials separately; do not assume history is clean.

## Client security
- Never embed database service-role keys, AI provider keys, signing secrets or admin credentials in either app.
- Keep session material in Android Keystore-backed storage and iOS Keychain; do not log tokens.
- Use TLS for production API traffic.
- Avoid retaining precise location longer than needed.
- Request location only when needed and show clear permission-denied/error states.
- Use system photo pickers where possible; request camera/microphone only for explicit capture features.
- Keep private media private and authorize every access.
- Treat client-supplied owner IDs, roles, friendship state and message status as untrusted.

## Backend security
- Validate token signature, issuer, audience, expiry and subject.
- Authorize every object access on the server.
- Validate upload MIME type, size and ownership; use expiring grants.
- Rate-limit auth, cloud creation, search, messaging, translation and reporting.
- Apply block/report and moderation checks before exposing content.
- Redact structured logs; do not log credentials, message bodies or exact coordinates by default.
- Implement account deletion, retention and export workflows before public release.

## Required tests
- Unauthenticated protected requests are rejected.
- User A cannot read or modify User B's private profile, messages or media.
- Blocked users cannot perform disallowed interactions.
- Expired/invalid upload grants fail.
- Location denial does not fabricate a user's location.
- Logs and error messages do not reveal credentials or private message content.
