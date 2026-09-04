'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { galleryCMSStore, GalleryAlbum } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function CreateAlbumPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Culture');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80');
  const [photosStr, setPhotosStr] = useState('https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const photosArr = photosStr.split('\n').map((s) => s.trim()).filter(Boolean);

    const newAlbum: GalleryAlbum = {
      id: `alb_${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      coverImage,
      photoCount: photosArr.length,
      category,
      photos: photosArr,
    };

    galleryCMSStore.push(newAlbum);
    logAuditEvent('Gallery Album Created', 'CMS', `Created photo album "${title}" with ${photosArr.length} photos`);
    router.push('/admin/gallery');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex justify-between items-center">
        <div>
          <Link href="/admin/gallery" className="font-bold text-[var(--primary)] hover:underline">
            ← Back to Gallery Albums
          </Link>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">Create Photo Album</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
        <div>
          <label className="block font-semibold mb-1">Album Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Inter-House Sports Competition 2025"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-[var(--border)] rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded font-bold"
            >
              <option value="Culture">Culture</option>
              <option value="Sports">Sports</option>
              <option value="Academics">Academics</option>
              <option value="Graduation">Graduation</option>
              <option value="Campus">Campus Life</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Cover Image URL *</label>
            <input
              type="text"
              required
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Photo URLs (One per line)</label>
          <textarea
            rows={5}
            value={photosStr}
            onChange={(e) => setPhotosStr(e.target.value)}
            className="w-full p-2 border border-[var(--border)] rounded font-mono"
          ></textarea>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Link href="/admin/gallery" className="px-4 py-2 border border-[var(--border)] font-bold rounded">
            Cancel
          </Link>
          <button type="submit" className="px-5 py-2 bg-[var(--primary)] text-white font-bold rounded">
            Publish Photo Album
          </button>
        </div>
      </form>
    </div>
  );
}
