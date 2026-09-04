'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { pagesCMSStore } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function EditPageCMS({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const pageId = resolvedParams.id;

  const pageItem = pagesCMSStore.find((p) => p.id === pageId) || pagesCMSStore[0];

  const [title, setTitle] = useState(pageItem.title);
  const [slug, setSlug] = useState(pageItem.slug);
  const [section, setSection] = useState(pageItem.section);
  const [content, setContent] = useState(pageItem.content);
  const [msg, setMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    pageItem.title = title;
    pageItem.slug = slug;
    pageItem.section = section;
    pageItem.content = content;
    pageItem.updatedAt = new Date().toISOString();

    logAuditEvent('CMS Page Updated', 'CMS', `Updated public website page section "${title}"`);
    setMsg('Page updated successfully!');
    setTimeout(() => {
      router.push('/admin/pages');
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex justify-between items-center">
        <div>
          <Link href="/admin/pages" className="font-bold text-[var(--primary)] hover:underline">
            ← Back to Pages List
          </Link>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">Edit Web Page Section</h1>
        </div>
      </div>

      {msg && <div className="p-3 bg-green-50 border border-green-200 text-green-800 font-bold rounded">{msg}</div>}

      <form onSubmit={handleSave} className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
        <div>
          <label className="block font-semibold mb-1">Section Title *</label>
          <input
            type="text"
            required
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
            Save Page Content
          </button>
        </div>
      </form>
    </div>
  );
}
