'use client';

import { useState } from 'react';
import ParentSidebar from '@/components/parent/ParentSidebar';
import ParentHeader from '@/components/parent/ParentHeader';

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--soft-bg)] flex flex-col lg:flex-row">
      <ParentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <ParentHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
