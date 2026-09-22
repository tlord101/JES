'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { initialAuthState } from '@/lib/auth/action-state';
import { savePageAction } from '@/lib/cms/actions';
import type { CmsPage } from '@/lib/data/cms';

const SECTIONS = ['about', 'academics', 'admissions', 'principal', 'history', 'general'];

export default function PageForm({ page }: { page?: CmsPage }) {
  const [state, formAction, isPending] = useActionState(savePageAction, initialAuthState);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <Link href="/admin/pages" className="text-xs font-bold text-[var(--primary)] hover:underline">
          ← Back to Pages
        </Link>
        <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
          {page ? 'Edit Page' : 'Create Editable Page'}
        </h1>
      </div>

      <form action={formAction} className="bg-white p-6 border border-[var(--border)] rounded space-y-5">
        {page && <input type="hidden" name="id" value={page.id} />}

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
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={page?.title ?? ''}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1" htmlFor="slug">
                Slug (URL segment)
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                defaultValue={page?.slug ?? ''}
                placeholder="auto-generated from title"
                className="w-full p-2 border border-[var(--border)] rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="section">
                Section *
              </label>
              <select
                id="section"
                name="section"
                defaultValue={page?.section ?? 'general'}
                className="w-full p-2 border border-[var(--border)] rounded font-bold"
              >
                {SECTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="content">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              rows={12}
              required
              defaultValue={page?.content ?? ''}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>

          <label className="flex items-center gap-2 font-semibold">
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={page?.isPublished ?? true}
              className="w-4 h-4"
            />
            <span>Published</span>
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] disabled:opacity-50"
          >
            {isPending ? 'Saving…' : page ? 'Save Changes' : 'Create Page'}
          </button>
        </div>
      </form>
    </div>
  );
}
