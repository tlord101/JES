-- ============================================================================
-- Jasmine Exclusive School (JES) - Website content (CMS)
-- Migration 04: news, events, gallery, announcements, circulars, pages,
--              site settings, contact messages, FAQ, clubs
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'content_status') then
    create type public.content_status as enum ('draft', 'published', 'archived');
  end if;
  if not exists (select 1 from pg_type where typname = 'announcement_audience') then
    create type public.announcement_audience as enum ('everyone', 'staff', 'students', 'parents', 'class');
  end if;
  if not exists (select 1 from pg_type where typname = 'faq_category') then
    create type public.faq_category as enum ('admissions', 'academics', 'fees', 'general');
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- News
-- ---------------------------------------------------------------------------
create table if not exists public.news (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  excerpt          text,
  content          text not null,
  cover_image_url  text,
  category         text not null default 'School News',
  author_id        uuid references public.profiles (id) on delete set null,
  author_name      text,
  status           public.content_status not null default 'draft',
  is_featured      boolean not null default false,
  views            integer not null default 0,
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists news_status_idx on public.news (status, published_at desc);
create index if not exists news_slug_idx on public.news (slug);

drop trigger if exists news_set_updated_at on public.news;
create trigger news_set_updated_at
  before update on public.news
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Events
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  description      text,
  starts_at        timestamptz not null,
  ends_at          timestamptz,
  location         text,
  cover_image_url  text,
  category         text not null default 'School Event',
  status           public.content_status not null default 'draft',
  is_featured      boolean not null default false,
  created_by       uuid references public.profiles (id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists events_start_idx on public.events (starts_at desc);

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Gallery
-- ---------------------------------------------------------------------------
create table if not exists public.gallery_albums (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  description      text,
  cover_image_url  text,
  category         text not null default 'Campus Life',
  is_published     boolean not null default true,
  sort_order       integer not null default 0,
  created_by       uuid references public.profiles (id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

drop trigger if exists gallery_albums_set_updated_at on public.gallery_albums;
create trigger gallery_albums_set_updated_at
  before update on public.gallery_albums
  for each row execute function public.set_updated_at();

create table if not exists public.gallery_images (
  id          uuid primary key default gen_random_uuid(),
  album_id    uuid not null references public.gallery_albums (id) on delete cascade,
  image_url   text not null,
  caption     text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists gallery_images_album_idx on public.gallery_images (album_id, sort_order);-- ---------------------------------------------------------------------------
-- Announcements (targeted at roles / classes, shown in portals)
-- ---------------------------------------------------------------------------
create table if not exists public.announcements (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  body          text not null,
  audience      public.announcement_audience not null default 'everyone',
  class_id      uuid references public.classes (id) on delete cascade,
  priority      text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  is_published  boolean not null default true,
  publish_at    timestamptz not null default now(),
  expires_at    timestamptz,
  author_id     uuid references public.profiles (id) on delete set null,
  author_name   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists announcements_audience_idx on public.announcements (audience, publish_at desc);

drop trigger if exists announcements_set_updated_at on public.announcements;
create trigger announcements_set_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Circulars (downloadable letters to parents)
-- ---------------------------------------------------------------------------
create table if not exists public.circulars (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  file_url      text,
  audience      public.announcement_audience not null default 'parents',
  is_published  boolean not null default true,
  published_at  timestamptz not null default now(),
  created_by    uuid references public.profiles (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists circulars_set_updated_at on public.circulars;
create trigger circulars_set_updated_at
  before update on public.circulars
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Editable pages (public website copy that admins control)
-- ---------------------------------------------------------------------------
create table if not exists public.pages (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  section       text not null default 'General',
  content       text not null default '',
  is_published  boolean not null default true,
  updated_by    uuid references public.profiles (id) on delete set null,
  updated_by_name text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists pages_set_updated_at on public.pages;
create trigger pages_set_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Site settings (single source of truth for school details + homepage copy)
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  key         text primary key,
  value       jsonb not null,
  label       text,
  group_name  text not null default 'general',
  updated_by  uuid references public.profiles (id) on delete set null,
  updated_at  timestamptz not null default now()
);

create or replace function public.site_setting(setting_key text)
returns jsonb
language sql stable security definer set search_path = public
as $$
  select value from public.site_settings where key = setting_key;
$$;

create or replace function public.site_text(setting_key text, fallback text default '')
returns text
language sql stable security definer set search_path = public
as $$
  select coalesce((select value #>> '{}' from public.site_settings where key = setting_key), fallback);
$$;-- ---------------------------------------------------------------------------
-- Contact / enquiry messages
-- ---------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  email        citext not null,
  phone        text,
  subject      text not null default 'General Enquiry',
  message      text not null,
  is_read      boolean not null default false,
  handled_by   uuid references public.profiles (id) on delete set null,
  handled_at   timestamptz,
  ip_address   text,
  user_agent   text,
  created_at   timestamptz not null default now()
);

create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);

-- ---------------------------------------------------------------------------
-- Frequently asked questions
-- ---------------------------------------------------------------------------
create table if not exists public.faqs (
  id            uuid primary key default gen_random_uuid(),
  question      text not null,
  answer        text not null,
  category      public.faq_category not null default 'general',
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists faqs_set_updated_at on public.faqs;
create trigger faqs_set_updated_at
  before update on public.faqs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Co-curricular clubs
-- ---------------------------------------------------------------------------
create table if not exists public.clubs (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  slug         text not null unique,
  description  text,
  patron_id    uuid references public.profiles (id) on delete set null,
  meeting_day  text,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

drop trigger if exists clubs_set_updated_at on public.clubs;
create trigger clubs_set_updated_at
  before update on public.clubs
  for each row execute function public.set_updated_at();

create table if not exists public.club_members (
  id          uuid primary key default gen_random_uuid(),
  club_id     uuid not null references public.clubs (id) on delete cascade,
  student_id  uuid not null references public.students (id) on delete cascade,
  role        text not null default 'member',
  joined_at   timestamptz not null default now(),
  unique (club_id, student_id)
);

create index if not exists club_members_student_idx on public.club_members (student_id);