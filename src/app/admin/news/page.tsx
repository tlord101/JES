'use client';

import { useState } from 'react';
import Link from 'next/link';
import { newsCMSStore, NewsArticle } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([...newsCMSStore]);
  const [search, setSearch] = useState('');

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    const idx = newsCMSStore.findIndex((a) => a.id === id);
    if (idx !== -1) {
      const removed = newsCMSStore.splice(idx, 1)[0];
      setArticles([...newsCMSStore]);
      logAuditEvent('News Deleted', 'CMS', `Deleted news article "${removed.title}"`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">News & Press CMS</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Create, publish, edit, and categorize official school news articles and media releases.
          </p>
        </div>
        <Link
          href="/admin/news/create"
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-journal-plus"></i>
          <span>Create News Article</span>
        </Link>
      </div>

      <div className="bg-white p-4 border border-[var(--border)] rounded flex items-center text-xs">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search news by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
          />
          <i className="bi bi-search absolute left-2.5 top-2.5 text-[var(--muted-text)]"></i>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((a) => (
          <div key={a.id} className="bg-white p-5 border border-[var(--border)] rounded flex flex-col md:flex-row gap-4 text-xs">
            {a.featuredImage && (
              <img
                src={a.featuredImage}
                alt={a.title}
                className="w-full md:w-40 h-28 object-cover rounded border border-[var(--border)] flex-shrink-0"
              />
            )}
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold text-[10px] rounded">
                      {a.category}
                    </span>
                    <span className="text-[11px] text-[var(--muted-text)]">• {a.publishDate}</span>
                  </div>
                  <h3 className="font-bold text-sm text-[var(--primary-dark)] mt-1">{a.title}</h3>
                </div>
                <span
                  className={`px-2 py-0.5 font-bold text-[10px] rounded ${
                    a.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {a.status}
                </span>
              </div>
              <p className="text-[var(--muted-text)] line-clamp-2">{a.excerpt}</p>
              <div className="pt-2 flex justify-between items-center text-[11px] text-slate-500">
                <span>Author: {a.author}</span>
                <div className="space-x-2">
                  <Link
                    href={`/admin/news/${a.id}/edit`}
                    className="px-3 py-1 bg-white border border-[var(--border)] text-[var(--text)] font-bold rounded hover:bg-[var(--soft-bg)]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="px-3 py-1 bg-red-600 text-white font-bold rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
