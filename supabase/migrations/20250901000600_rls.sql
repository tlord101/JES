-- ============================================================================
-- Jasmine Exclusive School (JES) - Row Level Security
-- Migration 06
-- Every table is protected. Helper functions are SECURITY DEFINER so that
-- policies never recurse into the tables they guard.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Additional access helpers
-- ---------------------------------------------------------------------------
create or replace function public.my_email()
returns citext
language sql stable security definer set search_path = public
as $$
  select email from public.profiles where id = auth.uid();
$$;

-- super admin, admin and principal may author website content
create or replace function public.can_manage_content()
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.auth_role() in ('super_admin', 'admin', 'principal');
$$;

-- can the signed-in user read this student's records?
create or replace function public.sees_student(target_student uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.is_admin()
      or public.is_staff()
      or exists (select 1 from public.visible_student_ids() v where v = target_student);
$$;

-- publish state helper
create or replace function public.is_published(value public.content_status)
returns boolean
language sql immutable
as $$
  select value = 'published';
$$;-- ---------------------------------------------------------------------------
-- School structure (public read, administrator write)
-- ---------------------------------------------------------------------------
alter table public.academic_years enable row level security;
alter table public.terms enable row level security;
alter table public.classes enable row level security;
alter table public.subjects enable row level security;
alter table public.class_subjects enable row level security;
alter table public.pta_members enable row level security;

drop policy if exists academic_years_read on public.academic_years;
create policy academic_years_read on public.academic_years for select using (true);
drop policy if exists academic_years_write on public.academic_years;
create policy academic_years_write on public.academic_years
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists terms_read on public.terms;
create policy terms_read on public.terms for select using (true);
drop policy if exists terms_write on public.terms;
create policy terms_write on public.terms
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists classes_read on public.classes;
create policy classes_read on public.classes for select using (true);
drop policy if exists classes_write on public.classes;
create policy classes_write on public.classes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists subjects_read on public.subjects;
create policy subjects_read on public.subjects for select using (true);
drop policy if exists subjects_write on public.subjects;
create policy subjects_write on public.subjects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists class_subjects_read on public.class_subjects;
create policy class_subjects_read on public.class_subjects for select using (true);
drop policy if exists class_subjects_write on public.class_subjects;
create policy class_subjects_write on public.class_subjects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists pta_members_read on public.pta_members;
create policy pta_members_read on public.pta_members for select using (true);
drop policy if exists pta_members_write on public.pta_members;
create policy pta_members_write on public.pta_members
  for all to authenticated using (public.is_admin()) with check (public.is_admin());-- ---------------------------------------------------------------------------
-- Identity
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_staff() or public.is_admin());

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles
  for insert to authenticated
  with check (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop policy if exists profiles_delete_admin on public.profiles;
create policy profiles_delete_admin on public.profiles
  for delete to authenticated
  using (public.is_admin());

-- Non-admins may change their own contact details but never their role or
-- activation state.
create or replace function public.profiles_guard_privileges()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if public.is_admin() or auth.uid() is null then
    return new;
  end if;
  if new.role is distinct from old.role
     or new.is_active is distinct from old.is_active
     or new.is_verified is distinct from old.is_verified
     or new.email is distinct from old.email then
    raise exception 'Only an administrator can change role, email or account status.';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_privileges on public.profiles;
create trigger profiles_guard_privileges
  before update on public.profiles
  for each row execute function public.profiles_guard_privileges();-- ---------------------------------------------------------------------------
-- Staff teaching duties and alumni
-- ---------------------------------------------------------------------------
alter table public.staff_subjects enable row level security;
alter table public.staff_classes enable row level security;
alter table public.alumni enable row level security;

drop policy if exists staff_subjects_read on public.staff_subjects;
create policy staff_subjects_read on public.staff_subjects
  for select to authenticated using (public.is_staff() or public.is_admin());
drop policy if exists staff_subjects_write on public.staff_subjects;
create policy staff_subjects_write on public.staff_subjects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists staff_classes_read on public.staff_classes;
create policy staff_classes_read on public.staff_classes
  for select to authenticated using (public.is_staff() or public.is_admin());
drop policy if exists staff_classes_write on public.staff_classes;
create policy staff_classes_write on public.staff_classes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists alumni_select on public.alumni;
create policy alumni_select on public.alumni
  for select to authenticated
  using (profile_id = auth.uid() or public.is_admin());

drop policy if exists alumni_insert_self on public.alumni;
create policy alumni_insert_self on public.alumni
  for insert to authenticated with check (profile_id = auth.uid() or public.is_admin());

drop policy if exists alumni_update on public.alumni;
create policy alumni_update on public.alumni
  for update to authenticated
  using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());-- ---------------------------------------------------------------------------
