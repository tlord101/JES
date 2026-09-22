-- ============================================================================
-- Jasmine Exclusive School (JES) - Core schema
-- Migration 01: extensions, enums, identity, structure and people tables
-- ----------------------------------------------------------------------------
-- Run order: 01 core -> 02 academics -> 03 finance -> 04 content
--            -> 05 admissions -> 06 rls -> 07 storage -> 08 seed
-- ============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ---------------------------------------------------------------------------
-- Enumerated types
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum (
      'super_admin', 'admin', 'principal', 'vice_principal',
      'hod', 'teacher', 'accountant', 'parent', 'student', 'alumni'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'gender_type') then
    create type public.gender_type as enum ('male', 'female');
  end if;
  if not exists (select 1 from pg_type where typname = 'student_status') then
    create type public.student_status as enum ('active', 'graduated', 'suspended', 'withdrawn');
  end if;
  if not exists (select 1 from pg_type where typname = 'staff_status') then
    create type public.staff_status as enum ('active', 'on_leave', 'resigned');
  end if;
  if not exists (select 1 from pg_type where typname = 'school_level') then
    create type public.school_level as enum ('nursery', 'primary', 'junior_secondary', 'senior_secondary');
  end if;
  if not exists (select 1 from pg_type where typname = 'term_name') then
    create type public.term_name as enum ('first_term', 'second_term', 'third_term');
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Shared helper: updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  email           citext not null unique,
  full_name       text not null,
  phone           text,
  avatar_url      text,
  role            public.user_role not null default 'student',
  is_active       boolean not null default true,
  is_verified     boolean not null default false,
  last_login_at   timestamptz,
  notification_preferences jsonb not null default
    '{"email": true, "sms": false, "announcements": true}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.profiles is
  'Application profile for every authenticated user. Role drives all access control.';

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_active_idx on public.profiles (is_active);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();-- ---------------------------------------------------------------------------
-- Academic calendar
-- ---------------------------------------------------------------------------
create table if not exists public.academic_years (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  start_date  date not null,
  end_date    date not null,
  is_current  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint academic_years_date_order check (end_date > start_date)
);

create unique index if not exists academic_years_one_current_idx
  on public.academic_years (is_current) where is_current;

drop trigger if exists academic_years_set_updated_at on public.academic_years;
create trigger academic_years_set_updated_at
  before update on public.academic_years
  for each row execute function public.set_updated_at();

create table if not exists public.terms (
  id                uuid primary key default gen_random_uuid(),
  academic_year_id  uuid not null references public.academic_years (id) on delete cascade,
  name              public.term_name not null,
  start_date        date not null,
  end_date          date not null,
  is_current        boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (academic_year_id, name),
  constraint terms_date_order check (end_date > start_date)
);

create unique index if not exists terms_one_current_idx
  on public.terms (is_current) where is_current;

