import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { newsArticles } from '@/data/news';

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = newsArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase bg-[var(--primary-light)] text-[var(--primary)] px-2.5 py-0.5 rounded">
              {article.category}
            </span>
            <span className="text-xs text-[var(--muted-text)]">• {article.date}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--primary-dark)] leading-tight">{article.title}</h1>
          <p className="text-xs text-[var(--muted-text)]">Published by <strong>{article.author}</strong></p>
        </div>

        <div className="relative h-72 md:h-96 w-full rounded overflow-hidden border border-[var(--border)]">
          <Image src={article.image} alt={article.title} fill className="object-cover" />
        </div>

        <div className="prose text-sm text-[var(--text)] leading-relaxed space-y-4 whitespace-pre-line">
          {article.content}
        </div>

        <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
          <Link href="/news" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to All News
          </Link>
        </div>
      </div>
    </div>
  );
}
