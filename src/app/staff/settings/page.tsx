'use client';

import React, { useState } from 'react';
import { mockStaffProfile } from '@/lib/staffData';

export default function StaffSettingsPage() {
  const [phone, setPhone] = useState(mockStaffProfile.phone);
  const [email, setEmail] = useState(mockStaffProfile.email);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Staff Account Settings</h1>
        <p className="text-sm text-slate-500">Manage contact information, preferences, and password security.</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl">
          Account preferences updated successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Staff Member Name</label>
          <input
            type="text"
            disabled
            value={mockStaffProfile.name}
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-600 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Official Staff ID</label>
          <input
            type="text"
            disabled
            value={mockStaffProfile.staffId}
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-600 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm"
          >
            Save Account Settings
          </button>
        </div>
      </form>
    </div>
  );
}
