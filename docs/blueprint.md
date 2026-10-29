# MeetCloud product brief

## Product promise

MeetCloud helps people find nearby others who want to do the same activity, at a compatible time. Users publish short-lived “clouds” on a map, express interest in other clouds, and coordinate in chat.

## Core loop

1. Discover a relevant cloud nearby.
2. Create a cloud with activity, time window, approximate area, group size and visibility.
3. Express interest or accept participants.
4. Coordinate in a chat.
5. Complete or cancel the plan; the cloud expires automatically.

## First product hypothesis

Begin with activity/friendship discovery in one dense local community. Validate spontaneous coffee, walks, food, games and sports before expanding the audience or positioning. Dating is not the default positioning; explicitly decide before adding dating-oriented mechanics.

## Product principles

- Make the first useful cloud visible quickly; never keep the welcome screen behind an artificial delay.
- Never fabricate users or silently replace a failed location with another city.
- Request location when the user understands its benefit; support manual area selection.
- Use approximate location by default and give clear controls over cloud visibility.
- Keep basic discovery, messaging, blocking, reporting and privacy controls free.
- Monetize self-expression and optional convenience, not safety or visibility dominance.
- Do not ship mock data as if it were live activity.

## Native implementation

- Android: Kotlin + Jetpack Compose.
- iOS: Swift + SwiftUI.
- Backend: FastAPI modular service with PostgreSQL/PostGIS candidate; auth/database provider still requires final selection.
- Shared OpenAPI contract, server-side authorization, secure platform credential storage, real-time messaging and push notifications.
- Preserve four legacy palettes and source-backed animation behavior.

## Validation gates

- Interviews establish a repeated, recent problem rather than generic enthusiasm.
- A local pilot demonstrates that clouds receive genuine responses and lead to conversations or plans.
- Retention and safety are measured before expansion.
- Cosmetic purchases are tested with active users before subscription pricing is finalized.
