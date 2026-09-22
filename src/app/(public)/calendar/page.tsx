'use client';

import { useState } from 'react';
import Link from 'next/link';
import { termCalendar } from '@/data/calendar';

export default function CalendarPage() {
  const [selectedTerm, setSelectedTerm] = useState<'All' | 'First Term' | 'Second Term' | 'Third Term'>('All');

  const filteredEvents = termCalendar.filter((item) => selectedTerm === 'All' || item.term === selectedTerm);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Resumption':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Exams':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PTA':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Sports':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Holiday':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Closing':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-8">

        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Academic Year 2025/2026</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">School Term Calendar</h1>
          <p className="text-xs text-[var(--muted-text)] mt-1">
            Important dates for First Term, Second Term, Third Term, examinations, PTA assemblies, sports day, and holidays.
          </p>
        </div>

        {/* Term Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          {(['All', 'First Term', 'Second Term', 'Third Term'] as const).map((term) => (
            <button
              key={term}
              onClick={() => setSelectedTerm(term)}
              className={`px-4 py-2 text-xs font-bold rounded transition-colors ${
                selectedTerm === term
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--soft-bg)] border border-[var(--border)] text-[var(--text)] hover:bg-slate-100'
              }`}
            >
              {term}
            </button>
          ))}
        </div>

        {/* Calendar Events List */}
        <div className="space-y-4">
          {filteredEvents.map((evt, idx) => (
            <div
              key={idx}
              className="p-5 border border-[var(--border)] rounded bg-[var(--soft-bg)] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getCategoryBadge(evt.category)}`}>
                    {evt.category}
                  </span>
                  <span className="text-xs font-semibold text-[var(--primary)]">{evt.term}</span>
                </div>
                <h3 className="font-bold text-base text-[var(--primary-dark)]">{evt.title}</h3>
                {evt.description && <p className="text-xs text-[var(--muted-text)]">{evt.description}</p>}
              </div>

              <div className="text-xs font-bold text-[var(--primary-dark)] bg-white px-4 py-2 border border-slate-300 rounded shrink-0 self-start md:self-auto">
                <i className="bi bi-calendar3 mr-2 text-[var(--primary)]"></i>
                {evt.date}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200">
          <Link href="/events" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> View Highlighted School Events
          </Link>
        </div>

      </div>
    </div>
  );
}
