import Link from 'next/link';
import { listNews } from '@/lib/data/cms';
import { deleteNewsAction, toggleNewsPublishAction } from '@/lib/cms/actions';

export const metadata = { title: 'News CMS | JES Admin' };

export default async function AdminNewsPage() {
  const articles = await listNews();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">News &amp; Press CMS</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Create, publish, edit, and categorize official school news articles and media releases.
          </p>
        </div>
        <Link
          href="/admin/news/create"
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-journal-plus"></i>
          <span>New Article</span>
        </Link>
      </div>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        {articles.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <i className="bi bi-newspaper text-3xl text-[var(--muted-text)]"></i>
            <p className="text-xs font-bold text-[var(--primary-dark)]">No articles yet</p>
            <p className="text-xs text-[var(--muted-text)]">Publish the first school news article.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[var(--soft-bg)] text-left">
                <tr>
                  <th className="p-3 font-bold text-[var(--primary-dark)]">Article</th>
                  <th className="p-3 font-bold text-[var(--primary-dark)]">Category</th>
                  <th className="p-3 font-bold text-[var(--primary-dark)]">Status</th>
                  <th className="p-3 font-bold text-[var(--primary-dark)]">Published</th>
                  <th className="p-3 font-bold text-[var(--primary-dark)]">Views</th>
                  <th className="p-3 font-bold text-[var(--primary-dark)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.id} className="border-t border-[var(--border)] hover:bg-[var(--soft-bg)]">
                    <td className="p-3">
                      <div className="font-bold text-[var(--primary-dark)]">{a.title}</div>
                      <div className="text-[11px] text-[var(--muted-text)]">/news/{a.slug}</div>
                    </td>
                    <td className="p-3 capitalize">{a.category}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded font-bold text-[10px] ${
                          a.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {a.status}
                      </span>
                      {a.isFeatured && (
                        <span className="ml-1 px-2 py-1 bg-[var(--primary-light)] text-[var(--primary-dark)] rounded font-bold text-[10px]">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-[var(--muted-text)] font-mono text-[11px]">
                      {a.publishedAt ? a.publishedAt.substring(0, 10) : '—'}
                    </td>
                    <td className="p-3 text-[var(--muted-text)]">{a.views}</td>
                    <td className="p-3 text-right space-x-2">
                      <form action={toggleNewsPublishAction} className="inline">
                        <input type="hidden" name="id" value={a.id} />
                        <input
                          type="hidden"
                          name="nextStatus"
                          value={a.status === 'published' ? 'draft' : 'published'}
                        />
                        <button
                          type="submit"
                          className="text-[11px] font-bold text-[var(--primary)] hover:underline"
                        >
                          {a.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                      </form>
                      <Link
                        href={`/admin/news/${a.id}/edit`}
                        className="text-[11px] font-bold text-[var(--primary)] hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={deleteNewsAction} className="inline">
                        <input type="hidden" name="id" value={a.id} />
                        <button
                          type="submit"
                          className="text-[11px] font-bold text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
