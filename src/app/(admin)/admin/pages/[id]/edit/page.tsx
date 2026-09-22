import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { PageRow } from '@/types/database';
import type { CmsPage } from '@/lib/data/cms';
import PageForm from '../../PageForm';

export const metadata = { title: 'Edit Page | JES Admin' };

export default async function EditPageCmsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data } = await supabase.from('pages').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();

  const row = data as PageRow;
  const page: CmsPage = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    section: row.section,
    content: row.content,
    isPublished: row.is_published,
    updatedAt: row.updated_at,
  };

  return <PageForm page={page} />;
}
