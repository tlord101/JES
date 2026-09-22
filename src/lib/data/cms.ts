import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import type {
  NewsRow,
  EventRow,
  GalleryAlbumRow,
  FaqRow,
  PageRow,
  AnnouncementRow,
  ContentStatus,
  FaqCategory,
  AnnouncementAudience,
} from '@/types/database';

export type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: AnnouncementAudience;
  priority: string;
  isPublished: boolean;
  publishAt: string;
  expiresAt: string | null;
  authorName: string | null;
};

// ---------------------------------------------------------------------------
// Mapping helpers (DB rows -> view models used by pages)
// ---------------------------------------------------------------------------

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  category: string;
  authorName: string | null;
  status: ContentStatus;
  isFeatured: boolean;
  views: number;
  publishedAt: string | null;
  createdAt: string;
};

export type EventItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  location: string | null;
  coverImageUrl: string | null;
  category: string;
  status: ContentStatus;
  isFeatured: boolean;
};

export type GalleryAlbum = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  category: string;
  isPublished: boolean;
  sortOrder: number;
  imageCount: number;
};

function mapNews(row: NewsRow): NewsItem {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImageUrl: row.cover_image_url,
    category: row.category,
    authorName: row.author_name,
    status: row.status,
    isFeatured: row.is_featured,
    views: row.views,
    publishedAt: row.published_at,
    createdAt: row.created_at,
  };
}

function mapEvent(row: EventRow): EventItem {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    location: row.location,
    coverImageUrl: row.cover_image_url,
    category: row.category,
    status: row.status,
    isFeatured: row.is_featured,
  };
}

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

export async function listNews(options?: {
  status?: ContentStatus;
  category?: string;
  featuredOnly?: boolean;
  limit?: number;
  search?: string;
}): Promise<NewsItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false, nullsFirst: false });

  if (options?.status) query = query.eq('status', options.status);
  if (options?.category) query = query.eq('category', options.category);
  if (options?.featuredOnly) query = query.eq('is_featured', true);
  if (options?.search) query = query.ilike('title', `%${options.search}%`);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error || !data) return [];
  return (data as NewsRow[]).map(mapNews);
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('news').select('*').eq('slug', slug).maybeSingle();
  return data ? mapNews(data as NewsRow) : null;
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('news').select('*').eq('id', id).maybeSingle();
  return data ? mapNews(data as NewsRow) : null;
}

export const getPublishedNews = cache(async (limit?: number) =>
  listNews({ status: 'published', limit })
);

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export async function listEvents(options?: {
  status?: ContentStatus;
  upcomingOnly?: boolean;
  limit?: number;
}): Promise<EventItem[]> {
  const supabase = await createClient();
  let query = supabase.from('events').select('*').order('starts_at', { ascending: true });

  if (options?.status) query = query.eq('status', options.status);
  if (options?.upcomingOnly) query = query.gte('starts_at', new Date().toISOString());
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error || !data) return [];
  return (data as EventRow[]).map(mapEvent);
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('events').select('*').eq('slug', slug).maybeSingle();
  return data ? mapEvent(data as EventRow) : null;
}

export const getUpcomingEvents = cache(async (limit?: number) =>
  listEvents({ status: 'published', upcomingOnly: true, limit })
);

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

export async function listGalleryAlbums(options?: {
  publishedOnly?: boolean;
  limit?: number;
}): Promise<GalleryAlbum[]> {
  const supabase = await createClient();
  let query = supabase
    .from('gallery_albums')
    .select('*, gallery_images(count)')
    .order('sort_order', { ascending: true });

  if (options?.publishedOnly) query = query.eq('is_published', true);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error || !data) return [];
    return (data as unknown as (GalleryAlbumRow & { gallery_images: { count: number }[] })[]).map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    coverImageUrl: row.cover_image_url,
    category: row.category,
    isPublished: row.is_published,
    sortOrder: row.sort_order,
    imageCount: row.gallery_images?.[0]?.count ?? 0,
  }));
}

