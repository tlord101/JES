'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { pagesCMSStore, PageContent } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function CreatePageCMS() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [section, setSection] = useState<'Homepage' | 'About' | 'Admissions' | 'Academics' | 'Contact' | 'Policy'>('About');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return;

    const newPg: PageContent = {
      id: `pg_${Date.now()}`,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      title,
      section,
      content,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin',
    };

    pagesCMSStore.push(newPg);
    logAuditEvent('CMS Page Created', 'CMS', `Created new CMS content section "${title}" (/${newPg.slug})`);
    router.push('/admin/pages');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex justify-between items-center">
        <div>
          <Link href="/admin/pages" className="font-bold text-[var(--primary)] hover:underline">
            ← Back to Pages List
          </Link>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">Create Web Page Section</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
        <div>
          <label className="block font-semibold mb-1">Section Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Vision Statement"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-[var(--border)] rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Route Slug *</label>
            <input
              type="text"
              required
              placeholder="e.g. vision"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded font-mono"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Website Category</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value as any)}
              className="w-full p-2 border border-[var(--border)] rounded font-bold"
            >
              <option value="Homepage">Homepage</option>
              <option value="About">About</option>
              <option value="Admissions">Admissions</option>
              <option value="Academics">Academics</option>
              <option value="Contact">Contact</option>
              <option value="Policy">Policy</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Page Body Content / Copy</label>
          <textarea
            rows={8}
            required
            placeholder="Enter public website text..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-[var(--border)] rounded font-sans"
          ></textarea>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Link href="/admin/pages" className="px-4 py-2 border border-[var(--border)] font-bold rounded">
            Cancel
          </Link>
          <button type="submit" className="px-5 py-2 bg-[var(--primary)] text-white font-bold rounded">
            Publish Page Section
          </button>
        </div>
      </form>
    </div>
  );
}
