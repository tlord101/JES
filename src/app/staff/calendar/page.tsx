import React from 'react';

export default function StaffCalendarPage() {
  const events = [
    { date: '2025-03-28', title: 'Mathematics Continuous Assessment Homework Deadline', type: 'Academic' },
    { date: '2025-04-10', title: 'Mid-Term Computer-Based Examinations (CBT)', type: 'Exam' },
    { date: '2025-04-12', title: 'Parent-Teacher Association Consultations', type: 'PTA' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Academic Calendar</h1>
        <p className="text-sm text-slate-500">Scheduled school events, exam dates, and academic milestones.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="space-y-4">
          {events.map((ev, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 font-bold text-xs flex flex-col items-center justify-center">
                <span>{ev.date.slice(8)}</span>
                <span className="text-[10px] uppercase">{ev.date.slice(5, 7)}</span>
              </div>
              <div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                  {ev.type}
                </span>
                <h2 className="text-sm font-bold text-slate-900 mt-1">{ev.title}</h2>
                <span className="text-xs text-slate-500">{ev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
