-- ============================================================================
-- Jasmine Exclusive School (JES) - Academic records
-- Migration 02: attendance, results, report cards, assignments, timetables
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'attendance_status') then
    create type public.attendance_status as enum ('present', 'absent', 'late', 'excused');
  end if;
  if not exists (select 1 from pg_type where typname = 'result_status') then
    create type public.result_status as enum ('draft', 'submitted', 'approved', 'published');
  end if;
  if not exists (select 1 from pg_type where typname = 'submission_status') then
    create type public.submission_status as enum ('pending', 'submitted', 'late', 'graded', 'returned');
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Attendance
-- ---------------------------------------------------------------------------
create table if not exists public.attendance (
  id                uuid primary key default gen_random_uuid(),
  student_id        uuid not null references public.students (id) on delete cascade,
  class_id          uuid not null references public.classes (id) on delete restrict,
  subject_id        uuid references public.subjects (id) on delete set null,
  academic_year_id  uuid references public.academic_years (id) on delete set null,
  term_id           uuid references public.terms (id) on delete set null,
  attendance_date   date not null default current_date,
  status            public.attendance_status not null default 'present',
  remarks           text,
  recorded_by       uuid references public.profiles (id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create unique index if not exists attendance_unique_daily_idx
  on public.attendance (student_id, attendance_date, coalesce(subject_id, '00000000-0000-0000-0000-000000000000'::uuid));
create index if not exists attendance_class_date_idx on public.attendance (class_id, attendance_date);
create index if not exists attendance_student_idx on public.attendance (student_id);

drop trigger if exists attendance_set_updated_at on public.attendance;
create trigger attendance_set_updated_at
  before update on public.attendance
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Grade helpers
-- ---------------------------------------------------------------------------
create or replace function public.grade_for_score(score numeric)
returns text
language sql immutable
as $$
  select case
    when score is null then null
    when score >= 75 then 'A'
    when score >= 65 then 'B'
    when score >= 55 then 'C'
    when score >= 45 then 'D'
    when score >= 40 then 'E'
    else 'F'
  end;
$$;

create or replace function public.remark_for_grade(grade text)
returns text
language sql immutable
as $$
  select case grade
    when 'A' then 'Excellent'
    when 'B' then 'Very Good'
    when 'C' then 'Good'
    when 'D' then 'Fair'
    when 'E' then 'Pass'
    else 'Needs Improvement'
  end;
$$;-- ---------------------------------------------------------------------------
-- Results (continuous assessment + examination per subject, per term)
-- ---------------------------------------------------------------------------
create table if not exists public.results (
  id                uuid primary key default gen_random_uuid(),
  student_id        uuid not null references public.students (id) on delete cascade,
  subject_id        uuid not null references public.subjects (id) on delete restrict,
  class_id          uuid not null references public.classes (id) on delete restrict,
  academic_year_id  uuid references public.academic_years (id) on delete set null,
  term_id           uuid not null references public.terms (id) on delete cascade,
  ca1_score         numeric(5,2) not null default 0 check (ca1_score between 0 and 20),
  ca2_score         numeric(5,2) not null default 0 check (ca2_score between 0 and 20),
  exam_score        numeric(5,2) not null default 0 check (exam_score between 0 and 60),
  ca_score          numeric(5,2) generated always as (ca1_score + ca2_score) stored,
  total_score       numeric(6,2) generated always as (ca1_score + ca2_score + exam_score) stored,
  grade             text,
  remark            text,
  position_in_class integer,
  status            public.result_status not null default 'draft',
  entered_by        uuid references public.profiles (id) on delete set null,
  approved_by       uuid references public.profiles (id) on delete set null,
  approved_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (student_id, subject_id, term_id)
);

create index if not exists results_class_term_idx on public.results (class_id, term_id);
create index if not exists results_student_idx on public.results (student_id);
create index if not exists results_status_idx on public.results (status);

drop trigger if exists results_set_updated_at on public.results;
create trigger results_set_updated_at
  before update on public.results
  for each row execute function public.set_updated_at();

-- Keep grade / remark derived from total_score on every write
create or replace function public.results_derive_grade()
returns trigger
language plpgsql
as $$
begin
  new.grade := public.grade_for_score(
    coalesce(new.ca1_score, 0) + coalesce(new.ca2_score, 0) + coalesce(new.exam_score, 0)
  );
  new.remark := public.remark_for_grade(new.grade);
  return new;
end;
$$;

drop trigger if exists results_derive_grade on public.results;
create trigger results_derive_grade
  before insert or update of ca1_score, ca2_score, exam_score on public.results
  for each row execute function public.results_derive_grade();-- ---------------------------------------------------------------------------
-- Granular continuous-assessment components (test 1, test 2, project ...)
-- ---------------------------------------------------------------------------
create table if not exists public.continuous_assessments (
  id           uuid primary key default gen_random_uuid(),
  result_id    uuid not null references public.results (id) on delete cascade,
  title        text not null,
  max_score    numeric(5,2) not null default 20 check (max_score > 0),
  score        numeric(5,2),
  recorded_by  uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (result_id, title)
);

create index if not exists continuous_assessments_result_idx on public.continuous_assessments (result_id);

drop trigger if exists continuous_assessments_set_updated_at on public.continuous_assessments;
create trigger continuous_assessments_set_updated_at
  before update on public.continuous_assessments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Report cards (per student, per term)
-- ---------------------------------------------------------------------------
create table if not exists public.report_cards (
  id                    uuid primary key default gen_random_uuid(),
  student_id            uuid not null references public.students (id) on delete cascade,
  class_id              uuid not null references public.classes (id) on delete restrict,
  academic_year_id      uuid references public.academic_years (id) on delete set null,
  term_id               uuid not null references public.terms (id) on delete cascade,
  subjects_offered      integer,
  total_score           numeric(8,2),
  average_score         numeric(6,2),
  position_in_class     integer,
  class_size            integer,
  days_school_open      integer,
  days_present          integer,
  days_absent           integer,
  next_term_begins      date,
  class_teacher_remark  text,
  principal_remark      text,
  status                public.result_status not null default 'draft',
  generated_by          uuid references public.profiles (id) on delete set null,
  published_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (student_id, term_id)
);

create index if not exists report_cards_class_term_idx on public.report_cards (class_id, term_id);

drop trigger if exists report_cards_set_updated_at on public.report_cards;
create trigger report_cards_set_updated_at
  before update on public.report_cards
  for each row execute function public.set_updated_at();-- ---------------------------------------------------------------------------
-- Assignments and submissions
-- ---------------------------------------------------------------------------
create table if not exists public.assignments (
  id                uuid primary key default gen_random_uuid(),
  class_id          uuid not null references public.classes (id) on delete cascade,
  subject_id        uuid references public.subjects (id) on delete set null,
  teacher_id        uuid references public.profiles (id) on delete set null,
  academic_year_id  uuid references public.academic_years (id) on delete set null,
  term_id           uuid references public.terms (id) on delete set null,
  title             text not null,
  description       text,
  attachment_url    text,
  max_score         numeric(5,2) not null default 10,
  due_date          timestamptz,
  is_published      boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists assignments_class_idx on public.assignments (class_id);

drop trigger if exists assignments_set_updated_at on public.assignments;
create trigger assignments_set_updated_at
  before update on public.assignments
  for each row execute function public.set_updated_at();

create table if not exists public.assignment_submissions (
  id             uuid primary key default gen_random_uuid(),
  assignment_id  uuid not null references public.assignments (id) on delete cascade,
  student_id     uuid not null references public.students (id) on delete cascade,
  content        text,
  attachment_url text,
  status         public.submission_status not null default 'pending',
  score          numeric(5,2),
  feedback       text,
  submitted_at   timestamptz,
  graded_by      uuid references public.profiles (id) on delete set null,
  graded_at      timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (assignment_id, student_id)
);

create index if not exists assignment_submissions_student_idx on public.assignment_submissions (student_id);

drop trigger if exists assignment_submissions_set_updated_at on public.assignment_submissions;
create trigger assignment_submissions_set_updated_at
  before update on public.assignment_submissions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Timetables
-- ---------------------------------------------------------------------------
create table if not exists public.timetables (
  id                uuid primary key default gen_random_uuid(),
  class_id          uuid not null references public.classes (id) on delete cascade,
  subject_id        uuid references public.subjects (id) on delete set null,
  teacher_id        uuid references public.profiles (id) on delete set null,
  academic_year_id  uuid references public.academic_years (id) on delete set null,
  term_id           uuid references public.terms (id) on delete set null,
  day_of_week       smallint not null check (day_of_week between 1 and 5),
  start_time        time not null,
  end_time          time not null,
  room              text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint timetables_time_order check (end_time > start_time)
);

create unique index if not exists timetables_slot_idx
  on public.timetables (class_id, day_of_week, start_time, coalesce(term_id, '00000000-0000-0000-0000-000000000000'::uuid));
create index if not exists timetables_teacher_idx on public.timetables (teacher_id);

drop trigger if exists timetables_set_updated_at on public.timetables;
create trigger timetables_set_updated_at
  before update on public.timetables
  for each row execute function public.set_updated_at();