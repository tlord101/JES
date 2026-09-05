'use client';

import React, { useState } from 'react';
import { StaffSidebar } from '@/components/staff/StaffSidebar';
import { StaffHeader } from '@/components/staff/StaffHeader';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <StaffSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        <StaffHeader setMobileOpen={setMobileOpen} />
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
