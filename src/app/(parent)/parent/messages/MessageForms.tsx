'use client';

import { useActionState } from 'react';
import { initialAuthState } from '@/lib/auth/action-state';
import { markMessageReadAction, sendMessageAction } from '@/lib/portal/actions';

export type ContactOption = { profileId: string; fullName: string; roleLabel: string };
export type WardOption = { studentId: string; fullName: string };

/** Compose form — parents and students may only write to the school office. */
export function MessageComposer({
  contacts,
  wards,
}: {
  contacts: ContactOption[];
  wards: WardOption[];
}) {
  const [state, formAction, isPending] = useActionState(sendMessageAction, initialAuthState);

  return (
    <form action={formAction} className="bg-white border border-[var(--border)] rounded overflow-hidden">
      <div className="p-4 border-b border-[var(--border)]">
        <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
          <i className="bi bi-pencil-square text-[var(--primary)]"></i>
          <span>Compose a message</span>
        </h2>
        <p className="text-[11px] text-[var(--muted-text)]">
          Messages go to the school office. Replies appear in this thread list.
        </p>
      </div>

      {state.status !== 'idle' && (
        <div
          className={`m-4 p-3 text-xs rounded font-bold ${
            state.status === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {state.message}
        </div>
      )}

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold mb-1" htmlFor="recipientId">
            Recipient
          </label>
          <select
            id="recipientId"
            name="recipientId"
            required
            defaultValue={contacts[0]?.profileId ?? ''}
            className="w-full p-2 border border-[var(--border)] rounded font-bold"
          >
            {contacts.length === 0 && <option value="">No office account available</option>}
            {contacts.map((contact) => (
              <option key={contact.profileId} value={contact.profileId}>
                {contact.fullName} — {contact.roleLabel}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="studentId">
            About (optional)
          </label>
          <select
            id="studentId"
            name="studentId"
            defaultValue=""
            className="w-full p-2 border border-[var(--border)] rounded font-bold"
          >
            <option value="">General enquiry</option>
            {wards.map((ward) => (
              <option key={ward.studentId} value={ward.studentId}>
                {ward.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block font-semibold mb-1" htmlFor="subject">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            minLength={3}
            maxLength={120}
            placeholder="e.g. Outstanding balance for second term"
            className="w-full p-2 border border-[var(--border)] rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-semibold mb-1" htmlFor="body">
            Message
          </label>
          <textarea
            id="body"
            name="body"
            required
            minLength={10}
            rows={5}
            maxLength={4000}
            placeholder="Write your message to the school office…"
            className="w-full p-2 border border-[var(--border)] rounded"
          />
        </div>
      </div>

      <div className="p-4 bg-[var(--soft-bg)] border-t border-[var(--border)] flex justify-end">
        <button
          type="submit"
          disabled={isPending || contacts.length === 0}
          className="px-6 py-2 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)] disabled:opacity-50"
        >
          {isPending ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </form>
  );
}

/** Small inline button that flags one received message as read. */
export function MarkReadButton({ messageId }: { messageId: string }) {
  const [state, formAction, isPending] = useActionState(markMessageReadAction, initialAuthState);

  return (
    <form action={formAction}>
      <input type="hidden" name="messageId" value={messageId} />
      <button
        type="submit"
        disabled={isPending}
        className="px-2.5 py-1 border border-[var(--border)] rounded text-[10px] font-bold hover:bg-[var(--soft-bg)] disabled:opacity-50"
      >
        {isPending ? 'Updating…' : state.status === 'error' ? 'Retry' : 'Mark as read'}
      </button>
    </form>
  );
}
