import { notFound } from 'next/navigation';
import { getNewsById } from '@/lib/data/cms';
import NewsForm from '../../NewsForm';

export const metadata = { title: 'Edit Article | JES Admin' };

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getNewsById(id);
  if (!article) notFound();
  return <NewsForm article={article} />;
}
