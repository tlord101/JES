'use client';

import { useState } from 'react';
import Link from 'next/link';
import { eventsCMSStore, EventItem } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([...eventsCMSStore]);

  const handleDelete = (id: string) => {
    const idx = eventsCMSStore.findIndex((e) => e.id === id);
    if (idx !== -1) {
      const removed = eventsCMSStore.splice(idx, 1)[0];
      setEvents([...eventsCMSStore]);
      logAuditEvent('Event Deleted', 'CMS', `Deleted school event "${removed.title}"`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">School Events CMS</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Manage upcoming institutional events, science fairs, sports festivals, and PTA assemblies.
          </p>
        </div>
        <Link
          href="/admin/events/create"
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-calendar-plus"></i>
          <span>Create New Event</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((evt) => (
          <div key={evt.id} className="bg-white p-5 border border-[var(--border)] rounded flex flex-col justify-between space-y-3 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold text-[10px] rounded">
                  {evt.category}
                </span>
                <span className="font-mono font-bold text-[var(--primary-dark)]">{evt.date}</span>
              </div>
              <h3 className="font-bold text-sm text-[var(--primary-dark)]">{evt.title}</h3>
              <div className="text-[var(--muted-text)]">Time: {evt.time}</div>
              <div className="text-[var(--muted-text)]">Location: {evt.location}</div>
              <p className="text-slate-600 leading-relaxed">{evt.description}</p>
            </div>

            <div className="pt-2 border-t border-[var(--border)] flex justify-end gap-2">
              <Link
                href={`/admin/events/${evt.id}/edit`}
                className="px-3 py-1 bg-white border border-[var(--border)] text-[var(--text)] font-bold rounded hover:bg-[var(--soft-bg)]"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(evt.id)}
                className="px-3 py-1 bg-red-600 text-white font-bold rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
