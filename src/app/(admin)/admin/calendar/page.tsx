'use client';

import { useState } from 'react';
import { logAuditEvent } from '@/lib/auditStore';

interface CalendarTermEntry {
  id: string;
  term: string;
  resumptionDate: string;
  vacationDate: string;
  examsStart: string;
  sportsDay: string;
  ptaMeeting: string;
}

const INITIAL_CALENDAR: CalendarTermEntry[] = [
  {
    id: 'cal_t1',
    term: 'First Term (2024/2025)',
    resumptionDate: '2024-09-09',
    vacationDate: '2024-12-13',
    examsStart: '2024-11-25',
    sportsDay: '2024-11-01',
    ptaMeeting: '2024-10-12',
  },
  {
    id: 'cal_t2',
    term: 'Second Term (2024/2025)',
    resumptionDate: '2025-01-06',
    vacationDate: '2025-04-11',
    examsStart: '2025-03-24',
    sportsDay: '2025-02-14',
    ptaMeeting: '2025-02-22',
  },
  {
    id: 'cal_t3',
    term: 'Third Term (2024/2025)',
    resumptionDate: '2025-04-28',
    vacationDate: '2025-07-25',
    examsStart: '2025-07-07',
    sportsDay: '2025-06-13',
    ptaMeeting: '2025-05-31',
  },
];

export default function AdminCalendarPage() {
  const [calendar, setCalendar] = useState<CalendarTermEntry[]>(INITIAL_CALENDAR);
  const [msg, setMsg] = useState('');

  const handleDateChange = (id: string, field: keyof CalendarTermEntry, value: string) => {
    const target = calendar.find((c) => c.id === id);
    if (target) {
      (target as any)[field] = value;
      setCalendar([...calendar]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    logAuditEvent('Academic Calendar Updated', 'CMS', 'Updated term dates and resumption schedules');
    setMsg('Academic calendar published successfully!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Academic Session Calendar CMS</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Manage term resumption, mid-term breaks, exam dates, sports days, PTA meetings, and closing schedules.
          </p>
        </div>
      </div>

      {msg && <div className="p-3 bg-green-50 border border-green-200 text-green-800 font-bold rounded">{msg}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        {calendar.map((termItem) => (
          <div key={termItem.id} className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
            <h2 className="text-base font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2 flex items-center justify-between">
              <span>{termItem.term}</span>
              <span className="text-xs text-[var(--primary)] font-mono">Academic Year 2024/2025</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="block font-semibold mb-1">Resumption Date</label>
                <input
                  type="date"
                  value={termItem.resumptionDate}
                  onChange={(e) => handleDateChange(termItem.id, 'resumptionDate', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Exams Start Date</label>
                <input
                  type="date"
                  value={termItem.examsStart}
                  onChange={(e) => handleDateChange(termItem.id, 'examsStart', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Sports Day</label>
                <input
                  type="date"
                  value={termItem.sportsDay}
                  onChange={(e) => handleDateChange(termItem.id, 'sportsDay', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">PTA Meeting</label>
                <input
                  type="date"
                  value={termItem.ptaMeeting}
                  onChange={(e) => handleDateChange(termItem.id, 'ptaMeeting', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Vacation / Closing Date</label>
                <input
                  type="date"
                  value={termItem.vacationDate}
                  onChange={(e) => handleDateChange(termItem.id, 'vacationDate', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded font-mono"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2.5 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)]">
            Save Academic Calendar
          </button>
        </div>
      </form>
    </div>
  );
}
