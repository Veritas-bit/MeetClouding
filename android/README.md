# MeetClouding — Android native client

Kotlin + Jetpack Compose. This branch is a native, interactive prototype intended for early usability testing, not a production-ready social network.

## Build locally

- Android Studio with JDK 17
- Android SDK Platform 35 and Build Tools 35.0.0
- Open the `android/` directory as the project and run the `app` configuration.

## Get a test APK

Every push to `rewrite/**` that changes `android/**` triggers **Android debug APK** in GitHub Actions. When the workflow succeeds:

1. Open the repository's **Actions** tab.
2. Select **Android debug APK** and the latest successful run.
3. Download the `meetclouding-android-debug` artifact.
4. Extract the ZIP and share `app-debug.apk` with testers, or upload it to a private tester distribution service.

The artifact is retained for 14 days. It is a debug build; testers may need to allow installation from the source they use. For broader distribution, the next step is a signed internal-testing build (Google Play internal testing or a controlled APK release).

## What works in this prototype

- Native bottom navigation between Clouds, Chats and Profile.
- Map-first discovery screen with tappable floating cloud bubbles and category filters.
- The interaction model treats a cloud as a current mood/open intention, not a fixed booking; users are encouraged to browse alternatives.
- Local-only create-cloud draft flow.
- Interactive interest toggle and cloud detail dialog.
- Clear demo labels so sample clouds cannot be mistaken for real nearby users.
- A stylised native map backdrop for UX testing; it does not claim to show real streets, users, or coordinates.
- No location permission request and no invented fallback coordinates.

## Important limitations

This build has no backend connection, authentication, persistent storage, real geographic map, real users, server-side cloud publishing, chat delivery, moderation backend, or push notifications. Sample cards are clearly marked as examples. New clouds exist only in memory and disappear when the process is killed. Interest actions are local UI state only. Do not use it to arrange real-world meetings yet.
