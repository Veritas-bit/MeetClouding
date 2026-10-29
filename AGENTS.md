# MeetClouding — Agent Working Context

## First actions for any coding agent
1. Read this file and `README.md`, then inspect the relevant source and current Git state before editing.
2. Work only on branch `rewrite/native-app-foundation`. Never commit to or modify `main` unless the user explicitly changes this instruction.
3. Before editing, run `git status --short --branch`. Preserve all uncommitted user changes; do not reset, clean, overwrite, or discard them.
4. Make focused changes, run relevant tests/builds, and report what was actually verified. Never claim a build, APK, test, backend, or feature works unless it was run and confirmed.
5. Android is the current testing priority. Do not recreate the web preview or spend effort on the legacy web app.
6. Never commit API keys, passwords, access tokens, signing keys, local config files, or real user/location data.

## Product essence — do not dilute this
MeetClouding is a spontaneous nearby-discovery app. A “cloud” expresses a person's current desire, mood, or openness to doing something; it is not a fixed event listing, reservation, promise, or binding commitment.

Example: a person may initially feel like getting coffee but happily change their mind after seeing a more interesting nearby cloud. The product should help people discover possibilities they had not already thought of, not merely match people to a rigid predefined plan.

The map is the primary discovery surface. Clouds should be visually scannable and tappable. People can inspect alternatives and change their minds at any time. Expressing interest is not a booking or a promise. A possible core loop is: discover a cloud → inspect it → express interest → mutual response → chat → optionally arrange an activity.

Do not turn the product into a static classifieds feed, imply that demo clouds are real people, or lock a person into their first choice.

## Repository and architecture
- Repository: https://github.com/Veritas-bit/MeetClouding
- Active branch: `rewrite/native-app-foundation`
- Legacy/reference repository: https://github.com/Veritas-bit/MeetCloud
- Android: Kotlin + Jetpack Compose; current priority.
- iOS: Swift + SwiftUI + MapKit; later priority.
- Backend foundation: Python + FastAPI; initial API currently only exposes health endpoints.
- Shared API contract: `api/openapi.yaml`.
- No WebView wrappers. Do not restore the removed web preview.
- Keep `main` and the legacy web app unchanged until the native replacement has been tested and the user explicitly approves cutover.

## Current Android prototype status
- Main Android UI source: `android/app/src/main/java/app/meetcloud/MainActivity.kt`.
- A map-first `CloudMapScreen` prototype with schematic streets, tappable sample clouds and category filters has been introduced.
- The map is illustrative only, not real geography or live map tiles.
- Demo clouds are not real users. Newly created clouds and interest markers are local/in-memory only.
- No real location or backend data is currently used by the prototype.
- Authentication, persistence, real discovery, chat, media, push notifications and production deployment still require implementation and testing.
- Do not request location permission prematurely or substitute a fake location.
- Do not claim that the app is production-ready just because a debug APK builds.

## Product and safety principles
- Never represent mock content or generated coordinates as real people or actual locations.
- Ask for location permission only when needed and explain why.
- Minimize location exposure; use server-side authorization for protected actions.
- Implement block/report/mute, moderation, abuse limits and privacy controls before public launch.
- Keep basic discovery, messaging and safety functionality free; do not paywall safety.
- Premium pricing and monetization ideas are hypotheses, not validated demand.
- Preserve existing Russian, English, Belarusian, Ukrainian and Spanish localization.

## Stored design/product references
- `docs/blueprint.md` — product brief.
- `docs/product-review.md` — product risks, priorities, monetization hypotheses and validation plan.
- `docs/migration-plan.md` — implementation phases and exit criteria.
- `docs/architecture.md` — proposed architecture and domain model.
- `docs/security.md` — initial security and privacy requirements.
- `docs/native-screen-inventory.md` — screen and behavior inventory.
- `docs/design-system.md` — preserved palette of four themes: Light, Dark, Early morning, Evening.
- `docs/animation-inventory.md` — legacy animation audit.
- The four theme palettes are intentionally saved for later; do not implement a theme picker or port the palettes until asked/planned.

## Immediate work priority
1. Open the repository locally on Windows and confirm the checked-out branch is `rewrite/native-app-foundation`.
2. Verify the current GitHub Actions status for the Android debug APK after the latest map UI changes.
3. Build the Android debug APK locally with the project's Gradle wrapper; fix compile/build failures without unrelated refactoring.
4. Test installation and basic flows on a real Android device if available; clearly label all prototype/local-only behavior.
5. Only then proceed with the next product implementation slice.

## Working style and reporting
- Prefer complete, buildable, narrowly scoped code changes over speculative rewrites.
- Explain the user-visible effect of each change and list the exact checks run and their outcomes.
- If a command fails, inspect its output and diagnose it; do not silently skip it.
- Ask before destructive operations, dependency migrations, branch changes, or any action that could lose user work.
