'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import { recordAudit } from '@/lib/audit';
import type { AuthActionState } from '@/lib/auth/action-state';
import { canManageContent } from '@/lib/auth/roles';
import type { ContentStatus, FaqCategory } from '@/types/database';

async function requireContentManager(): Promise<
  { ok: true; actorId: string; actorName: string | null } | { ok: false; state: AuthActionState }
> {
  if (!hasSupabaseEnv()) {
    return {
      ok: false,
      state: {
        status: 'error',
        message: 'Supabase is not configured yet. Add your project URL and keys to .env.local.',
      },
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, state: { status: 'error', message: 'You are not signed in.' } };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active, full_name')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || !profile.is_active || !canManageContent(profile.role)) {
    return {
      ok: false,
      state: { status: 'error', message: 'You do not have permission to manage content.' },
    };
  }

  return { ok: true, actorId: user.id, actorName: profile.full_name ?? null };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function parseErrors(result: { success: boolean; error?: { issues: { path: (string | number)[]; message: string }[] } }): Record<string, string> {
  const errors: Record<string, string> = {};
  if (result.error) {
    for (const issue of result.error.issues) {
      const key = issue.path.join('.');
      if (!errors[key]) errors[key] = issue.message;
    }
  }
  return errors;
}

const NEWS_CATEGORIES = ['announcement', 'achievement', 'event', 'sports', 'academics', 'general'];

export async function saveNewsAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const manager = await requireContentManager();
  if (!manager.ok) return manager.state;

  const headerList = await headers();
  const limit = rateLimit(clientKey(headerList, 'cms-save', manager.actorId), 30, 60_000);
  if (!limit.success) {
    return { status: 'error', message: `Too many requests. Try again in ${limit.retryAfterSeconds}s.` };
  }

  const id = String(formData.get('id') ?? '');
  const title = String(formData.get('title') ?? '').trim();
  const excerpt = String(formData.get('excerpt') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  const category = String(formData.get('category') ?? 'general');
  const coverImageUrl = String(formData.get('coverImageUrl') ?? '').trim();
  const status = String(formData.get('status') ?? 'draft') as ContentStatus;
  const isFeatured = formData.get('isFeatured') === 'on';

  const errors: Record<string, string> = {};
  if (title.length < 5) errors.title = 'Title must be at least 5 characters.';
  if (content.length < 20) errors.content = 'Content must be at least 20 characters.';
  if (!NEWS_CATEGORIES.includes(category)) errors.category = 'Choose a valid category.';
  if (Object.keys(errors).length > 0) {
    return { status: 'error', errors, message: 'Please review the form.' };
  }

  const supabase = await createClient();
  const values = {
    title,
    slug: slugify(title),
    excerpt: excerpt.length > 0 ? excerpt : content.slice(0, 160),
    content,
    category,
    cover_image_url: coverImageUrl.length > 0 ? coverImageUrl : null,
    status,
    is_featured: isFeatured,
    author_id: manager.actorId,
    author_name: manager.actorName,
    published_at: status === 'published' ? new Date().toISOString() : null,
  };

  let error: { message: string } | null;
  if (id) {
    ({ error } = await supabase.from('news').update(values).eq('id', id));
  } else {
    ({ error } = await supabase.from('news').insert({ ...values, views: 0 }));
  }

  if (error) {
    return { status: 'error', message: 'Could not save the article. Please try again.' };
  }

  await recordAudit({
    action: id ? 'News updated' : 'News created',
    category: 'CMS',
    details: `${status === 'published' ? 'Published' : 'Saved'} article: ${title}`,
    actorId: manager.actorId,
    actorName: manager.actorName,
  });

  revalidatePath('/admin/news');
  revalidatePath('/news');
  revalidatePath('/');
  return { status: 'success', message: id ? 'Article updated.' : 'Article created.' };
}

export async function deleteNewsAction(formData: FormData): Promise<void> {
  const manager = await requireContentManager();
  if (!manager.ok) return;

  const id = String(formData.get('id') ?? '');
  if (!id) return;

  const supabase = await createClient();
  await supabase.from('news').delete().eq('id', id);

  await recordAudit({
    action: 'News deleted',
    category: 'CMS',
    details: `Deleted article ${id}`,
    actorId: manager.actorId,
    actorName: manager.actorName,
  });

  revalidatePath('/admin/news');
  revalidatePath('/news');
}

export async function toggleNewsPublishAction(formData: FormData): Promise<void> {
  const manager = await requireContentManager();
  if (!manager.ok) return;

  const id = String(formData.get('id') ?? '');
  const nextStatus = String(formData.get('nextStatus') ?? '') as ContentStatus;
  if (!id || (nextStatus !== 'published' && nextStatus !== 'draft')) return;

  const supabase = await createClient();
  await supabase
    .from('news')
    .update({
      status: nextStatus,
      published_at: nextStatus === 'published' ? new Date().toISOString() : null,
    })
    .eq('id', id);

  await recordAudit({
    action: nextStatus === 'published' ? 'News published' : 'News unpublished',
    category: 'CMS',
    details: `Article ${id}`,
    actorId: manager.actorId,
    actorName: manager.actorName,
  });

  revalidatePath('/admin/news');
  revalidatePath('/news');
}

export async function saveEventAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const manager = await requireContentManager();
  if (!manager.ok) return manager.state;

  const headerList = await headers();
  const limit = rateLimit(clientKey(headerList, 'cms-event', manager.actorId), 30, 60_000);
  if (!limit.success) {
    return { status: 'error', message: `Too many requests. Try again in ${limit.retryAfterSeconds}s.` };
  }

  const id = String(formData.get('id') ?? '');
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const startsAt = String(formData.get('startsAt') ?? '');
  const endsAt = String(formData.get('endsAt') ?? '');
  const location = String(formData.get('location') ?? '').trim();
  const category = String(formData.get('category') ?? 'general');
  const coverImageUrl = String(formData.get('coverImageUrl') ?? '').trim();
  const status = String(formData.get('status') ?? 'published') as ContentStatus;
  const isFeatured = formData.get('isFeatured') === 'on';

  const errors: Record<string, string> = {};
  if (title.length < 5) errors.title = 'Title must be at least 5 characters.';
  if (!startsAt) errors.startsAt = 'Start date/time is required.';
  if (Object.keys(errors).length > 0) {
    return { status: 'error', errors, message: 'Please review the form.' };
  }

  const supabase = await createClient();
  const values = {
    title,
    slug: slugify(title),
    description: description.length > 0 ? description : null,
    starts_at: new Date(startsAt).toISOString(),
    ends_at: endsAt ? new Date(endsAt).toISOString() : null,
    location: location.length > 0 ? location : null,
    category,
    cover_image_url: coverImageUrl.length > 0 ? coverImageUrl : null,
    status,
    is_featured: isFeatured,
    created_by: manager.actorId,
  };

  let error: { message: string } | null;
  if (id) {
    ({ error } = await supabase.from('events').update(values).eq('id', id));
  } else {
    ({ error } = await supabase.from('events').insert(values));
  }

  if (error) {
    return { status: 'error', message: 'Could not save the event. Please try again.' };
  }

  await recordAudit({
    action: id ? 'Event updated' : 'Event created',
    category: 'CMS',
    details: `Event: ${title}`,
    actorId: manager.actorId,
    actorName: manager.actorName,
  });

  revalidatePath('/admin/events');
  revalidatePath('/events');
  revalidatePath('/');
  return { status: 'success', message: id ? 'Event updated.' : 'Event created.' };
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  const manager = await requireContentManager();
  if (!manager.ok) return;

  const id = String(formData.get('id') ?? '');
  if (!id) return;

  const supabase = await createClient();
  await supabase.from('events').delete().eq('id', id);

  await recordAudit({
    action: 'Event deleted',
    category: 'CMS',
    details: `Deleted event ${id}`,
    actorId: manager.actorId,
    actorName: manager.actorName,
  });

  revalidatePath('/admin/events');
  revalidatePath('/events');
}

