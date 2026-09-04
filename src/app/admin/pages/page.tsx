'use client';

import { useState } from 'react';
import Link from 'next/link';
import { pagesCMSStore, PageContent } from '@/lib/cmsStore';

export default function AdminPagesCMS() {
  const [pages] = useState<PageContent[]>([...pagesCMSStore]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Website Pages CMS</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Manage static public website copy, hero announcements, mission statements, and principal addresses.
          </p>
        </div>
        <Link
          href="/admin/pages/create"
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-file-earmark-plus"></i>
          <span>Create New Page Section</span>
        </Link>
      </div>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold">
              <th className="p-3">Page / Section Title</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Website Category</th>
              <th className="p-3">Last Updated</th>
              <th className="p-3">Updated By</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {pages.map((p) => (
              <tr key={p.id} className="hover:bg-[var(--soft-bg)] transition-colors">
                <td className="p-3 font-bold text-[var(--primary-dark)]">{p.title}</td>
                <td className="p-3 font-mono text-[var(--muted-text)]">/{p.slug}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold text-[10px] rounded">
                    {p.section}
                  </span>
                </td>
                <td className="p-3 text-[var(--muted-text)]">{p.updatedAt.substring(0, 10)}</td>
                <td className="p-3 font-medium text-[var(--text)]">{p.updatedBy}</td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/pages/${p.id}/edit`}
                    className="px-2.5 py-1 bg-white border border-[var(--border)] text-[var(--text)] font-bold rounded hover:bg-[var(--soft-bg)]"
                  >
                    Edit Content
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
