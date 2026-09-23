-- ============================================================================
-- Jasmine Exclusive School (JES) - Admin extras
-- Migration 10: tables backing the admin console (curriculum, departments,
-- alumni directory, media library) + anon-safe audit writer.
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'media_type') then
    create type public.media_type as enum ('image', 'document', 'video');
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Departments
-- ---------------------------------------------------------------------------
create table if not exists public.departments (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  name        text not null,
  hod_name    text,
  description text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists departments_set_updated_at on public.departments;
create trigger departments_set_updated_at
  before update on public.departments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Curriculum topics (weekly scheme of work)
-- ---------------------------------------------------------------------------
create table if not exists public.curriculum_topics (
  id           uuid primary key default gen_random_uuid(),
  subject_id   uuid not null references public.subjects (id) on delete cascade,
  class_id     uuid references public.classes (id) on delete set null,
  term_id      uuid references public.terms (id) on delete set null,
  week_number  integer not null default 1 check (week_number between 1 and 14),
  topic        text not null,
  objectives   text,
  created_by   uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (subject_id, week_number, topic)
);

create index if not exists curriculum_topics_subject_idx on public.curriculum_topics (subject_id, week_number);

drop trigger if exists curriculum_topics_set_updated_at on public.curriculum_topics;
create trigger curriculum_topics_set_updated_at
  before update on public.curriculum_topics
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Alumni directory (records without portal accounts)
-- ---------------------------------------------------------------------------
create table if not exists public.alumni_records (
  id               uuid primary key default gen_random_uuid(),
  full_name        text not null,
  graduation_year  text not null,
  profession       text,
  email            text,
  phone            text,
  biography        text,
  is_published     boolean not null default true,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists alumni_records_year_idx on public.alumni_records (graduation_year desc);

drop trigger if exists alumni_records_set_updated_at on public.alumni_records;
create trigger alumni_records_set_updated_at
  before update on public.alumni_records
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Media library (link based assets; storage uploads handled separately)
-- ---------------------------------------------------------------------------
create table if not exists public.media_assets (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  url          text not null,
  type         public.media_type not null default 'image',
  category     text,
  uploaded_by  uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now()
);

create index if not exists media_assets_created_idx on public.media_assets (created_at desc);

-- ---------------------------------------------------------------------------
-- Anon-safe audit writer (contact form visitors cannot insert audit rows
-- directly because of RLS, so they call this SECURITY DEFINER helper).
-- ---------------------------------------------------------------------------
create or replace function public.record_audit(
  p_action text,
  p_category text default 'System',
  p_details text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.audit_logs (action, category, details, actor_email, actor_name, metadata)
  values (p_action, p_category, p_details, 'anonymous@visitor', 'Public Visitor', coalesce(p_metadata, '{}'::jsonb));
end;
$$;

revoke all on function public.record_audit(text, text, text, jsonb) from public;
grant execute on function public.record_audit(text, text, text, jsonb) to anon, authenticated;


-- ---------------------------------------------------------------------------
-- RLS for the new tables
-- ---------------------------------------------------------------------------
alter table public.departments enable row level security;
alter table public.curriculum_topics enable row level security;
alter table public.alumni_records enable row level security;
alter table public.media_assets enable row level security;

drop policy if exists departments_read on public.departments;
create policy departments_read on public.departments
  for select using (public.is_staff() or is_active);
drop policy if exists departments_write on public.departments;
create policy departments_write on public.departments
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists curriculum_topics_read on public.curriculum_topics;
create policy curriculum_topics_read on public.curriculum_topics
  for select using (public.is_staff());
drop policy if exists curriculum_topics_write on public.curriculum_topics;
create policy curriculum_topics_write on public.curriculum_topics
  for all using (public.is_teacher()) with check (public.is_teacher());

drop policy if exists alumni_records_read on public.alumni_records;
create policy alumni_records_read on public.alumni_records
  for select using (is_published or public.is_staff());
drop policy if exists alumni_records_write on public.alumni_records;
create policy alumni_records_write on public.alumni_records
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists media_assets_read on public.media_assets;
create policy media_assets_read on public.media_assets
  for select using (true);
drop policy if exists media_assets_write on public.media_assets;
create policy media_assets_write on public.media_assets
  for all using (public.is_staff()) with check (public.is_staff());
