'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { newsCMSStore } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const newsId = resolvedParams.id;

  const article = newsCMSStore.find((a) => a.id === newsId) || newsCMSStore[0];

  const [title, setTitle] = useState(article.title);
  const [slug, setSlug] = useState(article.slug);
  const [category, setCategory] = useState(article.category);
  const [author, setAuthor] = useState(article.author);
  const [featuredImage, setFeaturedImage] = useState(article.featuredImage);
  const [excerpt, setExcerpt] = useState(article.excerpt);
  const [content, setContent] = useState(article.content);
  const [status, setStatus] = useState(article.status);
  const [msg, setMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    article.title = title;
    article.slug = slug;
    article.category = category;
    article.author = author;
    article.featuredImage = featuredImage;
    article.excerpt = excerpt;
    article.content = content;
    article.status = status as any;

    logAuditEvent('News Updated', 'CMS', `Updated news article "${title}"`);
    setMsg('News article saved successfully!');
    setTimeout(() => {
      router.push('/admin/news');
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex justify-between items-center">
        <div>
          <Link href="/admin/news" className="font-bold text-[var(--primary)] hover:underline">
            ← Back to News List
          </Link>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">Edit News Article</h1>
        </div>
      </div>

      {msg && <div className="p-3 bg-green-50 border border-green-200 text-green-800 font-bold rounded">{msg}</div>}

      <form onSubmit={handleSave} className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
        <div>
          <label className="block font-semibold mb-1">Article Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            Save Article
          </button>
        </div>
      </form>
    </div>
  );
}
