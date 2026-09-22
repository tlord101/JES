'use client';

import { useState } from 'react';
import { sessionsStore, AcademicSession } from '@/lib/academicStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminAcademicSessionsPage() {
  const [sessions, setSessions] = useState<AcademicSession[]>([...sessionsStore]);
  const [showModal, setShowModal] = useState(false);

  const [sessionName, setSessionName] = useState('');
  const [startDate, setStartDate] = useState('2026-09-07');
  const [endDate, setEndDate] = useState('2027-07-24');

  const handleSetCurrent = (id: string) => {
    sessions.forEach((s) => {
      s.isCurrent = s.id === id;
    });
    setSessions([...sessions]);
    const active = sessions.find((s) => s.id === id);
    logAuditEvent('Active Academic Session Set', 'System', `Set current active academic session to ${active?.sessionName}`);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionName) return;

    const newSession: AcademicSession = {
      id: `sess_${Date.now()}`,
      sessionName,
      isCurrent: false,
      startDate,
      endDate,
    };

    sessionsStore.push(newSession);
    setSessions([...sessionsStore]);
    logAuditEvent('Academic Session Created', 'System', `Created academic session ${sessionName}`);

    setSessionName('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Academic Sessions Directory</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Configure school calendar sessions (e.g. 2024/2025, 2025/2026), set active session state, and define term dates.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-calendar-plus-fill"></i>
          <span>Create New Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((s) => (
          <div key={s.id} className="bg-white p-5 border border-[var(--border)] rounded space-y-3">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <span className="font-bold text-base text-[var(--primary-dark)]">{s.sessionName}</span>
              <span
                className={`px-2.5 py-1 text-[10px] font-bold rounded ${
                  s.isCurrent ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {s.isCurrent ? 'Active Current Session' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-1 text-slate-600">
              <div>
                <span className="font-semibold text-[var(--text)]">Session Start:</span> {s.startDate}
              </div>
              <div>
                <span className="font-semibold text-[var(--text)]">Session End:</span> {s.endDate}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              {!s.isCurrent && (
                <button
                  onClick={() => handleSetCurrent(s.id)}
                  className="px-3 py-1 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)]"
                >
                  Set as Active Current Session
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 border border-[var(--border)] rounded max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <h2 className="text-base font-bold text-[var(--primary-dark)]">Create Academic Session</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Session Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026/2027"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-[var(--border)] rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border border-[var(--border)] rounded font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[var(--border)] font-bold rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded">
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
