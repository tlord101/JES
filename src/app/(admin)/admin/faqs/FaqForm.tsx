'use client';

import { useActionState } from 'react';
import { initialAuthState } from '@/lib/auth/action-state';
import { saveFaqAction } from '@/lib/cms/actions';

const CATEGORIES = ['admissions', 'fees', 'academics', 'transport', 'uniforms', 'general'];

export default function FaqForm() {
  const [state, formAction, isPending] = useActionState(saveFaqAction, initialAuthState);

  return (
    <form action={formAction} className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-semibold mb-1" htmlFor="question">
            Question *
          </label>
          <input
            id="question"
            name="question"
            type="text"
            required
            className="w-full p-2 border border-[var(--border)] rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="category">
            Category *
          </label>
          <select
            id="category"
            name="category"
            className="w-full p-2 border border-[var(--border)] rounded font-bold"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1" htmlFor="answer">
            Answer *
          </label>
          <textarea
            id="answer"
            name="answer"
            rows={3}
            required
            className="w-full p-2 border border-[var(--border)] rounded"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs font-semibold">
          <input type="checkbox" name="isPublished" defaultChecked className="w-4 h-4" />
          <span>Published</span>
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] disabled:opacity-50"
        >
          {isPending ? 'Saving…' : 'Add FAQ'}
        </button>
      </div>
    </form>
  );
}
