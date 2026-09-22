'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { initialAuthState } from '@/lib/auth/action-state';
import { saveEventAction } from '@/lib/cms/actions';
import type { EventItem } from '@/lib/data/cms';

const CATEGORIES = ['assembly', 'sports', 'academics', 'cultural', 'pta', 'excursion', 'general'];

function toLocalInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EventForm({ event }: { event?: EventItem }) {
  const [state, formAction, isPending] = useActionState(saveEventAction, initialAuthState);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <Link href="/admin/events" className="text-xs font-bold text-[var(--primary)] hover:underline">
          ← Back to Events
        </Link>
        <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
          {event ? 'Edit Event' : 'Create School Event'}
        </h1>
      </div>

      <form action={formAction} className="bg-white p-6 border border-[var(--border)] rounded space-y-5">
        {event && <input type="hidden" name="id" value={event.id} />}

        {state.status !== 'idle' && (
          <div
            className={`p-3 text-xs rounded font-bold ${
              state.status === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {state.message}
            {state.errors && (
              <ul className="mt-1 list-disc list-inside font-normal">
                {Object.values(state.errors).map((msg) => (
                  <li key={msg}>{msg}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1" htmlFor="title">
              Event Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={event?.title ?? ''}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1" htmlFor="startsAt">Starts At *</label>
              <input id="startsAt" name="startsAt" type="datetime-local" required
                defaultValue={toLocalInput(event?.startsAt ?? null)}
                className="w-full p-2 border border-[var(--border)] rounded" />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="endsAt">Ends At</label>
              <input id="endsAt" name="endsAt" type="datetime-local"
                defaultValue={toLocalInput(event?.endsAt ?? null)}
                className="w-full p-2 border border-[var(--border)] rounded" />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="location">Location</label>
              <input id="location" name="location" type="text" placeholder="e.g. School Main Hall"
                defaultValue={event?.location ?? ''}
                className="w-full p-2 border border-[var(--border)] rounded" />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="category">Category *</label>
              <select id="category" name="category" defaultValue={event?.category ?? 'general'}
                className="w-full p-2 border border-[var(--border)] rounded font-bold">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="description">Description</label>
            <textarea id="description" name="description" rows={6} defaultValue={event?.description ?? ''}
              className="w-full p-2 border border-[var(--border)] rounded" />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="coverImageUrl">Cover Image URL</label>
            <input id="coverImageUrl" name="coverImageUrl" type="url" defaultValue={event?.coverImageUrl ?? ''}
              className="w-full p-2 border border-[var(--border)] rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1" htmlFor="status">Status *</label>
              <select id="status" name="status" defaultValue={event?.status ?? 'published'}
                className="w-full p-2 border border-[var(--border)] rounded font-bold">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <label className="flex items-center gap-2 font-semibold self-end pb-2">
              <input type="checkbox" name="isFeatured" defaultChecked={event?.isFeatured ?? false} className="w-4 h-4" />
              <span>Feature on homepage</span>
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] disabled:opacity-50"
          >
            {isPending ? 'Saving…' : event ? 'Save Changes' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
