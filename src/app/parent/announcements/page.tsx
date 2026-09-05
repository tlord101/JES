'use client';

import { defaultAnnouncements } from '@/lib/parentData';

export default function ParentAnnouncementsPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold rounded">
            Parent Notices
          </span>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
            School Circulars & Parent Bulletin
          </h1>
          <p className="text-xs text-[var(--muted-text)]">
            Official announcements, school resumption notices, and executive circulars.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {defaultAnnouncements.map((anc) => (
          <div key={anc.id} className="bg-white p-6 border border-[var(--border)] rounded space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold text-[10px] rounded">
                {anc.category}
              </span>
              <span className="text-[var(--muted-text)]">Date: {anc.date} • Issued by: {anc.author}</span>
            </div>

            <h2 className="text-base font-extrabold text-[var(--primary-dark)]">{anc.title}</h2>
            <p className="text-xs text-[var(--text)] leading-relaxed bg-[var(--soft-bg)] p-3 border border-[var(--border)] rounded">
              {anc.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
