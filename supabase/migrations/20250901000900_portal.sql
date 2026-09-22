-- ============================================================================
-- Jasmine Exclusive School (JES) - Family portals (parent & student)
-- Migration 09
--
-- Row level security already scopes student records to the signed-in parent
-- (public.visible_student_ids) or the signed-in student (public.my_student_id).
-- What a family portal still cannot read is the *display* data that lives on
-- public.profiles, because `profiles_select` only allows the owner, staff and
-- administrators. Instead of widening that policy, the three helpers below
-- expose the tiny, safe projections the portals actually need - the same
-- technique the public website uses with public_staff_directory().
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Children of the signed-in parent (empty for every other role)
-- ---------------------------------------------------------------------------
create or replace function public.my_children()
returns table (
  student_id    uuid,
  profile_id    uuid,
  full_name     text,
  admission_no  text,
  class_id      uuid,
  class_name    text,
  gender        public.gender_type,
  status        public.student_status,
  photo_url     text,
  relationship  text,
  is_primary    boolean
)
language sql stable security definer set search_path = public
as $$
  select s.id,
         s.profile_id,
         p.full_name,
         s.admission_no,
         s.class_id,
         c.name,
         s.gender,
         s.status,
         coalesce(s.photo_url, p.avatar_url),
         ps.relationship,
         ps.is_primary
    from public.parent_student ps
    join public.parents  pa on pa.id = ps.parent_id
    join public.students s  on s.id = ps.student_id
    join public.profiles p  on p.id = s.profile_id
    left join public.classes c on c.id = s.class_id
   where pa.profile_id = auth.uid()
     and p.is_active
   order by p.full_name;
$$;

comment on function public.my_children() is
  'Wards of the signed-in parent (safe projection used by the parent portal).';

-- ---------------------------------------------------------------------------
-- Teacher display names for timetable / assignment captions.
-- Mirrors the public staff directory: only active, publicly listed staff.
-- ---------------------------------------------------------------------------
create or replace function public.teacher_directory()
returns table (profile_id uuid, full_name text, position text)
language sql stable security definer set search_path = public
as $$
  select s.profile_id, p.full_name, s.position
    from public.staff s
    join public.profiles p on p.id = s.profile_id
   where s.is_public
     and s.status <> 'resigned'
     and p.is_active;
$$;

comment on function public.teacher_directory() is
  'Active, publicly listed teachers (name + position) for portal captions.';

-- ---------------------------------------------------------------------------
-- School office: the accounts a parent may message from the portal.
-- ---------------------------------------------------------------------------
create or replace function public.school_contacts()
returns table (profile_id uuid, full_name text, role public.user_role)
language sql stable security definer set search_path = public
as $$
  select p.id, p.full_name, p.role
    from public.profiles p
   where p.is_active
     and p.role in ('super_admin', 'admin', 'principal', 'vice_principal', 'accountant')
   order by case p.role
              when 'admin'          then 1
              when 'principal'      then 2
              when 'vice_principal' then 3
              when 'accountant'     then 4
              else 5
            end,
            p.full_name;
$$;

comment on function public.school_contacts() is
  'Office accounts a parent may message from the parent portal.';

grant execute on function public.my_children() to authenticated;
grant execute on function public.teacher_directory() to authenticated;
grant execute on function public.school_contacts() to authenticated;