drop trigger if exists terms_set_updated_at on public.terms;
create trigger terms_set_updated_at
  before update on public.terms
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Classes / arms
-- ---------------------------------------------------------------------------
create table if not exists public.classes (
  id                uuid primary key default gen_random_uuid(),
  name              text not null unique,
  level             public.school_level not null default 'junior_secondary',
  arm               text,
  capacity          integer not null default 40,
  class_teacher_id  uuid references public.profiles (id) on delete set null,
  room              text,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists classes_level_idx on public.classes (level);
create index if not exists classes_teacher_idx on public.classes (class_teacher_id);

drop trigger if exists classes_set_updated_at on public.classes;
create trigger classes_set_updated_at
  before update on public.classes
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Subjects
-- ---------------------------------------------------------------------------
create table if not exists public.subjects (
  id           uuid primary key default gen_random_uuid(),
  code         text not null unique,
  name         text not null,
  department   text,
  level        public.school_level,
  description  text,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

drop trigger if exists subjects_set_updated_at on public.subjects;
create trigger subjects_set_updated_at
  before update on public.subjects
  for each row execute function public.set_updated_at();

create table if not exists public.class_subjects (
  id                uuid primary key default gen_random_uuid(),
  class_id          uuid not null references public.classes (id) on delete cascade,
  subject_id        uuid not null references public.subjects (id) on delete cascade,
  teacher_id        uuid references public.profiles (id) on delete set null,
  academic_year_id  uuid references public.academic_years (id) on delete set null,
  created_at        timestamptz not null default now(),
  unique (class_id, subject_id, academic_year_id)
);

create index if not exists class_subjects_teacher_idx on public.class_subjects (teacher_id);
create index if not exists class_subjects_class_idx on public.class_subjects (class_id);-- ---------------------------------------------------------------------------
-- People: students, staff, parents
-- ---------------------------------------------------------------------------
create sequence if not exists public.admission_no_seq start 1;
create sequence if not exists public.staff_no_seq start 1;

create table if not exists public.students (
  id             uuid primary key default gen_random_uuid(),
  profile_id     uuid not null unique references public.profiles (id) on delete cascade,
  admission_no   text not null unique,
  gender         public.gender_type,
  date_of_birth  date,
  class_id       uuid references public.classes (id) on delete set null,
  address        text,
  photo_url      text,
  blood_group    text,
  genotype       text,
  medical_notes  text,
  admitted_on    date not null default current_date,
  status         public.student_status not null default 'active',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists students_class_idx on public.students (class_id);
create index if not exists students_status_idx on public.students (status);

drop trigger if exists students_set_updated_at on public.students;
create trigger students_set_updated_at
  before update on public.students
  for each row execute function public.set_updated_at();

create table if not exists public.staff (
  id             uuid primary key default gen_random_uuid(),
  profile_id     uuid not null unique references public.profiles (id) on delete cascade,
  staff_no       text not null unique,
  position       text not null default 'Teacher',
  department     text,
  qualification  text,
  biography      text,
  photo_url      text,
  date_hired     date,
  is_public      boolean not null default true,
  sort_order     integer not null default 0,
  status         public.staff_status not null default 'active',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists staff_department_idx on public.staff (department);
create index if not exists staff_public_idx on public.staff (is_public);

drop trigger if exists staff_set_updated_at on public.staff;
create trigger staff_set_updated_at
  before update on public.staff
  for each row execute function public.set_updated_at();

create table if not exists public.parents (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null unique references public.profiles (id) on delete cascade,
  occupation    text,
  employer      text,
  address       text,
  alt_phone     text,
  relationship  text default 'guardian',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists parents_set_updated_at on public.parents;
create trigger parents_set_updated_at
  before update on public.parents
  for each row execute function public.set_updated_at();

create table if not exists public.parent_student (
  parent_id     uuid not null references public.parents (id) on delete cascade,
  student_id    uuid not null references public.students (id) on delete cascade,
  relationship  text not null default 'guardian',
  is_primary    boolean not null default true,
  created_at    timestamptz not null default now(),
  primary key (parent_id, student_id)
);

create index if not exists parent_student_student_idx on public.parent_student (student_id);

-- Additional (non class-bound) teaching duties, e.g. HOD responsibilities
create table if not exists public.staff_subjects (
  staff_id    uuid not null references public.staff (id) on delete cascade,
  subject_id  uuid not null references public.subjects (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (staff_id, subject_id)
);

create table if not exists public.staff_classes (
  staff_id    uuid not null references public.staff (id) on delete cascade,
  class_id    uuid not null references public.classes (id) on delete cascade,
  duty        text not null default 'assistant',
  created_at  timestamptz not null default now(),
  primary key (staff_id, class_id, duty)
);

create table if not exists public.alumni (
  id                 uuid primary key default gen_random_uuid(),
  profile_id         uuid not null unique references public.profiles (id) on delete cascade,
  graduation_year    integer,
  exit_class         text,
  occupation         text,
  organisation       text,
  is_verified        boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

drop trigger if exists alumni_set_updated_at on public.alumni;
create trigger alumni_set_updated_at
  before update on public.alumni
  for each row execute function public.set_updated_at();

create table if not exists public.pta_members (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  position     text not null,
  email        text,
  phone        text,
  session_name text,
  is_executive boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

-- Public staff directory (safe projection, no auth data required)
create or replace view public.staff_directory_public as
  select s.id,
         s.staff_no,
         p.full_name,
         s.position,
         s.department,
         s.qualification,
         s.biography,
         coalesce(s.photo_url, p.avatar_url) as photo_url,
         s.sort_order
    from public.staff s
    join public.profiles p on p.id = s.profile_id
   where s.is_public and s.status <> 'resigned' and p.is_active;

comment on view public.staff_directory_public is
  'Public-facing staff directory used by the public website staff page.';-- ============================================================================
-- Access-control helper functions
-- All helpers are SECURITY DEFINER so that policies never recurse into the
-- tables they are protecting.
-- ============================================================================
create or replace function public.auth_role()
returns public.user_role
language sql stable security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_active_user()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce((select is_active from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.is_super_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.auth_role() = 'super_admin';
$$;

-- Full administrative access (user + structure + finance + content control)
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.auth_role() in ('super_admin', 'admin');
$$;

-- Anyone who works for the school and may reach the back office
create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.auth_role() in (
    'super_admin', 'admin', 'principal', 'vice_principal',
    'hod', 'teacher', 'accountant'
  );
$$;

-- Roles allowed to author academic records
create or replace function public.is_teacher()
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.auth_role() in (
    'super_admin', 'admin', 'principal', 'vice_principal', 'hod', 'teacher'
  );
$$;

-- Roles allowed to read/approve final results
create or replace function public.can_approve_results()
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.auth_role() in (
    'super_admin', 'admin', 'principal', 'vice_principal', 'hod'
  );
$$;

create or replace function public.is_accountant()
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.auth_role() in ('super_admin', 'admin', 'accountant');
$$;

-- Student record id of the signed-in user (null when not a student)
create or replace function public.my_student_id()
returns uuid
language sql stable security definer set search_path = public
as $$
  select id from public.students where profile_id = auth.uid();
$$;

-- Student ids of the signed-in parent (empty when not a parent)
create or replace function public.my_children_ids()
returns setof uuid
language sql stable security definer set search_path = public
as $$
  select ps.student_id
    from public.parent_student ps
    join public.parents pa on pa.id = ps.parent_id
   where pa.profile_id = auth.uid();
$$;

-- Every student id the signed-in user may read
create or replace function public.visible_student_ids()
returns setof uuid
language sql stable security definer set search_path = public
as $$
  select public.my_student_id()
  union
  select * from public.my_children_ids();
$$;

-- Class ids the signed-in user teaches (form class or subject class)
create or replace function public.my_class_ids()
returns setof uuid
language sql stable security definer set search_path = public
as $$
  select c.id from public.classes c where c.class_teacher_id = auth.uid()
  union
  select cs.class_id from public.class_subjects cs where cs.teacher_id = auth.uid();
$$;

create or replace function public.is_my_class(target_class uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.my_class_ids() m where m = target_class);
$$;

-- Staff record id of the signed-in user
create or replace function public.my_staff_id()
returns uuid
language sql stable security definer set search_path = public
as $$
  select id from public.staff where profile_id = auth.uid();
$$;

-- Parent record id of the signed-in user
create or replace function public.my_parent_id()
returns uuid
language sql stable security definer set search_path = public
as $$
  select id from public.parents where profile_id = auth.uid();
$$;-- ============================================================================
-- New auth user -> application profile
-- Role is taken from the sign-up metadata, but self-service sign-up can only
-- ever create parent / student / alumni accounts. Staff roles must be granted
-- by an administrator through the service-role API.
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  requested_role public.user_role;
  safe_role      public.user_role;
begin
  requested_role := coalesce(
    nullif(new.raw_user_meta_data ->> 'role', '')::public.user_role,
    'parent'::public.user_role
  );

  safe_role := case
    when requested_role in ('parent', 'student', 'alumni') then requested_role
    else 'parent'::public.user_role
  end;

  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1)),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    safe_role
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();