-- Students
-- ---------------------------------------------------------------------------
alter table public.students enable row level security;

drop policy if exists students_select on public.students;
create policy students_select on public.students
  for select to authenticated
  using (
    public.sees_student(id)
    or public.is_teacher()
  );

drop policy if exists students_write_admin on public.students;
create policy students_write_admin on public.students
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Staff
-- ---------------------------------------------------------------------------
alter table public.staff enable row level security;

drop policy if exists staff_select on public.staff;
create policy staff_select on public.staff
  for select to authenticated
  using (profile_id = auth.uid() or public.is_staff() or public.is_admin());

drop policy if exists staff_write_admin on public.staff;
create policy staff_write_admin on public.staff
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Public staff directory
create or replace function public.public_staff_directory()
returns table (
  id uuid, staff_no text, full_name text, "position" text, department text,
  qualification text, biography text, photo_url text, sort_order integer
)
language sql stable security definer set search_path = public
as $$
  select * from public.staff_directory_public order by sort_order, full_name;
$$;

grant execute on function public.public_staff_directory() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Parents
-- ---------------------------------------------------------------------------
alter table public.parents enable row level security;

drop policy if exists parents_select on public.parents;
create policy parents_select on public.parents
  for select to authenticated
  using (profile_id = auth.uid() or public.is_staff() or public.is_admin());

drop policy if exists parents_write on public.parents;
create policy parents_write on public.parents
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

alter table public.parent_student enable row level security;

drop policy if exists parent_student_select on public.parent_student;
create policy parent_student_select on public.parent_student
  for select to authenticated
  using (
    public.is_admin()
    or public.is_staff()
    or parent_id = public.my_parent_id()
    or student_id = public.my_student_id()
  );

drop policy if exists parent_student_write on public.parent_student;
create policy parent_student_write on public.parent_student
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());-- ---------------------------------------------------------------------------
-- Continuous assessments (scoped through their parent result)
-- ---------------------------------------------------------------------------
alter table public.continuous_assessments enable row level security;

drop policy if exists ca_select on public.continuous_assessments;
create policy ca_select on public.continuous_assessments
  for select to authenticated
  using (exists (select 1 from public.results r where r.id = result_id));

drop policy if exists ca_write on public.continuous_assessments;
create policy ca_write on public.continuous_assessments
  for all to authenticated
  using (
    exists (
      select 1 from public.results r
       where r.id = result_id
         and (public.is_admin() or (public.is_teacher() and public.is_my_class(r.class_id)))
    )
  )
  with check (
    exists (
      select 1 from public.results r
       where r.id = result_id
         and (public.is_admin() or (public.is_teacher() and public.is_my_class(r.class_id)))
    )
  );

-- ---------------------------------------------------------------------------
-- Report cards
-- ---------------------------------------------------------------------------
alter table public.report_cards enable row level security;

drop policy if exists report_cards_select on public.report_cards;
create policy report_cards_select on public.report_cards
  for select to authenticated
  using (
    public.is_admin()
    or (public.is_teacher() and public.is_my_class(class_id))
    or (
      status = 'published'
      and exists (select 1 from public.visible_student_ids() v where v = student_id)
    )
  );

drop policy if exists report_cards_write on public.report_cards;
create policy report_cards_write on public.report_cards
  for all to authenticated
  using (
    public.is_admin()
    or public.can_approve_results()
    or (public.is_teacher() and public.is_my_class(class_id))
  )
  with check (
    public.is_admin()
    or public.can_approve_results()
    or (public.is_teacher() and public.is_my_class(class_id))
  );-- ---------------------------------------------------------------------------
-- Attendance
-- ---------------------------------------------------------------------------
alter table public.attendance enable row level security;

drop policy if exists attendance_select on public.attendance;
create policy attendance_select on public.attendance
  for select to authenticated
  using (
    public.is_admin()
    or (public.is_teacher() and public.is_my_class(class_id))
    or public.sees_student(student_id)
  );

drop policy if exists attendance_write on public.attendance;
create policy attendance_write on public.attendance
  for all to authenticated
  using (public.is_admin() or (public.is_teacher() and public.is_my_class(class_id)))
  with check (public.is_admin() or (public.is_teacher() and public.is_my_class(class_id)));

-- ---------------------------------------------------------------------------
-- Results
-- ---------------------------------------------------------------------------
alter table public.results enable row level security;

