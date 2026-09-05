import React from 'react';

export default function StaffTimetablePage() {
  const schedule = [
    { day: 'Monday', period: 'Period 1 (08:30 - 09:15)', subject: 'Mathematics', class: 'SS 1 Blue', room: 'Room B-12' },
    { day: 'Monday', period: 'Period 4 (11:15 - 12:00)', subject: 'Further Mathematics', class: 'SS 1 Blue', room: 'Room B-12' },
    { day: 'Tuesday', period: 'Period 2 (09:15 - 10:00)', subject: 'Basic Technology', class: 'JSS 2 Gold', room: 'Room A-08' },
    { day: 'Wednesday', period: 'Period 3 (10:30 - 11:15)', subject: 'Mathematics', class: 'SS 1 Blue', room: 'Room B-12' },
    { day: 'Thursday', period: 'Period 1 (08:30 - 09:15)', subject: 'Further Mathematics', class: 'SS 1 Blue', room: 'Room B-12' },
    { day: 'Friday', period: 'Period 5 (12:00 - 12:45)', subject: 'Basic Technology', class: 'JSS 2 Gold', room: 'Workshop B' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Weekly Teaching Timetable</h1>
        <p className="text-sm text-slate-500">Your scheduled periods across SS 1 Blue and JSS 2 Gold.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase bg-slate-50">
                <th className="py-3 px-3">Day</th>
                <th className="py-3 px-3">Time Period</th>
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3">Target Class</th>
                <th className="py-3 px-3">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedule.map((slot, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">{slot.day}</td>
                  <td className="py-3 px-3 font-medium text-slate-600">{slot.period}</td>
                  <td className="py-3 px-3 font-semibold text-blue-700">{slot.subject}</td>
                  <td className="py-3 px-3 text-slate-800">{slot.class}</td>
                  <td className="py-3 px-3 text-slate-500">{slot.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
