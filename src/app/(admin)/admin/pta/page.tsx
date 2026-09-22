'use client';

import { useState } from 'react';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminPTAPage() {
  const [newsList, setNewsList] = useState([
    { id: '1', title: 'PTA Exco Resolutions on Campus Bus Acquisition', date: '2025-01-18', status: 'Published' },
    { id: '2', title: 'Voluntary Teacher Appreciation Endowment Fund', date: '2024-11-20', status: 'Published' },
  ]);

  const [title, setTitle] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const newItem = {
      id: `${Date.now()}`,
      title,
      date: new Date().toISOString().substring(0, 10),
      status: 'Published',
    };
    setNewsList([newItem, ...newsList]);
    logAuditEvent('PTA Circular Published', 'CMS', `Published PTA news circular "${title}"`);
    setTitle('');
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">PTA Management & Circulars</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Publish Parent-Teacher Association announcements, executive committee notices, and general assembly agendas.
          </p>
        </div>
      </div>

      <form onSubmit={handleAdd} className="bg-white p-6 border border-[var(--border)] rounded space-y-3">
        <h2 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">
          Publish New PTA Circular
        </h2>
        <div>
          <label className="block font-semibold mb-1">Notice / Circular Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Second Term General Assembly Agenda & Financial Report"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-[var(--border)] rounded"
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded">
            Post PTA Circular
          </button>
        </div>
      </form>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <div className="p-4 font-bold text-sm text-[var(--primary-dark)] border-b border-[var(--border)]">
          Recent PTA Bulletins
        </div>
        <div className="divide-y divide-[var(--border)]">
          {newsList.map((item) => (
            <div key={item.id} className="p-4 flex justify-between items-center hover:bg-[var(--soft-bg)]">
              <div>
                <div className="font-bold text-[var(--text)]">{item.title}</div>
                <div className="text-[11px] text-[var(--muted-text)] font-mono">Date Published: {item.date}</div>
              </div>
              <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold text-[10px] rounded">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