drop policy if exists results_select on public.results;
create policy results_select on public.results
  for select to authenticated
  using (
    public.is_admin()
    or (public.is_teacher() and public.is_my_class(class_id))
    or (
      status = 'published'
      and exists (select 1 from public.visible_student_ids() v where v = student_id)
    )
  );

drop policy if exists results_insert on public.results;
create policy results_insert on public.results
  for insert to authenticated
  with check (public.is_admin() or (public.is_teacher() and public.is_my_class(class_id)));

drop policy if exists results_update on public.results;
create policy results_update on public.results
  for update to authenticated
  using (public.is_admin() or (public.is_teacher() and public.is_my_class(class_id)))
  with check (public.is_admin() or (public.is_teacher() and public.is_my_class(class_id)));

drop policy if exists results_delete_admin on public.results;
create policy results_delete_admin on public.results
  for delete to authenticated using (public.is_admin());-- ---------------------------------------------------------------------------
-- Assignments and submissions
-- ---------------------------------------------------------------------------
alter table public.assignments enable row level security;

drop policy if exists assignments_select on public.assignments;
create policy assignments_select on public.assignments
  for select to authenticated
  using (
    public.is_admin()
    or (public.is_teacher() and public.is_my_class(class_id))
    or exists (
      select 1 from public.students s
       where s.id = public.my_student_id() and s.class_id = assignments.class_id
    )
    or exists (
      select 1 from public.students s
       where s.class_id = assignments.class_id
         and exists (select 1 from public.visible_student_ids() v where v = s.id)
    )
  );

drop policy if exists assignments_write on public.assignments;
create policy assignments_write on public.assignments
  for all to authenticated
  using (public.is_admin() or (public.is_teacher() and public.is_my_class(class_id)))
  with check (public.is_admin() or (public.is_teacher() and public.is_my_class(class_id)));

alter table public.assignment_submissions enable row level security;

drop policy if exists submissions_select on public.assignment_submissions;
create policy submissions_select on public.assignment_submissions
  for select to authenticated
  using (
    public.is_admin()
    or public.sees_student(student_id)
    or exists (
      select 1 from public.assignments a
       where a.id = assignment_id and public.is_teacher() and public.is_my_class(a.class_id)
    )
  );

drop policy if exists submissions_insert on public.assignment_submissions;
create policy submissions_insert on public.assignment_submissions
  for insert to authenticated
  with check (student_id = public.my_student_id() or public.is_admin());

drop policy if exists submissions_update on public.assignment_submissions;
create policy submissions_update on public.assignment_submissions
  for update to authenticated
  using (
    student_id = public.my_student_id()
    or public.is_admin()
    or exists (
      select 1 from public.assignments a
       where a.id = assignment_id and public.is_teacher() and public.is_my_class(a.class_id)
    )
  )
  with check (
    student_id = public.my_student_id()
    or public.is_admin()
    or exists (
      select 1 from public.assignments a
       where a.id = assignment_id and public.is_teacher() and public.is_my_class(a.class_id)
    )
  );

-- ---------------------------------------------------------------------------
-- Timetables (readable by every signed-in user)
-- ---------------------------------------------------------------------------
alter table public.timetables enable row level security;

drop policy if exists timetables_read on public.timetables;
create policy timetables_read on public.timetables
  for select to authenticated using (true);

drop policy if exists timetables_write on public.timetables;
create policy timetables_write on public.timetables
  for all to authenticated
  using (public.is_admin() or public.is_teacher())
  with check (public.is_admin() or public.is_teacher());-- ---------------------------------------------------------------------------
-- Finance
-- ---------------------------------------------------------------------------
alter table public.fee_structures enable row level security;
alter table public.fee_items enable row level security;

drop policy if exists fee_structures_read on public.fee_structures;
create policy fee_structures_read on public.fee_structures
  for select using (is_active = true or public.is_accountant() or public.is_admin());

drop policy if exists fee_structures_write on public.fee_structures;
create policy fee_structures_write on public.fee_structures
  for all to authenticated
  using (public.is_accountant()) with check (public.is_accountant());

drop policy if exists fee_items_read on public.fee_items;
create policy fee_items_read on public.fee_items
  for select using (true);

drop policy if exists fee_items_write on public.fee_items;
create policy fee_items_write on public.fee_items
  for all to authenticated
  using (public.is_accountant()) with check (public.is_accountant());

alter table public.invoices enable row level security;

drop policy if exists invoices_select on public.invoices;
create policy invoices_select on public.invoices
  for select to authenticated
  using (
    public.is_admin()
    or public.is_accountant()
    or exists (select 1 from public.visible_student_ids() v where v = student_id)
  );

