import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import EventForm from '../../EventForm';
import type { EventItem } from '@/lib/data/cms';
import type { EventRow } from '@/types/database';

export const metadata = { title: 'Edit Event | JES Admin' };

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data } = await supabase.from('events').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();

  const row = data as EventRow;
  const event: EventItem = {
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

  return <EventForm event={event} />;
}
