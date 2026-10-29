# Database

Migrations are ordered SQL files under `migrations/`. The initial schema assumes PostgreSQL with PostGIS and an auth-owned `auth.users` table, such as a Supabase project.

## Important

- This schema is a first draft based on the audited UI and needs product review before production.
- Run migrations only against a disposable development database first.
- Row-level security is enabled and no direct client policies are defined: direct client access is deny-by-default. The backend must authenticate and authorize every request before using a privileged connection.
- Never put a database service-role key in Android/iOS builds.
- The media storage bucket should be private; object-level access must be checked by the backend.
- Define retention/expiry jobs and account deletion before public release.