drop policy if exists invoices_write on public.invoices;
create policy invoices_write on public.invoices
  for all to authenticated
  using (public.is_accountant()) with check (public.is_accountant());

alter table public.payments enable row level security;

drop policy if exists payments_select on public.payments;
create policy payments_select on public.payments
  for select to authenticated
  using (
    public.is_admin()
    or public.is_accountant()
    or exists (select 1 from public.visible_student_ids() v where v = student_id)
  );

drop policy if exists payments_write on public.payments;
create policy payments_write on public.payments
  for all to authenticated
  using (public.is_accountant()) with check (public.is_accountant());

alter table public.payment_receipts enable row level security;

drop policy if exists receipts_select on public.payment_receipts;
create policy receipts_select on public.payment_receipts
  for select to authenticated
  using (
    public.is_admin()
    or public.is_accountant()
    or exists (
      select 1 from public.payments p
       where p.id = payment_id
         and exists (select 1 from public.visible_student_ids() v where v = p.student_id)
    )
  );

drop policy if exists receipts_write on public.payment_receipts;
create policy receipts_write on public.payment_receipts
  for all to authenticated
  using (public.is_accountant()) with check (public.is_accountant());-- ---------------------------------------------------------------------------
-- Website content (public read for published rows)
-- ---------------------------------------------------------------------------
alter table public.news enable row level security;
alter table public.events enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_images enable row level security;
alter table public.announcements enable row level security;
alter table public.circulars enable row level security;
alter table public.pages enable row level security;
alter table public.site_settings enable row level security;
alter table public.faqs enable row level security;
alter table public.contact_messages enable row level security;
alter table public.clubs enable row level security;
alter table public.club_members enable row level security;

drop policy if exists news_read on public.news;
create policy news_read on public.news
  for select using (status = 'published' or public.can_manage_content());
drop policy if exists news_write on public.news;
create policy news_write on public.news
  for all to authenticated
  using (public.can_manage_content()) with check (public.can_manage_content());

drop policy if exists events_read on public.events;
create policy events_read on public.events
  for select using (status = 'published' or public.can_manage_content());
drop policy if exists events_write on public.events;
create policy events_write on public.events
  for all to authenticated
  using (public.can_manage_content()) with check (public.can_manage_content());

drop policy if exists gallery_albums_read on public.gallery_albums;
create policy gallery_albums_read on public.gallery_albums
  for select using (is_published = true or public.can_manage_content());
drop policy if exists gallery_albums_write on public.gallery_albums;
create policy gallery_albums_write on public.gallery_albums
  for all to authenticated
  using (public.can_manage_content()) with check (public.can_manage_content());

drop policy if exists gallery_images_read on public.gallery_images;
create policy gallery_images_read on public.gallery_images for select using (true);
drop policy if exists gallery_images_write on public.gallery_images;
create policy gallery_images_write on public.gallery_images
  for all to authenticated
  using (public.can_manage_content()) with check (public.can_manage_content());

drop policy if exists pages_read on public.pages;
create policy pages_read on public.pages
  for select using (is_published = true or public.can_manage_content());
drop policy if exists pages_write on public.pages;
create policy pages_write on public.pages
  for all to authenticated
  using (public.can_manage_content()) with check (public.can_manage_content());

drop policy if exists site_settings_read on public.site_settings;
create policy site_settings_read on public.site_settings for select using (true);
drop policy if exists site_settings_write on public.site_settings;
create policy site_settings_write on public.site_settings
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists faqs_read on public.faqs;
create policy faqs_read on public.faqs
  for select using (is_published = true or public.is_admin());
drop policy if exists faqs_write on public.faqs;
create policy faqs_write on public.faqs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Announcements: audience aware
create or replace function public.is_student()
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.auth_role() = 'student';
$$;

create or replace function public.is_parent()
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.auth_role() = 'parent';
$$;



drop policy if exists announcements_read on public.announcements;
create policy announcements_read on public.announcements
  for select to authenticated
  using (
    public.can_manage_content()
    or (
      is_published
      and (expires_at is null or expires_at > now())
      and (
        audience = 'everyone'
        or (audience = 'staff' and public.is_staff())
        or (audience = 'students' and public.is_student())
        or (audience = 'parents' and public.is_parent())
        or (audience = 'class' and (
              public.is_staff()
              or exists (
                select 1 from public.students s
                 where s.class_id = announcements.class_id
                   and s.id in (select * from public.visible_student_ids())
              )
            ))
      )
    )
  );

