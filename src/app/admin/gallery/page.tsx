'use client';

import { useState } from 'react';
import Link from 'next/link';
import { galleryCMSStore, GalleryAlbum } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([...galleryCMSStore]);

  const handleDelete = (id: string) => {
    const idx = galleryCMSStore.findIndex((a) => a.id === id);
    if (idx !== -1) {
      const removed = galleryCMSStore.splice(idx, 1)[0];
      setAlbums([...galleryCMSStore]);
      logAuditEvent('Gallery Album Deleted', 'CMS', `Deleted album "${removed.title}"`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Gallery & Photo Albums CMS</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Organize campus photography, cultural events, sports competitions, and graduation albums.
          </p>
        </div>
        <Link
          href="/admin/gallery/create"
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-images"></i>
          <span>Create New Photo Album</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {albums.map((alb) => (
          <div key={alb.id} className="bg-white border border-[var(--border)] rounded overflow-hidden flex flex-col justify-between text-xs">
            <div>
              <img
                src={alb.coverImage}
                alt={alb.title}
                className="w-full h-40 object-cover border-b border-[var(--border)]"
              />
              <div className="p-4 space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold rounded">
                    {alb.category}
                  </span>
                  <span className="font-bold text-[var(--muted-text)]">{alb.photoCount} Photos</span>
                </div>
                <h3 className="font-bold text-sm text-[var(--primary-dark)] pt-1">{alb.title}</h3>
              </div>
            </div>

            <div className="p-4 border-t border-[var(--border)] flex justify-end gap-2">
              <button
                onClick={() => handleDelete(alb.id)}
                className="px-3 py-1 bg-red-600 text-white font-bold rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
