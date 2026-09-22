import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getNewsBySlug, listNews } from '@/lib/data/cms';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return { title: 'Article Not Found | JES' };
  return {
    title: `${article.title} | Jasmine Exclusive School`,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.coverImageUrl ? [article.coverImageUrl] : undefined,
      type: 'article',
    },
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article || article.status !== 'published') notFound();

  const related = (await listNews({ status: 'published', limit: 4 }))
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="space-y-10 text-[var(--text)]">
      <section className="bg-[var(--primary)] text-white py-10 border-b-4 border-[var(--primary-dark)]">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <Link href="/news" className="text-xs font-bold text-amber-300 hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to News
          </Link>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-300">{article.category}</span>
          <h1 className="text-2xl md:text-4xl font-extrabold">{article.title}</h1>
          <p className="text-xs text-slate-300">
            {article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
              : ''}
            {article.authorName ? ` · By ${article.authorName}` : ''}
          </p>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-4 pb-16 space-y-8">
        {article.coverImageUrl && (
          <div className="relative h-72 md:h-96 rounded-lg overflow-hidden border border-[var(--border)]">
            <Image src={article.coverImageUrl} alt={article.title} fill className="object-cover" unoptimized priority />
          </div>
        )}

        {article.excerpt && (
          <p className="text-base font-medium text-[var(--primary-dark)] border-l-2 border-amber-400 pl-4 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        <div className="space-y-4 text-sm leading-relaxed text-[var(--muted-text)] whitespace-pre-line">
          {article.content}
        </div>

        {related.length > 0 && (
          <div className="pt-6 border-t border-[var(--border)] space-y-4">
            <h2 className="text-lg font-bold text-[var(--primary-dark)]">More News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/news/${item.slug}`}
                  className="p-4 bg-white border border-[var(--border)] rounded space-y-1 hover:border-[var(--primary)] transition-colors"
                >
                  <span className="text-[10px] font-bold text-[var(--primary)] capitalize">{item.category}</span>
                  <h3 className="text-sm font-bold text-[var(--text)]">{item.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
