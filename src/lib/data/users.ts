import { createClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';
import type { UserRole } from '@/types/database';

export type UserListFilters = {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

export type UserListRow = {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

export type UserListResult = {
  rows: UserListRow[];
  total: number;
  page: number;
  pageSize: number;
};

const PAGE_SIZE = 25;
const PROFILE_COLUMNS =
  'id, email, full_name, phone, role, is_active, is_verified, last_login_at, created_at';

type ProfileQueryRow = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  last_login_at: string | null;
  created_at: string;
};

function toUserListRow(row: ProfileQueryRow): UserListRow {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    phone: row.phone,
    role: row.role as UserRole,
    isActive: row.is_active,
    isVerified: row.is_verified,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
  };
}

/** Paginated, searchable account list for the administration portal. */
export async function listUsers(filters: UserListFilters = {}): Promise<UserListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? PAGE_SIZE;

  if (!hasSupabaseEnv()) {
    return { rows: [], total: 0, page, pageSize };
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await createClient();
  let query = supabase
    .from('profiles')
    .select(PROFILE_COLUMNS, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (filters.search) {
    const term = `%${filters.search.replace(/[%,()]/g, '')}%`;
    query = query.or(`full_name.ilike.${term},email.ilike.${term}`);
  }

  if (filters.role && filters.role !== 'all') {
    query = query.eq('role', filters.role as UserRole);
  }

  if (filters.status === 'active') query = query.eq('is_active', true);
  if (filters.status === 'disabled') query = query.eq('is_active', false);

  const { data, error, count } = await query;

  if (error || !data) {
    return { rows: [], total: 0, page, pageSize };
  }

  return {
    rows: (data as ProfileQueryRow[]).map(toUserListRow),
    total: count ?? data.length,
    page,
    pageSize,
  };
}

export type UserDetail = UserListRow & {
  avatarUrl: string | null;
  updatedAt: string;
  notificationPreferences: Record<string, unknown> | null;
};

export type AuditLogRow = {
  id: string;
  action: string;
  category: string;
  details: string | null;
  actorEmail: string | null;
  createdAt: string;
};

/** Single profile fetch for the user detail screen. */
export async function getUserById(id: string): Promise<UserDetail | null> {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select(
      'id, email, full_name, phone, avatar_url, role, is_active, is_verified, last_login_at, created_at, updated_at, notification_preferences'
    )
    .eq('id', id)
    .maybeSingle();

  if (!data) return null;
  const row = data as {
    id: string;
    email: string;
    full_name: string;
    phone: string | null;
    avatar_url: string | null;
    role: string;
    is_active: boolean;
    is_verified: boolean;
    last_login_at: string | null;
    created_at: string;
    updated_at: string;
    notification_preferences: Record<string, unknown> | null;
  };

  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    phone: row.phone,
    avatarUrl: row.avatar_url,
    role: row.role as UserRole,
    isActive: row.is_active,
    isVerified: row.is_verified,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    notificationPreferences: row.notification_preferences,
  };
}

/** Recent audit activity for one account (matched on actor id, then email). */
export async function listAuditLogsForUser(
  userId: string,
  email: string,
  limit = 25
): Promise<AuditLogRow[]> {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from('audit_logs')
    .select('id, action, category, details, actor_email, created_at')
    .or(`actor_id.eq.${userId},actor_email.eq.${email}`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (!data) return [];
  return (data as Array<{
    id: string;
    action: string;
    category: string;
    details: string | null;
    actor_email: string | null;
    created_at: string;
  }>).map((row) => ({
    id: row.id,
    action: row.action,
    category: row.category,
    details: row.details,
    actorEmail: row.actor_email,
    createdAt: row.created_at,
  }));
}

export type ClassOption = { id: string; name: string };

/** Active classes for the student-creation modal. */
export async function listClassOptions(): Promise<ClassOption[]> {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from('classes')
    .select('id, name')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (!data) return [];
  return data as ClassOption[];
}

export type UserStatistics = {
  total: number;
  active: number;
  disabled: number;
  staff: number;
  parents: number;
  students: number;
};

/** Aggregate counts for the user management header tiles. */
export async function getUserStatistics(): Promise<UserStatistics> {
  if (!hasSupabaseEnv()) {
    return { total: 0, active: 0, disabled: 0, staff: 0, parents: 0, students: 0 };
  }

  const supabase = await createClient();

  const [total, active, staff, parents, students] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .in('role', [
        'super_admin',
        'admin',
        'principal',
        'vice_principal',
        'hod',
        'teacher',
        'accountant',
      ]),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'parent'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
  ]);

  const totalCount = total.count ?? 0;
  const activeCount = active.count ?? 0;

  return {
    total: totalCount,
    active: activeCount,
    disabled: Math.max(0, totalCount - activeCount),
    staff: staff.count ?? 0,
    parents: parents.count ?? 0,
    students: students.count ?? 0,
  };
}
