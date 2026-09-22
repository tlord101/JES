import Link from 'next/link';
import Image from 'next/image';
import { listNews } from '@/lib/data/cms';

export const metadata = {
  title: 'News & Press Releases | Jasmine Exclusive School',
  description: 'Latest news, achievements, and announcements from Jasmine Exclusive School, Benin City.',
};

const CATEGORIES = ['all', 'announcement', 'achievement', 'event', 'sports', 'academics', 'general'];

type SearchParams = Promise<{ cat?: string }>;

export default async function NewsPage({ searchParams }: { searchParams: SearchParams }) {
  const { cat } = await searchParams;
  const category = cat && CATEGORIES.includes(cat) ? cat : 'all';

  const articles = await listNews({
    status: 'published',
    category: category === 'all' ? undefined : category,
  });
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="space-y-10 text-[var(--text)]">
      <section className="bg-[var(--primary)] text-white py-12 border-b-4 border-[var(--primary-dark)]">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold">News &amp; Press Releases</h1>
          <p className="text-sm text-slate-200 max-w-2xl">
            Stay informed with the latest happenings, achievements, and official announcements from
            Jasmine Exclusive School.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16 space-y-8">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={c === 'all' ? '/news' : `/news?cat=${c}`}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize border transition-colors ${
                category === c
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-white text-[var(--text)] border-[var(--border)] hover:border-[var(--primary)]'
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {articles.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[var(--border)] rounded space-y-2">
            <i className="bi bi-newspaper text-3xl text-[var(--muted-text)]"></i>
            <p className="text-sm font-bold text-[var(--primary-dark)]">No articles published yet</p>
            <p className="text-xs text-[var(--muted-text)]">Check back soon for school updates.</p>
          </div>
        ) : (
          <>
            {/* Featured article */}
            {featured && (
              <Link
                href={`/news/${featured.slug}`}
                className="group block bg-white border border-[var(--border)] rounded overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-64 md:h-full min-h-64">
                    {featured.coverImageUrl ? (
                      <Image src={featured.coverImageUrl} alt={featured.title} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-[var(--soft-bg)]">
                        <i className="bi bi-newspaper text-4xl text-[var(--muted-text)]"></i>
                      </div>
                    )}
                  </div>
                  <div className="p-6 md:p-8 space-y-3 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold rounded capitalize">
                        {featured.category}
                      </span>
                      <span className="text-[var(--muted-text)]">
                        {featured.publishedAt
                          ? new Date(featured.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                          : ''}
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-[var(--primary-dark)] group-hover:text-[var(--primary)]">
                      {featured.title}
                    </h2>
                    <p className="text-sm text-[var(--muted-text)] leading-relaxed">{featured.excerpt}</p>
                    <span className="text-xs font-bold text-[var(--primary)] inline-flex items-center gap-1">
                      Read Full Story <i className="bi bi-arrow-right"></i>
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Remaining articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((article) => (
                <div key={article.slug} className="bg-white border border-[var(--border)] rounded overflow-hidden flex flex-col">
                  <div className="relative h-44">
                    {article.coverImageUrl ? (
                      <Image src={article.coverImageUrl} alt={article.title} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-[var(--soft-bg)]">
                        <i className="bi bi-newspaper text-3xl text-[var(--muted-text)]"></i>
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-2 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-800 font-bold rounded capitalize">{article.category}</span>
                      <span className="text-slate-400">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                          : ''}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[var(--text)]">
                      <Link href={`/news/${article.slug}`} className="hover:text-[var(--primary)]">
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-[var(--muted-text)] line-clamp-3 leading-relaxed">{article.excerpt}</p>
                    <Link
                      href={`/news/${article.slug}`}
                      className="mt-auto pt-2 text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
                    >
                      Read More <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