drop policy if exists announcements_write on public.announcements;
create policy announcements_write on public.announcements
  for all to authenticated
  using (
    public.can_manage_content()
    or (public.is_teacher() and (audience <> 'class' or public.is_my_class(class_id)))
  )
  with check (
    public.can_manage_content()
    or (public.is_teacher() and (audience <> 'class' or public.is_my_class(class_id)))
  );

drop policy if exists circulars_read on public.circulars;
create policy circulars_read on public.circulars
  for select to authenticated
  using (is_published or public.can_manage_content());
drop policy if exists circulars_write on public.circulars;
create policy circulars_write on public.circulars
  for all to authenticated
  using (public.can_manage_content()) with check (public.can_manage_content());

drop policy if exists contact_messages_insert on public.contact_messages;
create policy contact_messages_insert on public.contact_messages
  for insert with check (true);
drop policy if exists contact_messages_read on public.contact_messages;
create policy contact_messages_read on public.contact_messages
  for select to authenticated using (public.is_admin());
drop policy if exists contact_messages_update on public.contact_messages;
create policy contact_messages_update on public.contact_messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists clubs_read on public.clubs;
create policy clubs_read on public.clubs for select using (true);
drop policy if exists clubs_write on public.clubs;
create policy clubs_write on public.clubs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists club_members_read on public.club_members;
create policy club_members_read on public.club_members
  for select to authenticated using (true);
drop policy if exists club_members_write on public.club_members;
create policy club_members_write on public.club_members
  for all to authenticated using (public.is_admin()) with check (public.is_admin());-- ---------------------------------------------------------------------------
-- Admissions
-- ---------------------------------------------------------------------------
alter table public.admission_sessions enable row level security;
alter table public.admission_requirements enable row level security;
alter table public.admission_applications enable row level security;
alter table public.application_documents enable row level security;

drop policy if exists admission_sessions_read on public.admission_sessions;
create policy admission_sessions_read on public.admission_sessions for select using (true);
drop policy if exists admission_sessions_write on public.admission_sessions;
create policy admission_sessions_write on public.admission_sessions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists admission_requirements_read on public.admission_requirements;
create policy admission_requirements_read on public.admission_requirements for select using (true);
drop policy if exists admission_requirements_write on public.admission_requirements;
create policy admission_requirements_write on public.admission_requirements
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists applications_insert on public.admission_applications;
create policy applications_insert on public.admission_applications
  for insert with check (true);

drop policy if exists applications_select on public.admission_applications;
create policy applications_select on public.admission_applications
  for select to authenticated
  using (
    public.is_admin()
    or (public.is_staff() and public.auth_role() in ('principal', 'vice_principal'))
    or guardian_email = public.my_email()
  );

drop policy if exists applications_update on public.admission_applications;
create policy applications_update on public.admission_applications
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists application_documents_insert on public.application_documents;
create policy application_documents_insert on public.application_documents
  for insert with check (true);

drop policy if exists application_documents_select on public.application_documents;
create policy application_documents_select on public.application_documents
  for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.admission_applications a
       where a.id = application_id and a.guardian_email = public.my_email()
    )
  );-- ---------------------------------------------------------------------------
-- Messaging, notifications and audit trail
-- ---------------------------------------------------------------------------
alter table public.messages enable row level security;

drop policy if exists messages_select on public.messages;
create policy messages_select on public.messages
  for select to authenticated
  using (sender_id = auth.uid() or recipient_id = auth.uid() or public.is_admin());

drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages
  for insert to authenticated with check (sender_id = auth.uid());

drop policy if exists messages_update on public.messages;
create policy messages_update on public.messages
  for update to authenticated
  using (recipient_id = auth.uid() or public.is_admin())
  with check (recipient_id = auth.uid() or public.is_admin());

alter table public.notifications enable row level security;

drop policy if exists notifications_select on public.notifications;
create policy notifications_select on public.notifications
  for select to authenticated using (profile_id = auth.uid() or public.is_admin());

drop policy if exists notifications_insert on public.notifications;
create policy notifications_insert on public.notifications
  for insert to authenticated with check (public.is_staff() or public.is_admin());

drop policy if exists notifications_update on public.notifications;
create policy notifications_update on public.notifications
  for update to authenticated
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());

alter table public.audit_logs enable row level security;

drop policy if exists audit_logs_select on public.audit_logs;
create policy audit_logs_select on public.audit_logs
  for select to authenticated using (public.is_admin());

drop policy if exists audit_logs_insert on public.audit_logs;
create policy audit_logs_insert on public.audit_logs
  for insert to authenticated with check (actor_id is null or actor_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Grants for the anonymous website visitor
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on public.staff_directory_public to anon, authenticated;
