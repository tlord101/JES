'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { newsCMSStore, NewsArticle } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function CreateNewsPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Academics');
  const [author, setAuthor] = useState('Editorial Desk');
  const [featuredImage, setFeaturedImage] = useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Published'>('Published');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newNews: NewsArticle = {
      id: `news_${Date.now()}`,
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      category,
      author,
      featuredImage,
      excerpt,
      content,
      publishDate: new Date().toISOString().substring(0, 10),
      status,
    };

    newsCMSStore.push(newNews);
    logAuditEvent('News Created', 'CMS', `Created news article "${title}" status ${status}`);
    router.push('/admin/news');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex justify-between items-center">
        <div>
          <Link href="/admin/news" className="font-bold text-[var(--primary)] hover:underline">
            ← Back to News List
          </Link>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">Compose News Article</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
        <div>
          <label className="block font-semibold mb-1">Article Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Jasmine Students Achieve Top Honors in WAEC 2024"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
            }}
            className="w-full p-2 border border-[var(--border)] rounded"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded font-mono"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded font-bold"
            >
              <option value="Academics">Academics</option>
              <option value="Sports">Sports</option>
              <option value="Culture">Culture</option>
              <option value="Announcements">Announcements</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Publication Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full p-2 border border-[var(--border)] rounded font-bold"
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Author Name</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Featured Image URL</label>
            <input
              type="text"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Short Excerpt *</label>
          <textarea
            rows={2}
            required
            placeholder="Brief 1-2 sentence summary..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full p-2 border border-[var(--border)] rounded"
          ></textarea>
        </div>

        <div>
          <label className="block font-semibold mb-1">Full Article Body *</label>
          <textarea
            rows={8}
            required
            placeholder="Enter full news content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-[var(--border)] rounded"
          ></textarea>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Link href="/admin/news" className="px-4 py-2 border border-[var(--border)] font-bold rounded">
            Cancel
          </Link>
          <button type="submit" className="px-5 py-2 bg-[var(--primary)] text-white font-bold rounded">
            Publish News Article
          </button>
        </div>
      </form>
    </div>
  );
}
