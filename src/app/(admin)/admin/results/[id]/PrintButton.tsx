'use client';

import { useRouter } from 'next/navigation';

export function PrintButton() {
  const router = useRouter();
  return (
    <div className="flex gap-2">
      <button type="button" onClick={() => window.print()} className="btn-primary">
        Print report
      </button>
      <button type="button" onClick={() => router.back()} className="btn-secondary">
        ← Back
      </button>
    </div>
  );
}
