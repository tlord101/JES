'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { initialAuthState } from '@/lib/auth/action-state';
import { saveAlbumAction } from '@/lib/cms/actions';
import type { GalleryAlbum } from '@/lib/data/cms';

const CATEGORIES = ['sports', 'academics', 'cultural', 'excursion', 'facilities', 'general'];

export default function AlbumForm({ album }: { album?: GalleryAlbum }) {
  const [state, formAction, isPending] = useActionState(saveAlbumAction, initialAuthState);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <Link href="/admin/gallery" className="text-xs font-bold text-[var(--primary)] hover:underline">
          ← Back to Gallery
        </Link>
        <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
          {album ? 'Edit Album' : 'Create Photo Album'}
        </h1>
      </div>

      <form action={formAction} className="bg-white p-6 border border-[var(--border)] rounded space-y-5">
        {album && <input type="hidden" name="id" value={album.id} />}

        {state.status !== 'idle' && (
          <div
            className={`p-3 text-xs rounded font-bold ${
              state.status === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {state.message}
          </div>
        )}

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1" htmlFor="title">
              Album Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={album?.title ?? ''}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1" htmlFor="category">
                Category *
              </label>
              <select
                id="category"
                name="category"
                defaultValue={album?.category ?? 'general'}
                className="w-full p-2 border border-[var(--border)] rounded font-bold"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="coverImageUrl">
                Cover Image URL
              </label>
              <input
                id="coverImageUrl"
                name="coverImageUrl"
                type="url"
                defaultValue={album?.coverImageUrl ?? ''}
                className="w-full p-2 border border-[var(--border)] rounded"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={album?.description ?? ''}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>

          <label className="flex items-center gap-2 font-semibold">
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={album?.isPublished ?? true}
              className="w-4 h-4"
            />
            <span>Published (visible on public gallery)</span>
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] disabled:opacity-50"
          >
            {isPending ? 'Saving…' : album ? 'Save Changes' : 'Create Album'}
          </button>
        </div>
      </form>
    </div>
  );
}
