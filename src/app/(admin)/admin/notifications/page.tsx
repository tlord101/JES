'use client';

import { useState } from 'react';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Second Term PTA Assembly Reminder', target: 'All Parents', date: '2025-02-12', status: 'Sent' },
  ]);

  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('All Parents');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const newNotif = {
      id: `${Date.now()}`,
      title,
      target,
      date: new Date().toISOString().substring(0, 10),
      status: 'Sent',
    };
    setNotifications([newNotif, ...notifications]);
    logAuditEvent('Broadcast Notification Sent', 'System', `Dispatched broadcast "${title}" to target group ${target}`);
    setTitle('');
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">System Notifications & Broadcast Center</h1>
        <p className="text-xs text-[var(--muted-text)]">
          Send instant email and portal alerts to parents, staff, or students.
        </p>
      </div>

      <form onSubmit={handleSend} className="bg-white p-6 border border-[var(--border)] rounded space-y-3">
        <h2 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">
          Compose Broadcast Message
        </h2>
        <div>
          <label className="block font-semibold mb-1">Target Audience</label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full p-2 border border-[var(--border)] rounded font-bold"
          >
            <option value="All Parents">All Registered Parents</option>
            <option value="All Staff">All Academic & Admin Staff</option>
            <option value="All Students">All Secondary Students</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Alert Headline / Subject *</label>
          <input
            type="text"
            required
            placeholder="e.g. Emergency Weather Closure Notice"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-[var(--border)] rounded"
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-5 py-2 bg-[var(--primary)] text-white font-bold rounded">
            Dispatch Broadcast
          </button>
        </div>
      </form>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <div className="p-4 font-bold text-sm text-[var(--primary-dark)] border-b border-[var(--border)]">
          Recent Broadcast History
        </div>
        <div className="divide-y divide-[var(--border)]">
          {notifications.map((n) => (
            <div key={n.id} className="p-4 flex justify-between items-center hover:bg-[var(--soft-bg)]">
              <div>
                <div className="font-bold text-[var(--text)]">{n.title}</div>
                <div className="text-[11px] text-[var(--muted-text)]">Target: {n.target} • Sent on {n.date}</div>
              </div>
              <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold text-[10px] rounded">
                {n.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