export async function saveAlbumAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const manager = await requireContentManager();
  if (!manager.ok) return manager.state;

  const headerList = await headers();
  const limit = rateLimit(clientKey(headerList, 'cms-album', manager.actorId), 30, 60_000);
  if (!limit.success) {
    return { status: 'error', message: `Too many requests. Try again in ${limit.retryAfterSeconds}s.` };
  }

  const id = String(formData.get('id') ?? '');
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const category = String(formData.get('category') ?? 'general');
  const coverImageUrl = String(formData.get('coverImageUrl') ?? '').trim();
  const isPublished = formData.get('isPublished') === 'on';

  if (title.length < 3) {
    return { status: 'error', errors: { title: 'Title must be at least 3 characters.' }, message: 'Please review the form.' };
  }

  const supabase = await createClient();
  const values = {
    title,
    slug: slugify(title),
    description: description.length > 0 ? description : null,
    category,
    cover_image_url: coverImageUrl.length > 0 ? coverImageUrl : null,
    is_published: isPublished,
    created_by: manager.actorId,
  };

  let error: { message: string } | null;
  if (id) {
    ({ error } = await supabase.from('gallery_albums').update(values).eq('id', id));
  } else {
    ({ error } = await supabase.from('gallery_albums').insert({ ...values, sort_order: 0 }));
  }

  if (error) {
    return { status: 'error', message: 'Could not save the album. Please try again.' };
  }

  await recordAudit({
    action: id ? 'Gallery album updated' : 'Gallery album created',
    category: 'CMS',
    details: `Album: ${title}`,
    actorId: manager.actorId,
    actorName: manager.actorName,
  });

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  return { status: 'success', message: id ? 'Album updated.' : 'Album created.' };
}

