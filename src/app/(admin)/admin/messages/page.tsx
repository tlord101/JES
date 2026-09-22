'use client';

import { useState } from 'react';

export default function AdminMessagesPage() {
  const [messages] = useState([
    { id: '1', sender: 'Engr. O. Enabulele', email: 'enabulele@example.com', phone: '+234 802 334 5566', subject: 'Inquiry regarding SS 1 Boarding Facilities', date: '2025-02-12', status: 'Unread' },
    { id: '2', sender: 'Mrs. F. Amadasun', email: 'amadasun@example.com', phone: '+234 805 112 3344', subject: 'Primary 4 Admission Syllabus Request', date: '2025-02-10', status: 'Read' },
  ]);

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Incoming Contact Messages</h1>
        <p className="text-xs text-[var(--muted-text)]">
          Review public website contact form submissions and prospective parent inquiries.
        </p>
      </div>

      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-sm text-[var(--primary-dark)]">{m.sender}</span>
                <span className="text-[11px] text-[var(--muted-text)] block font-mono">{m.email} • {m.phone}</span>
              </div>
              <span className={`px-2 py-0.5 font-bold text-[10px] rounded ${m.status === 'Unread' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'}`}>
                {m.status}
              </span>
            </div>
            <div className="font-bold text-[var(--text)] pt-1">{m.subject}</div>
            <div className="text-[10px] text-slate-400 font-mono">Received: {m.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