export async function getAlbumBySlug(
  slug: string
): Promise<{
  album: GalleryAlbum;
  images: { id: string; imageUrl: string; caption: string | null }[];
} | null> {
  const supabase = await createClient();
  const { data: album } = await supabase
    .from('gallery_albums')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (!album) return null;

  const { data: images } = await supabase
    .from('gallery_images')
    .select('id, image_url, caption')
    .eq('album_id', album.id)
    .order('sort_order', { ascending: true });

  const row = album as GalleryAlbumRow;
  return {
    album: {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      coverImageUrl: row.cover_image_url,
      category: row.category,
      isPublished: row.is_published,
      sortOrder: row.sort_order,
      imageCount: images?.length ?? 0,
    },
    images: (images ?? []).map((img) => ({
      id: img.id,
      imageUrl: img.image_url,
      caption: img.caption,
    })),
  };
}

export async function getFeaturedGalleryImages(
  limit = 6
): Promise<
  { id: string; imageUrl: string; caption: string | null; albumTitle: string | null }[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('gallery_images')
    .select('id, image_url, caption, gallery_albums(title, is_published)')
    .order('created_at', { ascending: false })
    .limit(limit * 4);

  if (!data) return [];
  return (
    data as unknown as {
      id: string;
      image_url: string;
      caption: string | null;
      gallery_albums: { title: string; is_published: boolean } | null;
    }[]
  )
    .filter((row) => row.gallery_albums?.is_published !== false)
    .slice(0, limit)
    .map((row) => ({
      id: row.id,
      imageUrl: row.image_url,
      caption: row.caption,
      albumTitle: row.gallery_albums?.title ?? null,
    }));
}

// ---------------------------------------------------------------------------
// FAQs / Editable pages / Announcements
// ---------------------------------------------------------------------------

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isPublished: boolean;
};

export type CmsPage = {
  id: string;
  slug: string;
  title: string;
  section: string;
  content: string;
  isPublished: boolean;
  updatedAt: string;
};

export async function listFaqs(options?: {
  publishedOnly?: boolean;
  category?: string;
}): Promise<Faq[]> {
  const supabase = await createClient();
  let query = supabase.from('faqs').select('*').order('sort_order', { ascending: true });
  if (options?.publishedOnly) query = query.eq('is_published', true);
  if (options?.category) query = query.eq('category', options.category as FaqCategory);
  const { data, error } = await query;
  if (error || !data) return [];
  return (data as FaqRow[]).map((row) => ({
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
  }));
}

export async function listPages(options?: {
  publishedOnly?: boolean;
  section?: string;
}): Promise<CmsPage[]> {
  const supabase = await createClient();
  let query = supabase.from('pages').select('*').order('updated_at', { ascending: false });
  if (options?.publishedOnly) query = query.eq('is_published', true);
  if (options?.section) query = query.eq('section', options.section);
  const { data, error } = await query;
  if (error || !data) return [];
  return (data as PageRow[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    section: row.section,
    content: row.content,
    isPublished: row.is_published,
    updatedAt: row.updated_at,
  }));
}

export async function getPageBySlug(slug: string): Promise<CmsPage | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('pages').select('*').eq('slug', slug).maybeSingle();
  if (!data) return null;
  const row = data as PageRow;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    section: row.section,
    content: row.content,
    isPublished: row.is_published,
    updatedAt: row.updated_at,
  };
}

export async function listAnnouncements(options?: {
  publishedOnly?: boolean;
  audience?: AnnouncementAudience;
  limit?: number;
}): Promise<Announcement[]> {
  const supabase = await createClient();
  let query = supabase.from('announcements').select('*').order('publish_at', { ascending: false });
  if (options?.publishedOnly) query = query.eq('is_published', true);
  if (options?.audience) query = query.in('audience', [options.audience, 'everyone']);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error || !data) return [];
  return (data as AnnouncementRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    audience: row.audience,
    priority: row.priority,
    isPublished: row.is_published,
    publishAt: row.publish_at,
    expiresAt: row.expires_at,
    authorName: row.author_name,
  }));
}