export async function deleteAlbumAction(formData: FormData): Promise<void> {
  const manager = await requireContentManager();
  if (!manager.ok) return;

  const id = String(formData.get('id') ?? '');
  if (!id) return;

  const supabase = await createClient();
  // Images reference the album; remove them first.
  await supabase.from('gallery_images').delete().eq('album_id', id);
  await supabase.from('gallery_albums').delete().eq('id', id);

  await recordAudit({
    action: 'Gallery album deleted',
    category: 'CMS',
    details: `Deleted album ${id}`,
    actorId: manager.actorId,
    actorName: manager.actorName,
  });

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
}

export async function addAlbumImageAction(formData: FormData): Promise<void> {
  const manager = await requireContentManager();
  if (!manager.ok) return;

  const albumId = String(formData.get('albumId') ?? '');
  const imageUrl = String(formData.get('imageUrl') ?? '').trim();
  const caption = String(formData.get('caption') ?? '').trim();
  if (!albumId || !imageUrl) return;

  const supabase = await createClient();
  await supabase.from('gallery_images').insert({
    album_id: albumId,
    image_url: imageUrl,
    caption: caption.length > 0 ? caption : null,
    sort_order: 0,
  });

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
}

export async function deleteAlbumImageAction(formData: FormData): Promise<void> {
  const manager = await requireContentManager();
  if (!manager.ok) return;

  const imageId = String(formData.get('imageId') ?? '');
  if (!imageId) return;

  const supabase = await createClient();
  await supabase.from('gallery_images').delete().eq('id', imageId);

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
}

export async function saveFaqAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const manager = await requireContentManager();
  if (!manager.ok) return manager.state;

  const id = String(formData.get('id') ?? '');
  const question = String(formData.get('question') ?? '').trim();
  const answer = String(formData.get('answer') ?? '').trim();
  const category = String(formData.get('category') ?? 'general') as FaqCategory;
  const isPublished = formData.get('isPublished') === 'on';

  if (question.length < 5 || answer.length < 5) {
    return { status: 'error', message: 'Question and answer must each be at least 5 characters.' };
  }

  const supabase = await createClient();
  const values = { question, answer, category, is_published: isPublished };

  let error: { message: string } | null;
  if (id) {
    ({ error } = await supabase.from('faqs').update(values).eq('id', id));
  } else {
    ({ error } = await supabase.from('faqs').insert({ ...values, sort_order: 0 }));
  }

  if (error) {
    return { status: 'error', message: 'Could not save the FAQ. Please try again.' };
  }

  await recordAudit({
    action: id ? 'FAQ updated' : 'FAQ created',
    category: 'CMS',
    details: question,
    actorId: manager.actorId,
    actorName: manager.actorName,
  });

  revalidatePath('/admin/faqs');
  revalidatePath('/faq');
  return { status: 'success', message: id ? 'FAQ updated.' : 'FAQ created.' };
}

export async function deleteFaqAction(formData: FormData): Promise<void> {
  const manager = await requireContentManager();
  if (!manager.ok) return;

  const id = String(formData.get('id') ?? '');
  if (!id) return;

  const supabase = await createClient();
  await supabase.from('faqs').delete().eq('id', id);

  revalidatePath('/admin/faqs');
  revalidatePath('/faq');
}

export async function savePageAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const manager = await requireContentManager();
  if (!manager.ok) return manager.state;

  const id = String(formData.get('id') ?? '');
  const title = String(formData.get('title') ?? '').trim();
  const slug = slugify(String(formData.get('slug') ?? title));
  const section = String(formData.get('section') ?? 'general');
  const content = String(formData.get('content') ?? '').trim();
  const isPublished = formData.get('isPublished') === 'on';

  if (title.length < 3 || slug.length < 2 || content.length < 10) {
    return { status: 'error', message: 'Title, slug, and content are required.' };
  }

  const supabase = await createClient();
  const values = {
    title,
    slug,
    section,
    content,
    is_published: isPublished,
    updated_by: manager.actorId,
    updated_by_name: manager.actorName,
  };

  let error: { message: string } | null;
  if (id) {
    ({ error } = await supabase.from('pages').update(values).eq('id', id));
  } else {
    ({ error } = await supabase.from('pages').insert(values));
  }

  if (error) {
    return { status: 'error', message: 'Could not save the page. Please try again.' };
  }

  await recordAudit({
    action: id ? 'Page updated' : 'Page created',
    category: 'CMS',
    details: `Page: ${title} (/p/${slug})`,
    actorId: manager.actorId,
    actorName: manager.actorName,
  });

  revalidatePath('/admin/pages');
  return { status: 'success', message: id ? 'Page updated.' : 'Page created.' };
}

export async function deletePageAction(formData: FormData): Promise<void> {
  const manager = await requireContentManager();
  if (!manager.ok) return;

  const id = String(formData.get('id') ?? '');
  if (!id) return;

  const supabase = await createClient();
  await supabase.from('pages').delete().eq('id', id);

  revalidatePath('/admin/pages');
}
