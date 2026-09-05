'use client';

import { useState } from 'react';
import { defaultParentProfile } from '@/lib/parentData';

export default function ParentProfilePage() {
  const [profile] = useState(defaultParentProfile);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold rounded">
            Parent Bio
          </span>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
            Parent / Guardian Official Profile
          </h1>
          <p className="text-xs text-[var(--muted-text)]">
            Personal contact details, emergency information, and linked student ward records.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Parent Card */}
        <div className="bg-white p-6 border border-[var(--border)] rounded space-y-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-[var(--primary-light)] border-4 border-[var(--primary)] flex items-center justify-center text-3xl font-black text-[var(--primary-dark)]">
            {profile.name.charAt(0)}
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-[var(--primary-dark)]">{profile.name}</h2>
            <p className="text-xs font-bold text-[var(--primary)]">{profile.occupation}</p>
            <p className="text-[11px] text-[var(--muted-text)]">{profile.employer}</p>
          </div>

          <div className="w-full pt-4 border-t border-[var(--border)] space-y-2 text-xs text-left">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-[var(--muted-text)]">Account Status:</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold text-[10px] rounded">Active</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-[var(--muted-text)]">Phone:</span>
              <span className="font-bold text-[var(--primary-dark)]">{profile.phone}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[var(--muted-text)]">Email:</span>
              <span className="font-bold text-[var(--primary-dark)]">{profile.email}</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Details & Wards List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
              <i className="bi bi-person-text text-[var(--primary)]"></i>
              <span>Contact & Residential Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                <span className="text-[var(--muted-text)] block text-[10px] uppercase font-bold">Full Name</span>
                <span className="font-bold text-[var(--primary-dark)] text-sm">{profile.name}</span>
              </div>

              <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                <span className="text-[var(--muted-text)] block text-[10px] uppercase font-bold">Email Address</span>
                <span className="font-bold text-[var(--primary-dark)] text-sm">{profile.email}</span>
              </div>

              <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                <span className="text-[var(--muted-text)] block text-[10px] uppercase font-bold">Phone Number</span>
                <span className="font-bold text-[var(--primary-dark)]">{profile.phone}</span>
              </div>

              <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                <span className="text-[var(--muted-text)] block text-[10px] uppercase font-bold">Occupation</span>
                <span className="font-bold text-[var(--primary-dark)]">{profile.occupation}</span>
              </div>

              <div className="sm:col-span-2 p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                <span className="text-[var(--muted-text)] block text-[10px] uppercase font-bold">Residential Address</span>
                <span className="font-bold text-[var(--primary-dark)]">{profile.address}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
              <i className="bi bi-shield-check text-[var(--primary)]"></i>
              <span>Emergency Contact</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                <span className="text-[var(--muted-text)] block text-[10px] uppercase font-bold">Emergency Contact Person</span>
                <span className="font-bold text-[var(--primary-dark)]">{profile.emergencyContactName}</span>
              </div>

              <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                <span className="text-[var(--muted-text)] block text-[10px] uppercase font-bold">Emergency Phone</span>
                <span className="font-bold text-[var(--primary-dark)]">{profile.emergencyContactPhone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
