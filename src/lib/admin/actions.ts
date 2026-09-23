'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { TermName } from '@/types/database';

/** Authenticated admin context; redirects to login when signed out. */
async function ctx() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;
  if (!user) redirect('/login/admin');
  return { supabase, userId: user.id };
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? '').trim();
}
function num(fd: FormData, key: string, fallback = 0): number {
  const v = Number(fd.get(key));
  return Number.isFinite(v) ? v : fallback;
}
function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === 'on' || fd.get(key) === 'true';
}
function back(path: string, message: string, ok = true): never {
  revalidatePath(path);
  redirect(`${path}?${ok ? 'ok' : 'err'}=${encodeURIComponent(message)}`);
}

const DELETABLE_LIST = [
  'departments',
  'curriculum_topics',
  'alumni_records',
  'media_assets',
  'announcements',
  'circulars',
  'classes',
  'subjects',
  'results',
] as const;
type DeletableTable = (typeof DELETABLE_LIST)[number];
const DELETABLE = new Set<string>(DELETABLE_LIST);

export async function deleteAdminRow(fd: FormData) {
  const table = str(fd, 'table');
  const id = str(fd, 'id');
  const path = str(fd, 'path') || '/admin';
  if (!DELETABLE.has(table) || !id) back(path, 'Invalid delete request', false);
  const { supabase } = await ctx();
  const { error } = await supabase.from(table as 'media_assets').delete().eq('id', id);
  back(path, error ? `Delete failed: ${error.message}` : 'Deleted successfully', !error);
}

// --------------------------- Academic calendar ------------------------------

export async function saveAcademicYear(fd: FormData) {
  const { supabase } = await ctx();
  const id = str(fd, 'id');
  const name = str(fd, 'name');
  const start_date = str(fd, 'start_date');
  const end_date = str(fd, 'end_date');
  const is_current = bool(fd, 'is_current');
  if (!name || !start_date || !end_date) back('/admin/academic-sessions', 'Name and dates are required', false);

  if (is_current) await supabase.from('academic_years').update({ is_current: false }).neq('id', id || '');
  const row = { name, start_date, end_date, is_current };
  const { error } = id
    ? await supabase.from('academic_years').update(row).eq('id', id)
    : await supabase.from('academic_years').insert(row);
  back('/admin/academic-sessions', error ? error.message : `Session ${name} saved`, !error);
}

const TERM_MAP: Record<string, TermName> = {
  'First Term': 'first_term',
  first_term: 'first_term',
  'Second Term': 'second_term',
  second_term: 'second_term',
  'Third Term': 'third_term',
  third_term: 'third_term',
};

export async function saveTerm(fd: FormData) {
  const { supabase } = await ctx();
  const id = str(fd, 'id');
  const academic_year_id = str(fd, 'academic_year_id');
  const nameInput = str(fd, 'name');
  const name = TERM_MAP[nameInput];
  const row = {
    academic_year_id,
    name,
    start_date: str(fd, 'start_date'),
    end_date: str(fd, 'end_date'),
    is_current: bool(fd, 'is_current'),
  };
  if (!academic_year_id || !name || !row.start_date || !row.end_date) back('/admin/terms', 'All fields are required', false);
  if (row.is_current) await supabase.from('terms').update({ is_current: false }).neq('id', id || '');
  const { error } = id
    ? await supabase.from('terms').update(row).eq('id', id)
    : await supabase.from('terms').insert(row);
  back('/admin/terms', error ? error.message : `${nameInput} saved`, !error);
}

export async function saveDepartment(fd: FormData) {
  const { supabase } = await ctx();
  const id = str(fd, 'id');
  const row = {
    code: str(fd, 'code').toUpperCase(),
    name: str(fd, 'name'),
    hod_name: str(fd, 'hod_name') || null,
    description: str(fd, 'description') || null,
    is_active: bool(fd, 'is_active'),
  };
  if (!row.code || !row.name) back('/admin/departments', 'Code and name are required', false);
  const { error } = id
    ? await supabase.from('departments').update(row).eq('id', id)
    : await supabase.from('departments').insert(row);
  back('/admin/departments', error ? error.message : 'Department saved', !error);
}

// ------------------------------ Classes --------------------------------------

export async function saveClass(fd: FormData) {
  const { supabase } = await ctx();
  const id = str(fd, 'id');
  const teacher = str(fd, 'class_teacher_id');
  const row = {
    name: str(fd, 'name'),
    level: str(fd, 'level') as 'nursery' | 'primary' | 'junior_secondary' | 'senior_secondary',
    arm: str(fd, 'arm') || null,
    capacity: num(fd, 'capacity', 40),
    room: str(fd, 'room') || null,
    class_teacher_id: teacher || null,
    is_active: bool(fd, 'is_active'),
  };
  if (!row.name) back('/admin/classes', 'Class name is required', false);
  const { error } = id
    ? await supabase.from('classes').update(row).eq('id', id)
    : await supabase.from('classes').insert(row);
  back('/admin/classes', error ? error.message : `Class ${row.name} saved`, !error);
}

// ------------------------------ Subjects -------------------------------------

export async function saveSubject(fd: FormData) {
  const { supabase } = await ctx();
  const id = str(fd, 'id');
  const row = {
    code: str(fd, 'code').toUpperCase(),
    name: str(fd, 'name'),
    department: str(fd, 'department') || null,
    level: str(fd, 'level') as 'nursery' | 'primary' | 'junior_secondary' | 'senior_secondary' | null,
    description: str(fd, 'description') || null,
    is_active: bool(fd, 'is_active'),
  };
  if (!row.code || !row.name) back('/admin/subjects', 'Code and name are required', false);
  const { error } = id
    ? await supabase.from('subjects').update(row).eq('id', id)
    : await supabase.from('subjects').insert(row);
  back('/admin/subjects', error ? error.message : `Subject ${row.name} saved`, !error);
}

// --------------------------- Curriculum topics --------------------------------

export async function saveCurriculumTopic(fd: FormData) {
  const { supabase, userId } = await ctx();
  const id = str(fd, 'id');
  const row = {
    subject_id: str(fd, 'subject_id'),
    class_id: str(fd, 'class_id') || null,
    term_id: str(fd, 'term_id') || null,
    week_number: Math.min(14, Math.max(1, num(fd, 'week_number', 1))),
    topic: str(fd, 'topic'),
    objectives: str(fd, 'objectives') || null,
    created_by: userId,
  };
  if (!row.subject_id || !row.topic) back('/admin/curriculum', 'Subject and topic are required', false);
  const { error } = id
    ? await supabase.from('curriculum_topics').update(row).eq('id', id)
    : await supabase.from('curriculum_topics').insert(row);
  back('/admin/curriculum', error ? error.message : 'Topic saved', !error);
}
