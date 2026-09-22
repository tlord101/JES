-- ============================================================================
-- Jasmine Exclusive School (JES) - Admissions, messaging, audit
-- Migration 05
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'application_status') then
    create type public.application_status as enum (
      'pending', 'under_review', 'approved', 'rejected', 'waitlisted', 'withdrawn'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'document_type') then
    create type public.document_type as enum (
      'birth_certificate', 'passport_photo', 'transfer_certificate',
      'report_card', 'medical_report', 'other'
    );
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Admission sessions and requirements
-- ---------------------------------------------------------------------------
create table if not exists public.admission_sessions (
  id                uuid primary key default gen_random_uuid(),
  name              text not null unique,
  academic_year_id  uuid references public.academic_years (id) on delete set null,
  opens_on          date,
  closes_on         date,
  application_fee   numeric(12,2) not null default 0,
  is_open           boolean not null default true,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

drop trigger if exists admission_sessions_set_updated_at on public.admission_sessions;
create trigger admission_sessions_set_updated_at
  before update on public.admission_sessions
  for each row execute function public.set_updated_at();

create table if not exists public.admission_requirements (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid references public.admission_sessions (id) on delete cascade,
  title        text not null,
  description  text,
  is_required  boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists admission_requirements_session_idx on public.admission_requirements (session_id, sort_order);-- ---------------------------------------------------------------------------
-- Reference number generators
-- ---------------------------------------------------------------------------
create sequence if not exists public.application_no_seq start 1;
create sequence if not exists public.admission_no_generated_seq start 1;

create or replace function public.next_application_no()
returns text
language sql volatile
as $$
  select 'JES/APP/' || to_char(now(), 'YYYY') || '/' || lpad(nextval('public.application_no_seq')::text, 5, '0');
$$;

create or replace function public.generate_admission_no()
returns text
language sql volatile
as $$
  select 'JES/' || to_char(now(), 'YYYY') || '/' || lpad(nextval('public.admission_no_generated_seq')::text, 4, '0');
$$;

create or replace function public.generate_staff_no()
returns text
language sql volatile
as $$
  select 'JES/STF/' || lpad(nextval('public.staff_no_seq')::text, 4, '0');
$$;

-- ---------------------------------------------------------------------------
-- Admission applications
-- ---------------------------------------------------------------------------
create table if not exists public.admission_applications (
  id                    uuid primary key default gen_random_uuid(),
  application_no        text not null unique,
  session_id            uuid references public.admission_sessions (id) on delete set null,
  first_name            text not null,
  last_name             text not null,
  other_names           text,
  gender                public.gender_type not null,
  date_of_birth         date not null,
  nationality           text not null default 'Nigerian',
  state_of_origin       text,
  class_applying_for    text not null,
  previous_school       text,
  previous_class        text,
  guardian_full_name    text not null,
  guardian_email        citext not null,
  guardian_phone        text not null,
  guardian_relationship text not null default 'Parent',
  guardian_occupation   text,
  address               text not null,
  medical_notes         text,
  how_heard_about_us    text,
  status                public.application_status not null default 'pending',
  review_notes          text,
  reviewed_by           uuid references public.profiles (id) on delete set null,
  reviewed_at           timestamptz,
  applicant_profile_id  uuid references public.profiles (id) on delete set null,
  converted_student_id  uuid references public.students (id) on delete set null,
  submitted_at          timestamptz not null default now(),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists admission_applications_status_idx
  on public.admission_applications (status, submitted_at desc);
create index if not exists admission_applications_guardian_idx
  on public.admission_applications (guardian_email);

drop trigger if exists admission_applications_set_updated_at on public.admission_applications;
create trigger admission_applications_set_updated_at
  before update on public.admission_applications
  for each row execute function public.set_updated_at();

create or replace function public.admission_applications_default_number()
returns trigger
language plpgsql
as $$
begin
  if new.application_no is null or new.application_no = '' then
    new.application_no := public.next_application_no();
  end if;
  return new;
end;
$$;

drop trigger if exists admission_applications_default_number on public.admission_applications;
create trigger admission_applications_default_number
  before insert on public.admission_applications
  for each row execute function public.admission_applications_default_number();-- ---------------------------------------------------------------------------
-- Application documents
-- ---------------------------------------------------------------------------
create table if not exists public.application_documents (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.admission_applications (id) on delete cascade,
  doc_type       public.document_type not null default 'other',
  file_name      text,
  file_url       text not null,
  uploaded_at    timestamptz not null default now()
);

create index if not exists application_documents_application_idx
  on public.application_documents (application_id);

-- ---------------------------------------------------------------------------
-- In-portal messaging (parents <-> school)
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id                 uuid primary key default gen_random_uuid(),
  sender_id          uuid not null references public.profiles (id) on delete cascade,
  recipient_id       uuid not null references public.profiles (id) on delete cascade,
  student_id         uuid references public.students (id) on delete set null,
  subject            text not null,
  body               text not null,
  is_read            boolean not null default false,
  read_at            timestamptz,
  parent_message_id  uuid references public.messages (id) on delete set null,
  created_at         timestamptz not null default now()
);

create index if not exists messages_recipient_idx on public.messages (recipient_id, created_at desc);
create index if not exists messages_sender_idx on public.messages (sender_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  title       text not null,
  body        text,
  type        text not null default 'info',
  link        text,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists notifications_profile_idx on public.notifications (profile_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Audit trail
-- ---------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id           uuid primary key default gen_random_uuid(),
  action       text not null,
  category     text not null default 'System',
  details      text,
  actor_id     uuid references public.profiles (id) on delete set null,
  actor_email  text,
  actor_name   text,
  ip_address   text,
  user_agent   text,
  metadata     jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

create index if not exists audit_logs_created_idx on public.audit_logs (created_at desc);
create index if not exists audit_logs_category_idx on public.audit_logs (category);