'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { initialAuthState } from '@/lib/auth/action-state';
import { saveNewsAction } from '@/lib/cms/actions';
import type { NewsItem } from '@/lib/data/cms';

const CATEGORIES = ['announcement', 'achievement', 'event', 'sports', 'academics', 'general'];

export default function NewsForm({ article }: { article?: NewsItem }) {
  const [state, formAction, isPending] = useActionState(saveNewsAction, initialAuthState);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <Link href="/admin/news" className="text-xs font-bold text-[var(--primary)] hover:underline">
          ← Back to News
        </Link>
        <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
          {article ? 'Edit Article' : 'Create News Article'}
        </h1>
      </div>

      <form action={formAction} className="bg-white p-6 border border-[var(--border)] rounded space-y-5">
        {article && <input type="hidden" name="id" value={article.id} />}

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
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={article?.title ?? ''}
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
                defaultValue={article?.category ?? 'general'}
                className="w-full p-2 border border-[var(--border)] rounded font-bold"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="status">
                Status *
              </label>
              <select
                id="status"
                name="status"
                defaultValue={article?.status ?? 'published'}
                className="w-full p-2 border border-[var(--border)] rounded font-bold"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="coverImageUrl">
              Cover Image URL (Supabase Storage or external)
            </label>
            <input
              id="coverImageUrl"
              name="coverImageUrl"
              type="url"
              defaultValue={article?.coverImageUrl ?? ''}
              placeholder="https://…"
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="excerpt">
              Excerpt (auto-generated from content if blank)
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              defaultValue={article?.excerpt ?? ''}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="content">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              rows={10}
              required
              defaultValue={article?.content ?? ''}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>

          <label className="flex items-center gap-2 font-semibold">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={article?.isFeatured ?? false}
              className="w-4 h-4"
            />
            <span>Feature on homepage</span>
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] disabled:opacity-50"
          >
            {isPending ? 'Saving…' : article ? 'Save Changes' : 'Create Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
