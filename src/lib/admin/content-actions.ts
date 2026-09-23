'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { recordAudit } from '@/lib/audit';

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
function back(path: string, message: string, ok = true): never {
  revalidatePath(path);
  redirect(`${path}?${ok ? 'ok' : 'err'}=${encodeURIComponent(message)}`);
}

// --------------------------- PTA circulars -----------------------------------

export async function saveCircular(fd: FormData) {
  const { supabase, userId } = await ctx();
  const id = str(fd, 'id');
  const row = {
    title: str(fd, 'title'),
    description: str(fd, 'description') || null,
    file_url: str(fd, 'file_url') || null,
    audience: (str(fd, 'audience') || 'parents') as 'everyone' | 'parents' | 'staff' | 'students',
    is_published: true,
    published_at: new Date().toISOString(),
    created_by: userId,
  };
  if (!row.title) back('/admin/pta', 'Title is required', false);
  const { error } = id
    ? await supabase.from('circulars').update(row).eq('id', id)
    : await supabase.from('circulars').insert(row);
  if (!error) await recordAudit({ action: 'PTA Circular Published', category: 'CMS', details: row.title, actorId: userId });
  back('/admin/pta', error ? error.message : 'Circular published', !error);
}

// --------------------------- Contact messages --------------------------------

export async function setContactMessageRead(fd: FormData) {
  const { supabase, userId } = await ctx();
  const id = str(fd, 'id');
  const is_read = str(fd, 'is_read') === 'true';
  const { error } = await supabase
    .from('contact_messages')
    .update({ is_read, handled_by: userId, handled_at: new Date().toISOString() })
    .eq('id', id);
  back('/admin/messages', error ? error.message : is_read ? 'Marked as read' : 'Marked as unread', !error);
}


// ------------------------------ Media ------------------------------------------

export async function saveMediaAsset(fd: FormData) {
  const { supabase, userId } = await ctx();
  const id = str(fd, 'id');
  const row = {
    name: str(fd, 'name'),
    url: str(fd, 'url'),
    type: (str(fd, 'type') || 'image') as 'image' | 'document' | 'video',
    category: str(fd, 'category') || null,
    uploaded_by: userId,
  };
  if (!row.name || !row.url) back('/admin/media', 'Name and URL are required', false);
  const { error } = id
    ? await supabase.from('media_assets').update(row).eq('id', id)
    : await supabase.from('media_assets').insert(row);
  back('/admin/media', error ? error.message : 'Media asset saved', !error);
}

// --------------------------- Announcements --------------------------------------


// --------------------------- Site settings ---------------------------------------

export async function saveSiteSetting(fd: FormData) {
  const { supabase, userId } = await ctx();
  const key = str(fd, 'key');
  const value = str(fd, 'value');
  const path = str(fd, 'path') || '/admin/settings';
  if (!key) back(path, 'Setting key missing', false);
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, label: null, group_name: 'general', updated_by: userId }, { onConflict: 'key' });
  back(path, error ? error.message : `Saved ${key}`, !error);
}

// ------------------------------ Events --------------------------------------------

export async function saveEvent(fd: FormData) {
  const { supabase, userId } = await ctx();
  const id = str(fd, 'id');
  const row = {
    title: str(fd, 'title'),
    description: str(fd, 'description') || null,
    starts_at: str(fd, 'starts_at'),
    ends_at: str(fd, 'ends_at') || null,
    location: str(fd, 'location') || null,
    category: str(fd, 'category') || 'School Event',
    status: fd.get('status') === 'draft' ? ('draft' as const) : ('published' as const),
    created_by: userId,
  };
  if (!row.title || !row.starts_at) back('/admin/calendar', 'Title and start date are required', false);
  const { error } = id
    ? await supabase.from('events').update(row).eq('id', id)
    : await supabase.from('events').insert({ ...row, slug: str(fd, 'title').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''), cover_image_url: null, is_featured: false });
  back('/admin/calendar', error ? error.message : 'Event saved', !error);
}


export async function saveAlumni(fd: FormData) {
  const { supabase } = await ctx();
  const id = str(fd, 'id');
  const row = {
    full_name: str(fd, 'full_name'),
    graduation_year: str(fd, 'graduation_year'),
    profession: str(fd, 'profession') || null,
    email: str(fd, 'email') || null,
    phone: str(fd, 'phone') || null,
    biography: str(fd, 'biography') || null,
    is_published: fd.get('is_published') !== null,
    sort_order: 0,
  };
  if (!row.full_name || !row.graduation_year) back('/admin/alumni', 'Name and graduation year are required', false);
  const { error } = id
    ? await supabase.from('alumni_records').update(row).eq('id', id)
    : await supabase.from('alumni_records').insert(row);
  back('/admin/alumni', error ? error.message : 'Alumni record saved', !error);
}
