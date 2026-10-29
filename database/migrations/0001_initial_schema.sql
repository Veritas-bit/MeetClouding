-- Initial MeetCloud schema for PostgreSQL/PostGIS.
-- Intended for a managed Postgres project with an auth.users table (e.g. Supabase).
-- Review lifecycle and privacy semantics before production deployment.
begin;

create extension if not exists pgcrypto;
create extension if not exists postgis;

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    nickname text not null check (char_length(trim(nickname)) between 2 and 32),
    about text not null default '' check (char_length(about) <= 500),
    gender text check (gender in ('male', 'female', 'unselected')),
    locale text not null default 'ru' check (locale in ('ru', 'en', 'be', 'uk', 'es')),
    avatar_media_id uuid,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.clouds (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references public.profiles(id) on delete cascade,
    text text not null check (char_length(trim(text)) between 1 and 500),
    category text not null check (category in ('food', 'walk', 'entertainment', 'sport', 'culture', 'other')),
    location geography(Point, 4326) not null,
    status text not null default 'active' check (status in ('active', 'hidden', 'removed')),
    visibility text not null default 'nearby' check (visibility in ('nearby', 'friends')),
    expires_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
create index if not exists clouds_location_gix on public.clouds using gist (location);
create index if not exists clouds_active_expiry_idx on public.clouds (status, expires_at, created_at desc);
create index if not exists clouds_owner_idx on public.clouds (owner_id, created_at desc);

create table if not exists public.friendships (
    id uuid primary key default gen_random_uuid(),
    requester_id uuid not null references public.profiles(id) on delete cascade,
    recipient_id uuid not null references public.profiles(id) on delete cascade,
    status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'cancelled')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (requester_id <> recipient_id),
    unique (requester_id, recipient_id)
);
create index if not exists friendships_recipient_status_idx on public.friendships (recipient_id, status);

create table if not exists public.conversations (
    id uuid primary key default gen_random_uuid(),
    created_by uuid not null references public.profiles(id) on delete restrict,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
    conversation_id uuid not null references public.conversations(id) on delete cascade,
    user_id uuid not null references public.profiles(id) on delete cascade,
    joined_at timestamptz not null default now(),
    last_read_at timestamptz,
    primary key (conversation_id, user_id)
);
create index if not exists conversation_members_user_idx on public.conversation_members (user_id, joined_at desc);

create table if not exists public.media_assets (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references public.profiles(id) on delete cascade,
    storage_key text not null unique,
    media_type text not null check (media_type in ('image', 'video', 'audio', 'other')),
    mime_type text not null,
    byte_size bigint not null check (byte_size > 0),
    lifecycle text not null default 'private' check (lifecycle in ('private', 'attached', 'expired', 'deleted')),
    expires_at timestamptz,
    created_at timestamptz not null default now()
);

alter table public.profiles
    add constraint profiles_avatar_media_fk
    foreign key (avatar_media_id) references public.media_assets(id) on delete set null;

create table if not exists public.messages (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid not null references public.conversations(id) on delete cascade,
    sender_id uuid not null references public.profiles(id) on delete restrict,
    body text not null default '' check (char_length(body) <= 10000),
    message_type text not null default 'text' check (message_type in ('text', 'media', 'location', 'system')),
    media_id uuid references public.media_assets(id) on delete set null,
    reply_to_id uuid references public.messages(id) on delete set null,
    edited_at timestamptz,
    deleted_at timestamptz,
    created_at timestamptz not null default now(),
    check (char_length(body) > 0 or media_id is not null or message_type in ('location', 'system'))
);
create index if not exists messages_conversation_created_idx on public.messages (conversation_id, created_at desc);
create index if not exists messages_sender_created_idx on public.messages (sender_id, created_at desc);

create table if not exists public.message_receipts (
    message_id uuid not null references public.messages(id) on delete cascade,
    user_id uuid not null references public.profiles(id) on delete cascade,
    delivered_at timestamptz,
    read_at timestamptz,
    primary key (message_id, user_id)
);

create table if not exists public.blocks (
    blocker_id uuid not null references public.profiles(id) on delete cascade,
    blocked_id uuid not null references public.profiles(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (blocker_id, blocked_id),
    check (blocker_id <> blocked_id)
);

create table if not exists public.reports (
    id uuid primary key default gen_random_uuid(),
    reporter_id uuid not null references public.profiles(id) on delete cascade,
    target_user_id uuid references public.profiles(id) on delete set null,
    target_cloud_id uuid references public.clouds(id) on delete set null,
    target_message_id uuid references public.messages(id) on delete set null,
    reason text not null check (char_length(trim(reason)) between 2 and 100),
    details text not null default '' check (char_length(details) <= 2000),
    status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
    created_at timestamptz not null default now(),
    check (num_nonnulls(target_user_id, target_cloud_id, target_message_id) = 1)
);

create table if not exists public.device_tokens (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    platform text not null check (platform in ('android', 'ios')),
    token text not null unique,
    app_version text,
    last_seen_at timestamptz not null default now(),
    created_at timestamptz not null default now()
);
create index if not exists device_tokens_user_idx on public.device_tokens (user_id);

-- Client access is deny-by-default. The backend must validate the caller and enforce
-- authorization before using a privileged database connection.
alter table public.profiles enable row level security;
alter table public.clouds enable row level security;
alter table public.friendships enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.media_assets enable row level security;
alter table public.messages enable row level security;
alter table public.message_receipts enable row level security;
alter table public.blocks enable row level security;
alter table public.reports enable row level security;
alter table public.device_tokens enable row level security;

commit;
