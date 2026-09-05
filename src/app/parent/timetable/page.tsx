'use client';

import { useState } from 'react';
import { defaultParentTimetableSlots, defaultWards } from '@/lib/parentData';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

export default function ParentTimetablePage() {
  const [selectedWardId, setSelectedWardId] = useState<string>(defaultWards[0]?.id || '');
  const [selectedDay, setSelectedDay] = useState<typeof DAYS[number]>('Monday');

  const filteredSlots = defaultParentTimetableSlots.filter(
    (t) => t.wardId === selectedWardId && t.day === selectedDay
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold rounded">
            Class Schedule
          </span>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
            Wards' Weekly Class Timetable
          </h1>
          <p className="text-xs text-[var(--muted-text)]">
            Daily class period breakdown, subject teachers, and room allocations.
          </p>
        </div>
      </div>

      {/* Ward Selector */}
      <div className="bg-white p-2 border border-[var(--border)] rounded flex flex-wrap gap-2 text-xs font-bold">
        {defaultWards.map((w) => (
          <button
            key={w.id}
            onClick={() => setSelectedWardId(w.id)}
            className={`px-4 py-2 rounded transition-colors flex items-center gap-1.5 ${
              selectedWardId === w.id
                ? 'bg-[var(--primary)] text-white'
                : 'text-[var(--text)] hover:bg-[var(--soft-bg)]'
            }`}
          >
            <i className="bi bi-person"></i>
            <span>{w.name} ({w.class})</span>
          </button>
        ))}
      </div>

      {/* Day Selector */}
      <div className="bg-white p-2 border border-[var(--border)] rounded flex flex-wrap gap-2 text-xs font-bold">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-3.5 py-1.5 rounded transition-colors ${
              selectedDay === day
                ? 'bg-[var(--primary-light)] text-[var(--primary-dark)] border border-[var(--primary)]'
                : 'text-[var(--text)] hover:bg-[var(--soft-bg)]'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Slots List */}
      <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4 text-xs">
        <h2 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
          <i className="bi bi-clock-history text-[var(--primary)]"></i>
          <span>{selectedDay} Periods</span>
        </h2>

        {filteredSlots.length === 0 ? (
          <p className="text-[var(--muted-text)]">No classes scheduled for this day.</p>
        ) : (
          <div className="space-y-3">
            {filteredSlots.map((slot) => (
              <div key={slot.id} className="p-4 bg-[var(--soft-bg)] border border-[var(--border)] rounded flex justify-between items-center">
                <div>
                  <div className="font-extrabold text-sm text-[var(--primary-dark)]">{slot.subjectName}</div>
                  <div className="text-[11px] text-[var(--muted-text)]">
                    Teacher: {slot.teacherName} • Room: {slot.room}
                  </div>
                </div>
                <div className="px-3 py-1 bg-white border font-mono font-bold text-[var(--primary-dark)] rounded">
                  {slot.timeSlot}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
