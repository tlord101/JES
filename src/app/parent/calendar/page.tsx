'use client';

import { defaultCalendarEvents } from '@/lib/parentData';

export default function ParentCalendarPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold rounded">
            Academic Calendar
          </span>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
            School Term Calendar & Events
          </h1>
          <p className="text-xs text-[var(--muted-text)]">
            Key academic dates, examination windows, sports festivals, and PTA assemblies.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4 text-xs">
        <h2 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
          <i className="bi bi-calendar3 text-[var(--primary)]"></i>
          <span>Academic Schedule (Second Term 2024/2025)</span>
        </h2>

        <div className="space-y-3">
          {defaultCalendarEvents.map((evt) => (
            <div key={evt.id} className="p-4 bg-[var(--soft-bg)] border border-[var(--border)] rounded flex justify-between items-center">
              <div>
                <span className="px-2 py-0.5 bg-[var(--primary)] text-white text-[10px] font-bold rounded">
                  {evt.category}
                </span>
                <h3 className="font-extrabold text-sm text-[var(--primary-dark)] mt-1">{evt.title}</h3>
                <p className="text-[11px] text-[var(--muted-text)] mt-0.5">{evt.description}</p>
              </div>

              <div className="text-right font-mono font-bold text-[var(--primary-dark)]">
                <div>{evt.date}</div>
                <div className="text-[10px] text-[var(--muted-text)]">{evt.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
