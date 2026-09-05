import React from 'react';

export default function StaffAnnouncementsPage() {
  const announcements = [
    { id: '1', title: 'Mid-Term CBT Question Bank Deadline', date: '2025-03-22', category: 'Academic Notice', sender: 'Vice Principal Academic', content: 'All subject teachers are instructed to populate question bank items for Mid-Term CBT papers before March 30, 2025.' },
    { id: '2', title: 'Parent-Teacher Consultations (PTA)', date: '2025-03-15', category: 'Event', sender: 'Principal Office', content: 'First Term PTA consultation day is scheduled for April 12. Please update draft academic records for your form classes.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Staff Announcements & Directives</h1>
        <p className="text-sm text-slate-500">Official circulars, academic deadlines, and school events.</p>
      </div>

      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                {a.category}
              </span>
              <span className="text-xs text-slate-400">{a.date}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">{a.title}</h2>
            <p className="text-xs text-slate-700 leading-relaxed">{a.content}</p>
            <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100">
              Issued by: {a.sender}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
