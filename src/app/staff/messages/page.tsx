'use client';

import React, { useState } from 'react';

export default function StaffMessagesPage() {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'Dr. Emmanuel Okafor (Parent)', time: 'Today 09:15', text: 'Good morning Mr. Adeleke, regarding David\'s further mathematics performance sheet.', read: true },
    { id: '2', sender: 'Vice Principal Academic', time: 'Yesterday 16:30', text: 'Please ensure all SS1 Blue quadratic results are saved as drafts.', read: true },
  ]);

  const [inputMsg, setInputMsg] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    setMessages([
      ...messages,
      { id: Date.now().toString(), sender: 'Mr. Babatunde Adeleke (You)', time: 'Just now', text: inputMsg, read: true },
    ]);
    setInputMsg('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Staff Messaging Portal</h1>
        <p className="text-sm text-slate-500">Communicate directly with school administration, parents, and colleagues.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Recent Communication Threads</h2>
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">{m.sender}</span>
                <span className="text-slate-400">{m.time}</span>
              </div>
              <p className="text-xs text-slate-700">{m.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="pt-2 flex gap-2">
          <input
            type="text"
            placeholder="Type your reply or new message..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
